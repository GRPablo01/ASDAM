import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-equipe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './add-equipe.html',
  styleUrl: './add-equipe.css',
})
export class AddEquipe implements OnInit {

  equipeForm!: FormGroup;
  selectedFile: File | null = null;
  preview: string | ArrayBuffer | null = null;
  equipes: any[] = [];
  loading = false;

  showNotification = false;
  notificationMessage = '';

  apiUrl = 'http://localhost:3000/api/team';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public themeService: ThemeService,
  ) {}

  showToast(message: string): void {

    this.notificationMessage = message;
    this.showNotification = true;
  
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  
  }
  
  closeNotification(): void {
    this.showNotification = false;
  }

  ngOnInit(): void {
    this.initForm();
    this.getTeams();
  }

  initForm(): void {
    this.equipeForm = this.fb.group({
      nom: ['', Validators.required],
      saison: ['', Validators.required],
      logo: [null, Validators.required]
    });
  }

  onFileSelect(event: any): void {

    const file = event.target.files?.[0];

    if (!file) {
      console.error('❌ Aucun fichier sélectionné');
      return;
    }

    this.selectedFile = file;

    this.equipeForm.patchValue({
      logo: file
    });

    const reader = new FileReader();

    reader.onload = () => {
      this.preview = reader.result;
    };

    reader.onerror = (err) => {
      console.error('❌ Erreur FileReader :', err);
    };

    reader.readAsDataURL(file);
  }

  createTeam(): void {

    if (this.equipeForm.invalid) {
      console.error('❌ Formulaire invalide :', this.equipeForm.value);
  
      this.showToast('Veuillez remplir tous les champs');
  
      this.equipeForm.markAllAsTouched();
      return;
    }
  
    if (!this.selectedFile) {
      console.error('❌ Aucun fichier sélectionné');
  
      this.showToast('Veuillez sélectionner un logo');
  
      return;
    }
  
    this.loading = true;
  
    const formData = new FormData();
  
    formData.append('nom', this.equipeForm.get('nom')?.value || '');
    formData.append('saison', this.equipeForm.get('saison')?.value || '');
    formData.append('logo', this.selectedFile);
  
    this.http.post(`${this.apiUrl}/create`, formData)
      .subscribe({
  
        next: () => {
  
          this.loading = false;
  
          this.equipeForm.reset();
  
          this.preview = null;
          this.selectedFile = null;
  
          this.getTeams();
  
          // ✅ TOAST SUCCESS
          this.showToast('Équipe créée avec succès');
  
        },
  
        error: (err) => {
  
          console.error('❌ Erreur création équipe :', err);
  
          this.loading = false;
  
          // ❌ TOAST ERROR
          this.showToast('Erreur lors de la création');
  
        }
  
      });
  }

  getTeams(): void {

    this.http.get<any[]>(this.apiUrl)
      .subscribe({

        next: (data) => {
          this.equipes = data;
        },

        error: (err) => {
          console.error('❌ Erreur récupération équipes :', err);
        }

      });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}