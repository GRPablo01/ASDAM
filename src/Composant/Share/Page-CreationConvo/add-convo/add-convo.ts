/* =========================================================
   ADD CONVO COMPONENT - FINAL REFACTORED VERSION
========================================================= */

import {
  Component,
  OnInit,
  HostListener
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

import { JoueurService, Joueur } from '../../../../../Backend/Services/joueur.service';

import { Icon } from '../../icon/icon';

/* =========================================================
   INTERFACES
========================================================= */

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
  id?: string;
  role: string;
  equipe: string;
  theme?: 'clair' | 'sombre';
  [key: string]: any;
}

/* =========================================================
   COMPONENT
========================================================= */

@Component({
  selector: 'app-add-convo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Icon
  ],
  templateUrl: './add-convo.html',
  styleUrls: ['./add-convo.css']
})
export class AddConvo implements OnInit {

  /* =========================================================
     DATA
  ========================================================= */

  convocations: Convocation[] = [];

  joueursEquipe: Joueur[] = [];      // équipe coach
  autresJoueurs: Joueur[] = [];      // autres équipes
  allJoueurs: Joueur[] = [];         // global cache

  joueursSelectionnes: Joueur[] = [];

  openOtherTeams: boolean = false;
  showFieldCompo = false;

  get selectedJoueurs(): Joueur[] {
    return this.joueursSelectionnes;
  }

  convocationForm!: FormGroup;

  loading = false;
  loadingPlayers = false;
  creatingConvocation = false;

  step = 1;

  searchTerm = '';

  role = '';
  equipeUser = '';

  message: string | null = null;

  theme: 'clair' | 'sombre' = 'sombre';

  isLoggedIn = false;
  isMobile = false;

  /* =========================================================
     TOAST
  ========================================================= */

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'info';

  /* =========================================================
     FORMATION
  ========================================================= */

  selectedFormation = '4-4-2';

  availableFormations: Formation[] = [
    { id: '4-4-2', name: 'Classique', structure: '4-4-2', defense: 4, midfield: 4, attack: 2, description: 'Équilibre parfait' },
    { id: '4-3-3', name: 'Offensif', structure: '4-3-3', defense: 4, midfield: 3, attack: 3, description: 'Pressing offensif' },
    { id: '4-5-1', name: 'Défensif', structure: '4-5-1', defense: 4, midfield: 5, attack: 1, description: 'Bloc solide' },
    { id: '3-5-2', name: 'Polyvalent', structure: '3-5-2', defense: 3, midfield: 5, attack: 2, description: 'Flexible' },
    { id: '5-3-2', name: 'Ultra défensif', structure: '5-3-2', defense: 5, midfield: 3, attack: 2, description: 'Mur défensif' },
    { id: '3-4-3', name: 'Tout attaque', structure: '3-4-3', defense: 3, midfield: 4, attack: 3, description: 'Offensif' },
    { id: '4-2-3-1', name: 'Moderne', structure: '4-2-3-1', defense: 4, midfield: 5, attack: 1, description: 'Double pivot' }
  ];

  private logUrl = 'http://localhost:3000/api/logs';

  /* =========================================================
     CONSTRUCTOR
  ========================================================= */

  constructor(
    private convocationService: ConvocationService,
    private fb: FormBuilder,
    private authService: AuthService,
    public themeService: ThemeService,
    private http: HttpClient,
    private router: Router,
    private joueurService: JoueurService
  ) {}

  /* =========================================================
     INIT
  ========================================================= */

  ngOnInit(): void {
    this.checkResponsive();
    this.loadUserFromStorage();
    this.initializeForm();
    this.loadConvocations();
    this.loadAllJoueurs();
  }

  /* =========================================================
     RESPONSIVE
  ========================================================= */

  @HostListener('window:resize')
  onResize(): void {
    this.checkResponsive();
  }

  checkResponsive(): void {
    this.isMobile = window.innerWidth <= 970;
  }

  /* =========================================================
     FORM
  ========================================================= */

  initializeForm(): void {
    this.convocationForm = this.fb.group({
      match: ['', Validators.required],
      equipe: [this.equipeUser, Validators.required],
      lieu: ['', Validators.required],
      dateMatch: ['', Validators.required],
      statut: ['Convoqué', Validators.required],
      joueur: ['', Validators.required]
    });
  }

  /* =========================================================
     USER
  ========================================================= */

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

  /* =========================================================
     LOAD ALL PLAYERS (IMPORTANT FIX)
  ========================================================= */

  loadAllJoueurs(): void {

    this.loadingPlayers = true;

    this.joueurService.getAllJoueurs().subscribe({
      next: (joueurs) => {

        this.allJoueurs = joueurs.map(j => ({
          ...j,
          selected: false
        }));

        this.joueursEquipe = this.allJoueurs.filter(
          j => j.equipe === this.equipeUser
        );

        this.autresJoueurs = this.allJoueurs.filter(
          j => j.equipe !== this.equipeUser
        );

        this.loadingPlayers = false;
      },
      error: () => {
        this.loadingPlayers = false;
      }
    });
  }

  /* =========================================================
     PLAYERS SELECTION
  ========================================================= */

  toggleJoueur(j: Joueur): void {

    j.selected = !j.selected;

    const id = j.key || (j as any)._id;

    if (j.selected) {
      if (!this.joueursSelectionnes.find(x => (x.key || (x as any)._id) === id)) {
        this.joueursSelectionnes.push(j);
      }
    } else {
      this.joueursSelectionnes =
        this.joueursSelectionnes.filter(x => (x.key || (x as any)._id) !== id);
    }

    this.updateFormJoueur();
  }

  retirerJoueur(j: Joueur): void {
    j.selected = false;

    const id = j.key || (j as any)._id;

    this.joueursSelectionnes =
      this.joueursSelectionnes.filter(x => (x.key || (x as any)._id) !== id);

    this.updateFormJoueur();
  }

  updateFormJoueur(): void {
    const value = this.joueursSelectionnes
      .map(j => `${j.prenom} ${j.nom}`)
      .join(', ');

    this.convocationForm.patchValue({ joueur: value });
  }

  /* =========================================================
     FILTER
  ========================================================= */

  get filteredJoueurs(): Joueur[] {

    if (!this.searchTerm?.trim()) {
      return this.joueursEquipe;
    }

    const term = this.searchTerm.toLowerCase();

    return this.joueursEquipe.filter(j =>
      j.nom?.toLowerCase().includes(term) ||
      j.prenom?.toLowerCase().includes(term)
    );
  }

  /* =========================================================
     FORMATION
  ========================================================= */

  onFormationChange(id: string): void {
    this.selectedFormation = id;
  }

  get currentFormation(): Formation {
    return this.availableFormations.find(f => f.id === this.selectedFormation)
      || this.availableFormations[0];
  }

  /* =========================================================
     CREATE CONVOCATION
  ========================================================= */

  ajouterConvocation(): void {

    if (this.convocationForm.invalid || this.joueursSelectionnes.length === 0) {
      return;
    }

    this.creatingConvocation = true;

    const joueursNoms = this.joueursSelectionnes.map(j => `${j.prenom} ${j.nom}`);

    const data = {
      ...this.convocationForm.value,
      joueurs: joueursNoms,
      joueursDetails: this.joueursSelectionnes,
      formation: this.selectedFormation
    };

    this.convocationService.createConvocation(data).subscribe({
      next: () => {
        this.creatingConvocation = false;
        this.resetForm();
        this.loadConvocations();
      },
      error: () => {
        this.creatingConvocation = false;
      }
    });
  }

  /* =========================================================
     LOAD CONVOCATIONS
  ========================================================= */

  loadConvocations(): void {
    this.loading = true;

    this.convocationService.getConvocations().subscribe({
      next: (data) => {
        this.convocations = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  /* =========================================================
     RESET
  ========================================================= */

  resetForm(): void {

    this.convocationForm.reset({
      statut: 'Convoqué',
      equipe: this.equipeUser
    });

    this.joueursSelectionnes = [];
    this.joueursEquipe.forEach(j => j.selected = false);

    this.selectedFormation = '4-4-2';
    this.step = 1;
  }

  /* =========================================================
     NAV
  ========================================================= */

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  /* =========================================================
     FIELD COMPO
  ========================================================= */

  openFieldCompo(): void {
    this.showFieldCompo = true;
  }

  closeFieldCompo(): void {
    this.showFieldCompo = false;
  }

  validateFieldCompo(): void {
    this.showFieldCompo = false;
  }

  /* =========================================================
     STYLE
  ========================================================= */

  inputStyle() {
    return {
      background: this.themeService.Background2 + '15',
      borderColor: this.themeService.Background2 + '30',
      color: this.themeService.Textprincipal
    };
  }

  filtrerAutresJoueurs(): any[] {
    console.log('👤 Équipe coach connecté :', this.equipeUser);
    console.log('📋 Tous les joueurs avant filtre :', this.autresJoueurs);
  
    if (!this.equipeUser) {
      console.log('⚠️ Aucune équipe coach -> retour liste complète');
      return this.autresJoueurs;
    }
  
    const equipesAutorisees = this.equipesAutorisees[this.equipeUser];
  
    console.log('🎯 Équipes autorisées pour ce coach :', equipesAutorisees);
  
    if (!equipesAutorisees) {
      console.log('⚠️ Aucune règle trouvée -> retour liste complète');
      return this.autresJoueurs;
    }
  
    const resultat = this.autresJoueurs.filter(joueur => {
      const match = joueur.equipe && equipesAutorisees.includes(joueur.equipe);
  
      console.log(
        `🔎 Joueur: ${joueur.prenom} ${joueur.nom} | équipe: ${joueur.equipe} | autorisé: ${match}`
      );
  
      return match;
    });
  
    console.log('✅ Résultat final filtré :', resultat);
  
    return resultat;
  }

  equipesAutorisees: Record<string, string[]> = {
    'U23': ['Senior A', 'Senior B', 'Senior  D'],
    'Senior A': ['U23', 'Senior  B', 'Senior  D'],
    'Senior B': ['U23', 'Senior  A', 'Senior  D'],
    'Senior D': ['U23', 'Senior  A', 'Senior  B']
  };
}