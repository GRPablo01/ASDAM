/* =========================================================
   ADD CONVO COMPONENT - FINAL VERSION
   ========================================================= */

import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import {
  ConvocationService,
  Convocation
} from '../../../../../Backend/Services/convocation.service';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { AuthService } from '../../../../../Backend/Services/auth.service';

import {
  JoueurService,
  Joueur
} from '../../../../../Backend/Services/joueur.service';

import { Icon } from '../../icon/icon';

interface Formation {
  id: string;
  name: string;
  structure: string;
  defense: number;
  midfield: number;
  attack: number;
  description: string;
}

interface StoredUser {
  role: string;
  equipe: string;
  theme?: 'clair' | 'sombre';
  [key: string]: any;
}

@Component({
  selector: 'app-add-convo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Icon],
  templateUrl: './add-convo.html',
  styleUrls: ['./add-convo.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddConvo implements OnInit {

  convocations: Convocation[] = [];

  joueursEquipe: Joueur[] = [];
  autresJoueurs: Joueur[] = [];
  allJoueurs: Joueur[] = [];

  joueursSelectionnes: Joueur[] = [];

  openOtherTeams = false;
  showFieldCompo = false;

  convocationForm!: FormGroup;

  loading = false;
  loadingPlayers = false;
  creatingConvocation = false;

  step = 1;

  searchTerm = '';
  searchOtherTeams = '';

  role = '';
  equipeUser = '';

  theme: 'clair' | 'sombre' = 'sombre';

  isLoggedIn = false;
  isMobile = false;

  selectedFormation = '4-4-2';

  animateStep = false;
  showSuccessToast = false;
  toastMessage = '';

  /* =========================================================
     JOUEURS DÉJÀ CONVOQUÉS
     ========================================================= */

  private convokedPlayers = new Set<string>();

  availableFormations: Formation[] = [
    {
      id: '4-4-2',
      name: 'Classique',
      structure: '4-4-2',
      defense: 4,
      midfield: 4,
      attack: 2,
      description: 'Equilibre parfait'
    },
    {
      id: '4-3-3',
      name: 'Offensif',
      structure: '4-3-3',
      defense: 4,
      midfield: 3,
      attack: 3,
      description: 'Pressing offensif'
    }
  ];

  constructor(
    private convocationService: ConvocationService,
    private fb: FormBuilder,
    private authService: AuthService,
    public themeService: ThemeService,
    private http: HttpClient,
    private router: Router,
    private joueurService: JoueurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkResponsive();
    this.loadUserFromStorage();
    this.initializeForm();

    this.loading = true;
    this.loadingPlayers = true;

    this.loadAllData();
  }

  /* =========================================================
     LOAD DATA
     ========================================================= */

  private loadAllData(): void {

    this.joueurService.getAllJoueurs().subscribe({

      next: (joueurs) => {

        this.convocationService.getConvocations().subscribe({

          next: (convocs) => {

            console.log('CONVOCATIONS :', convocs);

            this.handleJoueurs(joueurs || []);
            this.handleConvocations(convocs || []);

            this.loading = false;
            this.loadingPlayers = false;

            this.cdr.markForCheck();
          },

          error: (err) => {

            console.error(err);

            this.handleJoueurs(joueurs || []);

            this.loading = false;
            this.loadingPlayers = false;

            this.cdr.markForCheck();
          }

        });

      },

      error: (err) => {

        console.error(err);

        this.loadingPlayers = false;

        this.cdr.markForCheck();
      }

    });

  }

  /* =========================================================
     HANDLE JOUEURS
     ========================================================= */

  private handleJoueurs(joueurs: Joueur[]): void {

    this.allJoueurs = joueurs.map(j => ({
      ...j,
      selected: false
    }));

    this.joueursEquipe = this.allJoueurs.filter(
      j => this.normalizeEquipe(j.equipe) === this.normalizeEquipe(this.equipeUser)
    );

    this.autresJoueurs = this.allJoueurs.filter(
      j => this.normalizeEquipe(j.equipe) !== this.normalizeEquipe(this.equipeUser)
    );

  }

  /* =========================================================
     HANDLE CONVOCATIONS
     ========================================================= */

  private handleConvocations(data: any[]): void {

    this.convocations = data;

    this.convokedPlayers.clear();

    data.forEach(convocation => {

      (convocation.joueurs || []).forEach((joueur: any) => {

        const fullname =
          `${joueur.prenom || ''} ${joueur.nom || ''}`
            .trim()
            .toLowerCase();

        if (fullname) {
          this.convokedPlayers.add(fullname);
        }

      });

    });

    console.log('JOUEURS BLOQUÉS :');
    console.log(this.convokedPlayers);

  }

  /* =========================================================
     CHECK JOUEUR
     ========================================================= */

  isAlreadyConvoked(joueur: Joueur): boolean {

    const fullname =
      `${joueur.prenom || ''} ${joueur.nom || ''}`
        .trim()
        .toLowerCase();

    return this.convokedPlayers.has(fullname);

  }

  /* =========================================================
     SELECTION
     ========================================================= */

  toggleJoueur(j: Joueur): void {

    if (this.isAlreadyConvoked(j)) {
      return;
    }

    const index = this.joueursSelectionnes.findIndex(
      x =>
        x.prenom === j.prenom &&
        x.nom === j.nom
    );

    if (index >= 0) {

      this.joueursSelectionnes.splice(index, 1);

      j.selected = false;

      this.showToast(`${j.prenom} ${j.nom} retiré`);

    } else {

      this.joueursSelectionnes.push(j);

      j.selected = true;

      this.showToast(`${j.prenom} ${j.nom} ajouté`);

    }

    this.updateFormJoueur();

    this.cdr.markForCheck();

  }

  retirerJoueur(j: Joueur): void {

    j.selected = false;

    this.joueursSelectionnes =
      this.joueursSelectionnes.filter(
        x =>
          !(x.prenom === j.prenom && x.nom === j.nom)
      );

    this.updateFormJoueur();

    this.cdr.markForCheck();
  }

  updateFormJoueur(): void {

    const value = this.joueursSelectionnes
      .map(j => `${j.prenom} ${j.nom}`)
      .join(', ');

    this.convocationForm.patchValue({
      joueur: value
    });

  }

  initializeForm(): void {

    this.convocationForm = this.fb.group({
      match: ['', Validators.required],
      equipe: [this.equipeUser, Validators.required],
      lieu: ['', Validators.required],
      dateMatch: ['', Validators.required],
      statut: ['Convoque', Validators.required],
      joueur: ['', Validators.required]
    });

  }

  normalizeEquipe(value: string | undefined): string {
    return (value || '').trim().toLowerCase();
  }

  loadUserFromStorage(): void {

    const userString = localStorage.getItem('utilisateur');

    if (!userString) {

      const user = this.authService.getUser();

      this.role = user?.role || '';
      this.equipeUser = user?.equipe || '';

      return;
    }

    const user: StoredUser = JSON.parse(userString);

    this.role = user.role;
    this.equipeUser = user.equipe;

    this.theme = user.theme || 'sombre';

    this.isLoggedIn = true;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkResponsive();
  }

  checkResponsive(): void {
    this.isMobile = window.innerWidth <= 970;
  }

  nextStep(): void {

    if (
      this.step === 1 &&
      this.convocationForm.get('match')?.valid &&
      this.convocationForm.get('lieu')?.valid &&
      this.convocationForm.get('dateMatch')?.valid
    ) {

      this.step = 2;

    } else if (
      this.step === 2 &&
      this.joueursSelectionnes.length > 0
    ) {

      this.step = 3;

    }

  }

  prevStep(): void {
    this.step = Math.max(1, this.step - 1);
  }

  goToStep(step: number): void {
    this.step = step;
  }

  ajouterConvocation(): void {

    if (
      this.convocationForm.invalid ||
      !this.joueursSelectionnes.length
    ) {
      return;
    }

    this.creatingConvocation = true;

    const data: Convocation = {
      key: crypto.randomUUID(),
      joueurs: this.joueursSelectionnes.map(j => ({
        key: j.key,
        prenom: j.prenom,
        nom: j.nom,
        email: j.email || '',
        present: 'non_repondu'
      })),
      equipe: this.convocationForm.value.equipe,
      match: this.convocationForm.value.match,
      dateMatch: this.convocationForm.value.dateMatch,
      lieu: this.convocationForm.value.lieu,
      statut: this.convocationForm.value.statut,
      expanded: false,
      isRead: false
    };

    this.convocationService.createConvocation(data).subscribe({

      next: () => {

        this.creatingConvocation = false;

        this.showToast('Convocation envoyée avec succès !');

        this.resetForm();

        this.loadAllData();
      },

      error: (err) => {

        console.error(err);

        this.creatingConvocation = false;

        this.cdr.markForCheck();
      }

    });

  }

  resetForm(): void {

    this.convocationForm.reset({
      statut: 'Convoque',
      equipe: this.equipeUser
    });

    this.joueursSelectionnes = [];

    this.joueursEquipe.forEach(j => j.selected = false);
    this.autresJoueurs.forEach(j => j.selected = false);

    this.step = 1;

    this.searchTerm = '';
    this.searchOtherTeams = '';
  }

  showToast(message: string): void {

    this.toastMessage = message;

    this.showSuccessToast = true;

    this.cdr.markForCheck();

    setTimeout(() => {

      this.showSuccessToast = false;

      this.cdr.markForCheck();

    }, 2000);

  }

  get filteredJoueurs(): Joueur[] {

    const list = this.joueursEquipe || [];

    if (!this.searchTerm.trim()) {
      return list;
    }

    const t = this.searchTerm.toLowerCase();

    return list.filter(j =>
      j.nom?.toLowerCase().includes(t) ||
      j.prenom?.toLowerCase().includes(t)
    );

  }

  get filtrerAutresJoueurs(): Joueur[] {

    const list = this.autresJoueurs || [];

    if (!this.searchOtherTeams?.trim()) {
      return list;
    }

    const t = this.searchOtherTeams.toLowerCase();

    return list.filter(j =>
      j.nom?.toLowerCase().includes(t) ||
      j.prenom?.toLowerCase().includes(t)
    );

  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

}
