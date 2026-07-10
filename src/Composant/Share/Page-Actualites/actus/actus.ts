// ==========================================================
// ACTUS COMPONENT - VERSION PREMIUM DEBUG
// ==========================================================

import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ActusService,
  Actu
} from '../../../../../Backend/Services/actus.service';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Icon } from '../../icon/icon';
import { RouterLink } from '@angular/router';

type Role = 'entraineur' | 'admin' | 'joueur' | 'invite';

@Component({
  selector: 'app-actus',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Icon,
    RouterLink
  ],
  templateUrl: './actus.html',
  styleUrls: ['./actus.css']
})
export class Actus implements OnInit {

  // ==========================================================
  // DATA
  // ==========================================================

  actus: any[] = [];

  isDark = false;
  loading = false;

  selectedActu: any | null = null;

  isDetailOpen = false;
  isCreateModalOpen = false;

  menuOpen: boolean[] = [];

  isConnected = false;

  // ==========================================================
  // USER
  // ==========================================================

  userRole: Role = 'invite';

  userNom = '';
  userPrenom = '';
  currentUserId = '';

  // ==========================================================
  // RESPONSIVE
  // ==========================================================

  isMobile = window.innerWidth < 768;

  // ==========================================================
  // MASONRY
  // ==========================================================

  private readonly positions = [
    { left: 5, top: 0 },
    { left: 35, top: 30 },
    { left: 65, top: 10 },

    { left: 15, top: 320 },
    { left: 45, top: 280 },
    { left: 75, top: 350 },

    { left: 25, top: 620 },
    { left: 55, top: 580 },
    { left: 10, top: 520 },

    { left: 70, top: 680 },
    { left: 40, top: 850 },
    { left: 5, top: 780 }
  ];

  private readonly rotations = [
    -6,
    -3,
    -2,
    2,
    4,
    6,
    -5,
    5,
    -4,
    4,
    -2,
    3
  ];

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private actusService: ActusService,
    public themeService: ThemeService
  ) {

    console.log('====================================');
    console.log('ACTUS COMPONENT INITIALISÉ');
    console.log('====================================');

    this.checkScreenSize();
  }

  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    console.log('====================================');
    console.log('NG ON INIT');
    console.log('====================================');

    this.loadUser();

    this.detectTheme();

    this.loadActus();
  }

  // ==========================================================
  // RESPONSIVE
  // ==========================================================

  checkScreenSize(): void {

    this.isMobile = window.innerWidth < 768;

    console.log('SCREEN SIZE :', {
      width: window.innerWidth,
      height: window.innerHeight,
      mobile: this.isMobile
    });
  }

  @HostListener('window:resize')
  onResize(): void {

    console.log('WINDOW RESIZE');

    this.checkScreenSize();
  }

  // ==========================================================
  // THEME
  // ==========================================================

  detectTheme(): void {

    const bg = this.themeService.Backgroundsecondairetest || '';

    console.log('THEME BACKGROUND :', bg);

    this.isDark =
      bg.includes('020617') ||
      bg.includes('05155d') ||
      bg.includes('0f172a');

    console.log('MODE SOMBRE :', this.isDark);
  }

  // ==========================================================
  // USER
  // ==========================================================

  loadUser(): void {

    console.log('====================================');
    console.log('LOAD USER');
    console.log('====================================');

    const userData = localStorage.getItem('utilisateur');

    console.log('RAW LOCAL STORAGE :', userData);

    if (!userData) {

      console.log('AUCUN USER CONNECTÉ');

      this.userRole = 'invite';
      this.userNom = 'Visiteur';
      this.userPrenom = '';
      this.currentUserId = '';
      this.isConnected = false;

      return;
    }

    try {

      const parsed = JSON.parse(userData);

      console.log('USER PARSED :', parsed);

      this.userRole = parsed.role || 'joueur';

      this.userNom = parsed.nom || '';

      this.userPrenom = parsed.prenom || '';

      this.currentUserId =
        `${this.userPrenom} ${this.userNom}`.trim();

      this.isConnected = true;

      console.log('USER INFOS :', {
        role: this.userRole,
        nom: this.userNom,
        prenom: this.userPrenom,
        currentUserId: this.currentUserId,
        connected: this.isConnected
      });

    } catch (error) {

      console.error('ERREUR PARSE USER :', error);

      this.userRole = 'invite';
      this.isConnected = false;
    }
  }

  canManageActus(): boolean {

    const canManage =
      this.userRole === 'admin' ||
      this.userRole === 'entraineur';

    console.log('CAN MANAGE ACTUS :', canManage);

    return canManage;
  }

  isOwner(actu: any): boolean {

    const isOwner = actu?.auteur === this.currentUserId;

    console.log('CHECK OWNER :', {
      actuAuteur: actu?.auteur,
      currentUser: this.currentUserId,
      result: isOwner
    });

    return isOwner;
  }

  // ==========================================================
  // LOAD ACTUS
  // ==========================================================

  loadActus(): void {

    console.log('====================================');
    console.log('LOAD ACTUS');
    console.log('====================================');

    this.loading = true;

    console.log('LOADING START');

    this.actusService.getAllActus().subscribe({

      next: (data: any[]) => {

        console.log('====================================');
        console.log('ACTUS REÇUES DEPUIS API');
        console.log('====================================');

        console.log('DATA BRUTE :', data);

        console.log('TYPE DATA :', typeof data);

        console.log('IS ARRAY :', Array.isArray(data));

        console.log('LONGUEUR :', data?.length);

        if (!Array.isArray(data)) {

          console.warn('DATA N\'EST PAS UN TABLEAU');

          this.actus = [];

          this.loading = false;

          return;
        }

        this.actus = data.map((actu: any, index: number) => {

          console.log('------------------------------------');
          console.log(`ACTU ${index}`);
          console.log('------------------------------------');

          console.log('ACTU BRUTE :', actu);

          console.log('ID :', actu?._id);

          console.log('TITRE :', actu?.titre);

          console.log('DESCRIPTION :', actu?.description);

          console.log('AUTEUR :', actu?.auteur);

          console.log('IMAGE :', actu?.image);

          console.log('DATE :', actu?.createdAt);

          const imageUrl = actu?.image
            ? `http://localhost:3000/uploads/actus/${actu.image}`
            : 'assets/placeholder-news.jpg';

          console.log('IMAGE URL FINALE :', imageUrl);

          return {

            ...actu,

            imageUrl
          };

        }).sort((a, b) => {

          const dateA = a.createdAt
            ? new Date(a.createdAt).getTime()
            : 0;

          const dateB = b.createdAt
            ? new Date(b.createdAt).getTime()
            : 0;

          return dateB - dateA;
        });

        console.log('====================================');
        console.log('ACTUS APRÈS TRANSFORMATION');
        console.log('====================================');

        console.log(this.actus);

        this.menuOpen =
          new Array(this.actus.length).fill(false);

        console.log('MENU OPEN ARRAY :', this.menuOpen);

        this.loading = false;

        console.log('LOADING END');
      },

      error: (err) => {

        console.error('====================================');
        console.error('ERREUR RÉCUPÉRATION ACTUS');
        console.error('====================================');

        console.error(err);

        console.error('STATUS :', err?.status);

        console.error('MESSAGE :', err?.message);

        console.error('ERROR BODY :', err?.error);

        this.loading = false;

        this.actus = [];
      }
    });
  }

  refreshActus(): void {

    console.log('REFRESH ACTUS');

    this.loadActus();
  }

  // ==========================================================
  // MASONRY
  // ==========================================================

  getTransform(index: number): string {

    if (this.isMobile) {
      return 'none';
    }

    const rotation =
      this.rotations[index % this.rotations.length];

    return `rotate(${rotation}deg)`;
  }

  getPosition(index: number): { left: string; top: string } {

    if (this.isMobile) {

      return {
        left: '0',
        top: '0'
      };
    }

    const pos =
      this.positions[index % this.positions.length];

    const offsetTop = (index * 25) % 80;

    return {
      left: `${pos.left}%`,
      top: `${pos.top + offsetTop}px`
    };
  }

  getZIndex(index: number): number {

    return index;
  }

  // ==========================================================
  // STATUS ACTUS
  // ==========================================================

  isNew(actu: any): boolean {

    if (!actu?.createdAt) {
      return false;
    }

    const actuDate = new Date(actu.createdAt);

    const now = new Date();

    const diffDays = Math.floor(
      (now.getTime() - actuDate.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    console.log('CHECK NEW ACTU :', {
      titre: actu?.titre,
      diffDays,
      result: diffDays <= 7
    });

    return diffDays <= 7;
  }

  isVeryRecent(actu: any): boolean {

    if (!actu?.createdAt || this.actus.length === 0) {
      return false;
    }

    const result =
      this.actus[0]?._id === actu?._id &&
      this.isNew(actu);

    console.log('CHECK VERY RECENT :', {
      titre: actu?.titre,
      result
    });

    return result;
  }

  // ==========================================================
  // DETAIL
  // ==========================================================

  openActuDetail(actu: any): void {

    console.log('OPEN DETAIL :', actu);

    this.selectedActu = actu;

    this.isDetailOpen = true;

    document.body.style.overflow = 'hidden';
  }

  closeDetail(): void {

    console.log('CLOSE DETAIL');

    this.isDetailOpen = false;

    this.selectedActu = null;

    document.body.style.overflow = 'auto';
  }

  // ==========================================================
  // CREATE MODAL
  // ==========================================================

  openCreateModal(): void {

    console.log('OPEN CREATE MODAL');

    this.isCreateModalOpen = true;

    document.body.style.overflow = 'hidden';
  }

  closeCreateModal(): void {

    console.log('CLOSE CREATE MODAL');

    this.isCreateModalOpen = false;

    document.body.style.overflow = 'auto';
  }

  // ==========================================================
  // MENU
  // ==========================================================

  toggleMenu(event: Event, index: number): void {

    event.stopPropagation();

    console.log('TOGGLE MENU INDEX :', index);

    this.menuOpen =
      this.menuOpen.map((open, i) =>
        i === index ? !open : false
      );

    console.log('MENU STATE :', this.menuOpen);
  }

  closeAllMenus(): void {

    console.log('CLOSE ALL MENUS');

    this.menuOpen.fill(false);
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  deleteActu(
    event: Event,
    actu: any,
    index: number
  ): void {

    event.stopPropagation();

    console.log('DELETE ACTU :', {
      actu,
      index
    });

    const confirmed = confirm(
      `Supprimer "${actu?.titre}" ?`
    );

    console.log('CONFIRM DELETE :', confirmed);

    if (!confirmed) {
      return;
    }

    this.actus.splice(index, 1);

    this.menuOpen.splice(index, 1);

    console.log('ACTU SUPPRIMÉE LOCALEMENT');
  }

  // ==========================================================
  // EDIT
  // ==========================================================

  editActu(event: Event, actu: any): void {

    event.stopPropagation();

    console.log('====================================');
    console.log('EDIT ACTU');
    console.log('====================================');

    console.log(actu);
  }

  // ==========================================================
  // TRACK BY
  // ==========================================================

  trackByActuId(
    index: number,
    item: any
  ): string {

    return item?._id || index.toString();
  }

  // ==========================================================
  // UTILS
  // ==========================================================

  getInitiales(nom?: string): string {

    console.log('GET INITIALES :', nom);

    if (!nom) {
      return '?';
    }

    const parts =
      nom.trim().split(/\s+/);

    if (parts.length > 1) {

      return (
        parts[0][0] +
        parts[1][0]
      ).toUpperCase();
    }

    return parts[0]
      .substring(0, 2)
      .toUpperCase();
  }

  formatDate(dateStr?: string): string {

    console.log('FORMAT DATE :', dateStr);

    if (!dateStr) {
      return '';
    }

    const date = new Date(dateStr);

    const now = new Date();

    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return "Aujourd'hui";
    }

    if (diffDays === 1) {
      return 'Hier';
    }

    if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    }

    return date.toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      }
    );
  }
}