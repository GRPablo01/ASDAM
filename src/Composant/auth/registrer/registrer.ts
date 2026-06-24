import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../../../Backend/Services/theme.service';

import { Icon } from '../../Share/icon/icon';
import { Theme } from '../../Share/Page-Header/theme/theme';

@Component({
  selector: 'app-registrer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    Theme,
    Icon
  ],
  templateUrl: './registrer.html',
  styleUrls: ['./registrer.css']
})
export class Registrer implements OnInit {

  registerForm!: FormGroup;

  showPassword = false;
  isSubmitting = false;

  currentStep = 1;

  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  roles = ['joueur', 'entraineur', 'admin', 'invité'];

  equipes = [
    'U6','U7','U8','U9','U10','U11','U12',
    'U13','U13F','U18','U23','SeniorA','SeniorB','SeniorD'
  ];

  private codeParRole: Record<string, string> = {
    joueur: 'Joueur2026',
    entraineur: 'Coach2026',
    admin: 'Admin2026'
  };

  private readonly apiUrl = 'http://localhost:3000/api/auth/register';
  private readonly logUrl = 'http://localhost:3000/api/logs';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.initForm();

    // sécurité: synchronisation si rôle change dans UI
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.handleRoleChange(role);
    });
  }

  /* ================= FORM ================= */

  private initForm(): void {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

      role: ['joueur', Validators.required],
      equipe: [''],
      codeAcces: [''],

      club: ['ASDAM']
    });
  }

  /* ================= STEPS ================= */

  nextStep(): void {
    if (this.currentStep < 4) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  /* ================= ROLE LOGIC SAFE ================= */

  private handleRoleChange(role: string): void {
    if (!role) return;

    switch (role) {
      case 'invité':
        this.registerForm.patchValue({ equipe: '', codeAcces: '' });
        break;

      case 'admin':
        this.registerForm.patchValue({ equipe: 'ALL', codeAcces: '' });
        break;

      case 'joueur':
      case 'entraineur':
        this.registerForm.patchValue({ equipe: '', codeAcces: '' });
        break;
    }
  }

  /* ================= VALIDATION CODE ================= */

  private isCodeValid(role: string, code: string): boolean {
    if (!role || !code) return false;
    return this.codeParRole[role] === code;
  }

  /* ================= USER LOCAL ================= */

  private getCurrentUser(): any {
    try {
      const user = localStorage.getItem('utilisateur');
      return user ? JSON.parse(user) : {
        prenom: 'Inconnu',
        nom: '',
        role: 'unknown'
      };
    } catch {
      return {
        prenom: 'Inconnu',
        nom: '',
        role: 'unknown'
      };
    }
  }

  /* ================= SUBMIT SAFE ================= */

  onSubmit(): void {

    this.message = null;
    this.messageType = null;

    if (this.registerForm.invalid) {
      this.setError('Formulaire invalide');
      return;
    }

    const form = this.registerForm.getRawValue();

    // ================= VALIDATIONS =================
    if (form.role !== 'invité') {

      if (!form.codeAcces) {
        return this.setError('Code obligatoire');
      }

      if (!this.isCodeValid(form.role, form.codeAcces)) {
        return this.setError('Code incorrect');
      }
    }

    if (
      (form.role === 'joueur' || form.role === 'entraineur') &&
      !form.equipe
    ) {
      return this.setError('Équipe obligatoire');
    }

    // ================= CLEAN DATA =================
    const payload: any = {
      nom: form.nom?.trim(),
      prenom: form.prenom?.trim(),
      email: form.email?.trim(),
      password: form.password,
      role: form.role,
    };

    if (form.equipe) payload.equipe = form.equipe;
    if (form.codeAcces) payload.codeAcces = form.codeAcces;

    this.isSubmitting = true;

    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        const userId = res?.userId;
        if (!userId) return this.setError('Erreur serveur (userId manquant)');

        localStorage.setItem('utilisateur', JSON.stringify({
          _id: userId,
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          role: form.role,
          equipe: form.equipe || null
        }));

        this.setSuccess('Inscription réussie 🎉');

        this.sendLog(form);

        this.resetForm();

        setTimeout(() => {
          this.router.navigate(['/accueil']);
        }, 1000);
      },

      error: (err) => {
        this.isSubmitting = false;

        console.error('REGISTER ERROR:', err);

        this.setError(
          err?.error?.message || 'Erreur serveur'
        );
      }
    });
  }

  /* ================= LOG SYSTEM SAFE ================= */

  private sendLog(form: any): void {
    const currentUser = this.getCurrentUser();

    const logData = {
      user: `${currentUser.prenom} ${currentUser.nom}`,
      role: form.role,
      action: 'REGISTER_USER',
      description: `${form.prenom} ${form.nom} inscrit`,
      type: 'CREATE',
      newValue: form,
      date: new Date()
    };

    this.http.post(this.logUrl, logData)
      .subscribe({ error: () => {} }); // silencieux volontaire
  }

  /* ================= UI HELPERS ================= */

  private setError(msg: string): void {
    this.messageType = 'error';
    this.message = msg;
  }

  private setSuccess(msg: string): void {
    this.messageType = 'success';
    this.message = msg;
  }

  private resetForm(): void {
    this.registerForm.reset({
      role: 'joueur',
      club: 'ASDAM'
    });

    this.currentStep = 1;
  }
}