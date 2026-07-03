import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Icon } from '../../icon/icon';

interface Role {
  id?: string;
  ids?: string[];
  label: string;
  features: string[];
  description: string;
  icon: string;
}

interface User {
  id?: string;
  nom?: string;
  role?: string;
}

@Component({
  selector: 'app-fonctionalite',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './fonctionalite.html',
  styleUrls: ['./fonctionalite.css'],
})
export class Fonctionalite implements OnInit {

  user: User | null = null;

  userRole: string = '';

  selectedRole: Role | null = null;

  showLoginModal: boolean = false;

  isModalOpen: boolean = false;

  isHoverClose: boolean = false;

  hoveredFeature: number | null = null;

  // =========================================================
  // ROLES
  // =========================================================
  roles: Role[] = [

    // =====================================================
    // SUPPORTER + INVITER = MEME ROLE
    // =====================================================
    {
      id: 'supporter',
      ids: ['supporter', 'inviter'],
      label: 'Supporter',
      icon: 'fas fa-heart',
      features: [
        'Suivre les matchs',
        'Voir les actualités du club',
        'Consulter les résultats',
        'Accéder aux informations publiques'
      ],
      description:
        'Accès aux informations publiques et au suivi du club.'
    },

    {
      id: 'joueur',
      label: 'Joueur',
      icon: 'fas fa-user',
      features: [
        'Consulter le calendrier',
        'Suivre les résultats de l’équipe',
        'Accéder à ta convocation'
      ],
      description:
        'Accès complet aux fonctionnalités liées à votre participation.'
    },

    {
      id: 'entraineur',
      label: 'Entraineur',
      icon: 'fas fa-chess-knight',
      features: [
        'Gérer les compositions',
        'Organiser les entraînements',
        'Planifier les événements'
      ],
      description:
        'Outils avancés pour la gestion tactique et collective.'
    },

    {
      id: 'admin',
      ids: ['admin', 'superadmin'],
      label: 'Administrateur',
      icon: 'fas fa-crown',
      features: [
        'Gestion complète de la plateforme',
        'Gestion des utilisateurs',
        'Accès total au système'
      ],
      description:
        'Contrôle total de la plateforme ASDAM.'
    }

  ];

  constructor(
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
  }

  // =========================================================
  // LOGIN
  // =========================================================
  get isLoggedIn(): boolean {
    return !!this.user;
  }

  private loadUserFromLocalStorage(): void {

    const userData = localStorage.getItem('utilisateur');

    if (!userData) return;

    try {

      this.user = JSON.parse(userData);

      this.userRole = this.user?.role || '';

    } catch (error) {

      console.error(
        'Erreur parsing utilisateur:',
        error
      );

    }

  }

  // =========================================================
  // AFFICHAGE DYNAMIQUE
  // =========================================================
  get displayedRoles(): Role[] {

    // =====================================================
    // NON CONNECTÉ
    // =====================================================
    if (!this.isLoggedIn) {

      return this.roles.filter(
        role => role.id === 'supporter'
      );

    }

    // =====================================================
    // CONNECTÉ
    // =====================================================
    return this.roles.filter(role =>

      role.id === this.userRole ||

      role.ids?.includes(this.userRole)

    );

  }

  // =========================================================
  // COLORS
  // =========================================================
  getRoleColor(role: string = ''): string {
    const r = role.toLowerCase();
  
    // ======================================================
    // 🌙 THEME ACTUEL
    // ======================================================
    const isDark = this.themeService.isDarkMode;
  
    // ======================================================
    // 🌞 LIGHT MODE
    // ======================================================
    const lightGradients: Record<string, string> = {
      superadmin: `linear-gradient(135deg,
        ${this.themeService.c11Light},
        ${this.themeService.c11Light})`,
  
      admin: `linear-gradient(135deg,
        ${this.themeService.c17Light},
        ${this.themeService.c17Light})`,
  
      entraineur: `linear-gradient(135deg,
        ${this.themeService.c9Light},
        ${this.themeService.c9Light})`,
  
      joueur: `linear-gradient(135deg,
        ${this.themeService.c2Light},
        ${this.themeService.c2Light})`,
  
      inviter: `linear-gradient(135deg,
        ${this.themeService.c12Light},
        ${this.themeService.c12Light})`
    };
  
    // ======================================================
    // 🌙 DARK MODE
    // ======================================================
    const darkGradients: Record<string, string> = {
      superadmin: `linear-gradient(135deg,
      ${this.themeService.c11Dark},
      ${this.themeService.c11Dark})`,

    admin: `linear-gradient(135deg,
      ${this.themeService.c17Dark},
      ${this.themeService.c17Dark})`,

    entraineur: `linear-gradient(135deg,
      ${this.themeService.c9Dark},
      ${this.themeService.c9Dark})`,

    joueur: `linear-gradient(135deg,
      ${this.themeService.c2Dark},
      ${this.themeService.c2Dark})`,

    inviter: `linear-gradient(135deg,
      ${this.themeService.c12Dark},
      ${this.themeService.c12Dark})`
    };
  
    const gradients = isDark
      ? darkGradients
      : lightGradients;
  
    return gradients[r] || gradients['inviter'];
  }

  // =========================================================
  // ICONS
  // =========================================================
  getRoleIcon(roleId: string): string {

    const roleIconsFA: any = {

      supporter: 'fas fa-heart',

      inviter: 'fas fa-heart',

      joueur: 'fas fa-futbol',

      entraineur: 'fas fa-clipboard-list',

      admin: 'fas fa-crown',

      superadmin: 'fas fa-crown'

    };

    return roleIconsFA[roleId] || 'fas fa-user';

  }

  // =========================================================
  // MODAL
  // =========================================================
  openRoleModal(role: Role): void {

    this.selectedRole = role;

    this.isModalOpen = true;

    document.body.style.overflow = 'hidden';

  }

  // =========================================================
  // COLOR UTILS
  // =========================================================
  adjustColor(
    color: string,
    amount: number = -20
  ): string {

    let usePound = false;

    if (color[0] === '#') {

      color = color.slice(1);

      usePound = true;

    }

    const num = parseInt(color, 16);

    let r = (num >> 16) + amount;

    let g = ((num >> 8) & 0x00FF) + amount;

    let b = (num & 0x0000FF) + amount;

    r = Math.max(Math.min(255, r), 0);

    g = Math.max(Math.min(255, g), 0);

    b = Math.max(Math.min(255, b), 0);

    return (
      (usePound ? '#' : '') +
      ((r << 16) | (g << 8) | b)
        .toString(16)
        .padStart(6, '0')
    );

  }

}