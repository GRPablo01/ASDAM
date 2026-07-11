import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Icon } from '../../icon/icon';

interface Utilisateur {
  nom: string;
  prenom: string;
  photoProfil?: string;
  role?: string;
  email?: string;
  statut?: 'en ligne' | 'ne pas déranger' | 'absent';
}

@Component({
  selector: 'app-profil',
  templateUrl: './profil.html',
  styleUrls: ['./profil.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, Icon, RouterLink],
})
export class Profil implements OnInit {

  utilisateur: Utilisateur | null = null;

  menuOpen = false;

  nom = '';
  prenom = '';
  role = '';
  email = '';
  initials = '';

  statut: Utilisateur['statut'] = 'en ligne';
  statutColor = '';

  unreadMessagesCount = 3;
  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.updateStatutColor();
  }

  /**
   * Chargement utilisateur
   */
  private loadUser(): void {
    try {
      const userStr = localStorage.getItem('utilisateur');
      if (!userStr) return;

      const user: Utilisateur = JSON.parse(userStr);
      this.utilisateur = user;

      this.nom = user.nom ?? '';
      this.prenom = user.prenom ?? '';
      this.role = user.role ?? 'supporter';
      this.email = user.email ?? '';
      this.statut = user.statut ?? 'en ligne';

      this.generateInitials();
      this.updateStatutColor();

    } catch (err) {
      console.error('Erreur chargement utilisateur', err);
    }
  }

  /**
   * Initiales
   */
  private generateInitials(): void {
    this.initials =
      (this.nom?.charAt(0) ?? '').toUpperCase() +
      (this.prenom?.charAt(0) ?? '').toUpperCase();
  }

  /**
   * Menu toggle
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  /**
   * Clic extérieur
   */
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (!target.closest('#userMenuButton') &&
        !target.closest('#userMenuDropdown')) {
      this.menuOpen = false;
    }
  }

  /**
   * Changement statut
   */
  changeStatut(nouveau: Utilisateur['statut']): void {
    if (!nouveau) return;

    this.statut = nouveau;

    if (this.utilisateur) {
      this.utilisateur.statut = nouveau;
      localStorage.setItem('utilisateur', JSON.stringify(this.utilisateur));
    }

    this.updateStatutColor();
  }

  /**
   * Couleur statut
   */
  private updateStatutColor(): void {
    const map: Record<string, string> = {
      'en ligne': '#22C55E',
      'ne pas déranger': '#EF4444',
      'absent': '#F59E0B'
    };

    this.statutColor = map[this.statut ?? ''] || '#94A3B8';
  }

  /**
   * Label statut
   */
  getStatutLabel(): string {
    const labels: Record<string, string> = {
      'en ligne': 'En ligne',
      'ne pas déranger': 'Ne pas déranger',
      'absent': 'Absent'
    };

    return labels[this.statut ?? ''] || 'Hors ligne';
  }


  menuSections = [
    // =========================
    // ADMIN / SUPERADMIN
    // =========================
    {
      roles: ['admin', 'superadmin'],
      title: 'Administration',
      items: [
        {
          label: 'Dashboard',
          link: '/dashboard',
          icon: 'fa-chart-line',
          color: 'dashboardPrimary',
          bg: 'dashboardPrimarySoft'
        },
        {
          label: 'Logs système',
          link: '/logs',
          icon: 'fa-clipboard-list',
          color: 'primary',
          bg: 'primarySoft'
        },
        {
          label: 'Équipes',
          link: '/teams',
          icon: 'fa-people-group',
          color: 'teamPrimary',
          bg: 'teamPrimarySoft'
        },
        {
          label: 'Planning',
          link: '/planning',
          icon: 'fa-calendar-days',
          color: 'eventPrimary',
          bg: 'eventPrimarySoft'
        }
      ]
    },
  
    // =========================
    // ENTRAINEUR
    // =========================
    {
      roles: ['entraineur'],
      title: 'Entraîneur',
      items: [
        {
          label: 'Dashboard',
          link: '/dashboard',
          icon: 'fa-chart-line',
          color: 'dashboardPrimary',
          bg: 'dashboardPrimarySoft'
        },
        {
          label: 'Mon équipe',
          link: '/equipe',
          icon: 'fa-people-group',
          color: 'teamPrimary',
          bg: 'teamPrimarySoft'
        },
        {
          label: 'Matchs & entraînements',
          link: '/mesmatch',
          icon: 'fa-calendar-days',
          color: 'eventPrimary',
          bg: 'eventPrimarySoft'
        },
        {
          label: 'Convocations',
          link: '/convocations',
          icon: 'fa-clipboard-list',
          color: 'convocationPrimary',
          bg: 'convocationPrimarySoft'
        }
      ]
    },
  
    // =========================
    // JOUEUR
    // =========================
    {
      roles: ['Joueur'],
      title: 'Joueur',
      items: [
        {
          label: 'Dashboard',
          link: '/dashboard',
          icon: 'fa-chart-line',
          color: 'dashboardPrimary',
          bg: 'dashboardPrimarySoft'
        },
        {
          label: 'Mon équipe',
          link: '/equipe',
          icon: 'fa-people-group',
          color: 'teamPrimary',
          bg: 'teamPrimarySoft'
        },
        {
          label: 'Matchs & entraînements',
          link: '/mesmatch',
          icon: 'fa-calendar-days',
          color: 'eventPrimary',
          bg: 'eventPrimarySoft'
        },
        {
          label: 'Convocations',
          link: '/convocations',
          icon: 'fa-clipboard-list',
          color: 'convocationPrimary',
          bg: 'convocationPrimarySoft'
        }
      ]
    },
  
    // =========================
    // INVITE
    // =========================
    {
      roles: ['invité'],
      title: 'Invité',
      items: [
        {
          label: 'Accueil',
          link: '/home',
          icon: 'fa-house',
          color: 'dashboardPrimary',
          bg: 'dashboardPrimarySoft'
        },
        {
          label: 'Équipes',
          link: '/teams-public',
          icon: 'fa-people-group',
          color: 'teamPrimary',
          bg: 'teamPrimarySoft'
        },
        {
          label: 'Matchs',
          link: '/matches-public',
          icon: 'fa-futbol',
          color: 'eventPrimary',
          bg: 'eventPrimarySoft'
        },
        {
          label: 'Connexion',
          link: '/login',
          icon: 'fa-right-to-bracket',
          color: 'teamPrimary',
          bg: 'teamPrimarySoft'
        }
      ]
    }
  ];
  
  // =========================
  // COMPTE (commun à tous)
  // =========================
  accountItems = [
    {
      label: 'Profil',
      link: '/profil',
      icon: 'fa-user'
    },
    // {
    //   label: 'Gestion du compte',
    //   link: '/gestioncompte',
    //   icon: 'fa-gear'
    // }
  ];

  getThemeColor(key: string): string {
    return (this.themeService as any)[key];
  }

  /**
   * Déconnexion
   */
  deconnecter(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/connexion']);
  }

  /**
   * Format rôle
   */
  formatRole(role?: string): string {
    if (!role || role.toLowerCase() === 'inviter') return 'Supporter';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  /**
   * Gradient rôle
   */
  getRoleGradient(role: string = ''): string {
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
        ${this.themeService.c18Base},
        ${this.themeService.c18Base})`,
  
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
      ${this.themeService.c18Dark},
      ${this.themeService.c18Dark})`,

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

  /**
   * Badge background
   */
  getRoleBadgeBg(role: string = ''): string {
    const r = role.toLowerCase();

    const colors: Record<string, string> = {
      superadmin: 'rgba(251, 191, 36, 0.15)',
      admin: 'rgba(139, 92, 246, 0.15)',
      entraineur: 'rgba(16, 185, 129, 0.15)',
      joueur: 'rgba(59, 130, 246, 0.15)',
      inviter: 'rgba(107, 114, 128, 0.15)'
    };

    return colors[r] || colors['inviter'];
  }

  /**
   * Badge color
   */
  getRoleBadgeColor(role: string = ''): string {
    const r = role.toLowerCase();

    const colors: Record<string, string> = {
      superadmin: '#b45309',
      admin: '#6d28d9',
      entraineur: '#059669',
      joueur: '#2563eb',
      inviter: '#4b5563'
    };

    return colors[r] || colors['inviter'];
  }
}