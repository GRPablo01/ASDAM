import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Icon } from '../../Share/icon/icon';
import { Icon2 } from '../icon2/icon2';
import { Logo } from '../../Share/Page-Header/logo/logo';
import { Nav } from '../../Share/Page-Header/nav/nav';
import { Profil } from '../../Share/Page-Header/profil/profil';



interface NavItem {
  label: string;
  icon?: string;
  link?: string;
  children?: NavItem[];
  badge?: string | number;
  active?: boolean;
  description?: string;
  shortcut?: string;
  footer?: {
    label: string;
    link: string;
  };
  isCenter?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HttpClientModule, Icon, RouterLink, Logo, Icon2, Nav,Profil],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {

  nom: string = '';
  prenom: string = '';
  role: string = 'inviter';
  email: string = '';
  isLoggedIn = false;
  userRole: string = 'inviter';

  // =========================================================
  // MENU
  // =========================================================

  menu: NavItem[] = [];

  menuOpen = false;

  // 🔥 ajout manquant (évite crash)
  utilisateur: any = {};

  // 🔥 ajout manquant
  initiales: string = '';


  constructor(
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('utilisateur');

    if (!storedUser) {
      this.role = 'inviter';
      return;
    }

    try {
      this.utilisateur = JSON.parse(storedUser);
      this.isLoggedIn = true;

      this.nom = this.utilisateur?.nom || '';
      this.prenom = this.utilisateur?.prenom || '';
      this.role = this.utilisateur?.role || 'inviter';
      this.userRole = this.role;

      this.initiales = this.getInitiales(this.nom, this.prenom);

    } catch (error) {
      console.error('❌ Erreur parsing utilisateur :', error);
      this.utilisateur = null;
      this.isLoggedIn = false;
      this.role = 'inviter';
    }
  }

  /**
   * Formate le rôle
   */
  formatRole(role: string | null | undefined): string {
    if (!role || role === 'Inviter') return 'Supporter';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  getInitiales(nom: string, prenom: string): string {
    return (nom?.[0] || '').toUpperCase() + (prenom?.[0] || '').toUpperCase();
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
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
   * Gradient selon le rôle
   */
   getRoleGradient(role: string): string {
    const gradients: Record<string, string> = {
      'superadmin': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      'admin': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      'entraineur': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'joueur': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      'inviter': 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
    };
    return gradients[role] || gradients['inviter'];
  }

  /**
   * Background badge rôle
   */
  getRoleBadgeBg(role: string): string {
    const colors: Record<string, string> = {
      'superadmin': 'rgba(251, 191, 36, 0.15)',
      'admin': 'rgba(139, 92, 246, 0.15)',
      'entraineur': 'rgba(16, 185, 129, 0.15)',
      'joueur': 'rgba(59, 130, 246, 0.15)',
      'inviter': 'rgba(107, 114, 128, 0.15)'
    };
    return colors[role] || colors['inviter'];
  }

  /**
   * Couleur texte badge rôle
   */
  getRoleBadgeColor(role: string): string {
    const colors: Record<string, string> = {
      'superadmin': '#b45309',
      'admin': '#6d28d9',
      'entraineur': '#059669',
      'joueur': '#2563eb',
      'inviter': '#4b5563'
    };
    return colors[role] || colors['inviter'];
  }


  // =========================================================
  // MENU GENERATOR
  // =========================================================

  generateMenu(): void {

    const roleMenu: { [key: string]: NavItem[] } = {

      // =====================================================
      // SUPERADMIN
      // =====================================================

      superadmin: [

        {
          label: 'Gestion',
          icon: 'fas fa-users-cog',
          link: '/gestion',
          description: 'Administration centrale',
          children: [
            {
              label: 'Utilisateurs',
              icon: 'fas fa-user-shield',
              link: '/user',
              description: 'Gestion utilisateurs'
            },
            {
              label: 'Contenu Sportif',
              icon: 'fas fa-futbol',
              link: '/cont',
              description: 'Gestion sportive'
            },
            {
              label: 'Communication',
              icon: 'fas fa-bullhorn',
              link: '/commun',
              description: 'Communication'
            }
          ]
        },

        {
          label: 'Messagerie',
          icon: 'fas fa-envelope',
          link: '/message',
          description: 'Messagerie interne'
        },

        {
          label: 'Classement',
          icon: 'fas fa-chart-line',
          link: '/class',
          description: 'Statistiques'
        }
      ],

      // =====================================================
      // ADMIN
      // =====================================================

      admin: [

        {
          label: 'Gestion',
          icon: 'fas fa-users-cog',
          link: '/gestion',
          description: 'Administration',
          children: [
            {
              label: 'Utilisateurs',
              icon: 'fas fa-user-shield',
              link: '/user'
            },
            {
              label: 'Contenu Sportif',
              icon: 'fas fa-futbol',
              link: '/cont'
            },
            {
              label: 'Communication',
              icon: 'fas fa-bullhorn',
              link: '/commun'
            }
          ]
        },

        {
          label: 'Messagerie',
          icon: 'fas fa-envelope',
          link: '/message'
        },

        {
          label: 'Classement',
          icon: 'fas fa-chart-line',
          link: '/statistiques'
        },

        {
          label: 'Convocation',
          icon: 'fas fa-clipboard-list',
          link: '/planning',
          children: [
            {
              label: 'Séances',
              icon: 'fas fa-dumbbell',
              link: '/seances'
            },
            {
              label: 'Rencontres',
              icon: 'fas fa-trophy',
              link: '/rencontres'
            }
          ]
        }
      ],

      // =====================================================
      // ENTRAINEUR
      // =====================================================

      entraineur: [

        {
          label: 'Actualités',
          icon: 'fas fa-newspaper',
          link: '/actus'
        },

        {
          label: 'Équipe',
          icon: 'fas fa-users',
          link: '/equipe',
          children: [
            {
              label: 'Joueurs',
              icon: 'fas fa-user',
              link: '/joueurs'
            },
            {
              label: 'Disponibles',
              icon: 'fas fa-clipboard-list',
              link: '/disponibles'
            },
            {
              label: 'Statistiques',
              icon: 'fas fa-chart-bar',
              link: '/stats'
            }
          ]
        },

        {
          label: 'Convocation',
          icon: 'fas fa-clipboard-list',
          link: '/planning',
          children: [
            {
              label: 'Séances',
              icon: 'fas fa-dumbbell',
              link: '/seances'
            },
            {
              label: 'Rencontres',
              icon: 'fas fa-trophy',
              link: '/rencontres'
            }
          ]
        },

        {
          label: 'Calendrier',
          icon: 'fas fa-calendar-alt',
          link: '/calendrier'
        }
      ],

      // =====================================================
      // JOUEUR
      // =====================================================

      joueur: [

        {
          label: 'Actualités',
          icon: 'fas fa-newspaper',
          link: '/actus'
        },

        {
          label: 'Équipe',
          icon: 'fas fa-users',
          link: '/equipe',
          children: [
            {
              label: 'Joueurs',
              icon: 'fas fa-user',
              link: '/joueurs'
            },
            {
              label: 'Disponibles',
              icon: 'fas fa-clipboard-list',
              link: '/disponibles'
            },
            {
              label: 'Mes statistiques',
              icon: 'fas fa-chart-bar',
              link: '/mes-stats'
            }
          ]
        },

        {
          label: 'Mes convocations',
          icon: 'fas fa-clipboard-list',
          link: '/convocations'
        },

        {
          label: 'Calendrier',
          icon: 'fas fa-calendar-alt',
          link: '/calendrier'
        }
      ],

      // =====================================================
      // INVITE
      // =====================================================

      invite: [

        {
          label: 'Actualités',
          icon: 'fas fa-newspaper',
          link: '/actus'
        },

        {
          label: 'Matchs',
          icon: 'fas fa-futbol',
          link: '/match'
        },

        {
          label: 'Contact',
          icon: 'fas fa-envelope',
          link: '/contact'
        }
      ]
    };

    this.menu = roleMenu[this.role] || roleMenu['invite'];

    this.updateActiveLinks();
  }
  

  // =========================================================
  // ACTIVE LINKS
  // =========================================================

  updateActiveLinks(): void {

    const currentUrl = this.router.url;

    this.menu.forEach(item => {

      item.active = item.link === currentUrl;

      item.children?.forEach(child => {
        child.active = child.link === currentUrl;
      });
    });
  }
}