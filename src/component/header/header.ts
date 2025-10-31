import { Component, HostListener, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../services/userService/Profil.Service';
import { Icon } from '../icon/icon';


interface MenuItem {
  title: string;
  link: string;
  icon?: string;
  initiales?: string;
}

interface MobileMenu {
  title: string;
  icon?: string;
  link?: string;
  items: MenuItem[];
  initiales?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, AfterViewInit {
  private _mobileMenuOpen = false;
  activeDropdown: string | null = null;
  isDarkMode = false;
  unreadMessages = 0;
  connectedUser: any = null;
  mobileMenus: MobileMenu[] = [];

  private scrollPosition = 0;

  @ViewChild('mobileMenu') mobileMenuRef!: ElementRef<HTMLDivElement>;

  constructor(
    private router: Router,
    private userProfileService: ProfileService
  ) {}

  ngOnInit(): void {
    // Charger l'utilisateur connecté
    this.loadConnectedUser();
  
    // 🌙 Gérer le thème enregistré dans le localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkMode = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  

  ngAfterViewInit(): void {
    if (this.mobileMenuRef) {
      this.addScrollLock(this.mobileMenuRef.nativeElement);
    }
  }

  private loadConnectedUser(): void {
    const utilisateurStorage = localStorage.getItem('utilisateur');
    let initiales = '';

    if (!utilisateurStorage) {
      this.buildMobileMenus('Invité'); // par défaut invité
      return;
    }

    const utilisateur = JSON.parse(utilisateurStorage);
    utilisateur.initiales = this.getInitiales(utilisateur.nom, utilisateur.prenom);
    this.connectedUser = utilisateur;
    initiales = utilisateur.initiales;

    this.buildMobileMenus(utilisateur.role || 'Invité');
  }

  private buildMobileMenus(role: string): void {
    switch(role.toLowerCase()) {
      case 'joueur':
        this.mobileMenus = [
          { title: 'Actualité', icon: 'fas fa-newspaper', link: '/actualite', items: [
              { title: 'Communiqués', link: '/communiques', icon: 'fas fa-bullhorn' },
            ] 
          },
          { 
            title: 'Matchs', 
            icon: 'fas fa-futbol', 
            link: '/match', 
            items: [
              { title: 'Convocations', link: '/convocations', icon: 'fas fa-users' },
            ] 
          },
          { 
            title: 'Planning', 
            icon: 'fas fa-calendar-alt', 
            link: '/planning', 
            items: [] 
          },
          { 
            title: 'Messages', 
            icon: 'fas fa-envelope', 
            link: '/messages', 
            items: [] 
          },
          { 
            title: 'Classement', 
            icon: 'fas fa-trophy',  // icône correcte pour classement
            link: '/classement', 
            items: [] 
          },
          { 
            title: 'Dashboard', 
            icon: 'fas fa-tachometer-alt', 
            link: '/dashboard', 
            items: [] 
          }
        ];
        break;

      case 'coach':
        this.mobileMenus = [
          { 
            title: 'Actualité', 
            icon: 'fas fa-newspaper', 
            link: '/actualite', 
            items: [
              { title: 'Communiqués', link: '/communiques', icon: 'fas fa-bullhorn' },
            ] 
          },
          { 
            title: 'Matchs', 
            icon: 'fas fa-futbol', 
            link: '/match', 
            items: [
              { title: 'Convocations', link: '/convocations', icon: 'fas fa-users' },
            ] 
          },
          { 
            title: 'Planning', 
            icon: 'fas fa-calendar-alt', 
            link: '/planning', 
            items: [] 
          },
          { 
            title: 'Messages', 
            icon: 'fas fa-envelope', 
            link: '/messages', 
            items: [] 
          },
          { 
            title: 'Classement', 
            icon: 'fas fa-trophy',  // icône correcte pour classement
            link: '/classement', 
            items: [] 
          },
          { 
            title: 'Dashboard', 
            icon: 'fas fa-tachometer-alt', 
            link: '/dashboard', 
            items: [] 
          }
        ];
        break;

      case 'admin':
        this.mobileMenus = [
          { 
            title: 'Actualité', 
            icon: 'fas fa-newspaper', 
            link: '/actualite', 
            items: [
              { title: 'Communiqués', link: '/communiques', icon: 'fas fa-bullhorn' },
            ] 
          },
          { 
            title: 'Matchs', 
            icon: 'fas fa-futbol', 
            link: '/match', 
            items: [] 
          },
          { 
            title: 'Planning', 
            icon: 'fas fa-calendar-alt', 
            link: '/planning', 
            items: [] 
          },
          { 
            title: 'Messages', 
            icon: 'fas fa-envelope', 
            link: '/messages', 
            items: [] 
          },
          { 
            title: 'Classement', 
            icon: 'fas fa-trophy',  // icône correcte pour classement
            link: '/classement', 
            items: [] 
          },
          { 
            title: 'Dashboard', 
            icon: 'fas fa-tachometer-alt', 
            link: '/dashboard', 
            items: [] 
          }
        ];
        break;

      case 'super admin':
        this.mobileMenus = [
          { 
            title: 'Actualité', 
            icon: 'fas fa-newspaper', 
            link: '/actualite', 
            items: [
              { title: 'Communiqués', link: '/communiques', icon: 'fas fa-bullhorn' },
            ] 
          },
          { 
            title: 'Matchs', 
            icon: 'fas fa-futbol', 
            link: '/match', 
            items: [] 
          },
          { 
            title: 'Planning', 
            icon: 'fas fa-calendar-alt', 
            link: '/planning', 
            items: [] 
          },
          { 
            title: 'Messages', 
            icon: 'fas fa-envelope', 
            link: '/messages', 
            items: [] 
          },
          { 
            title: 'Utilisateur', 
            icon: 'fas fa-trophy',  // icône correcte pour classement
            link: '/utilisateur', 
            items: [] 
          },
          { 
            title: 'Dashboard', 
            icon: 'fas fa-tachometer-alt', 
            link: '/dashboard', 
            items: [] 
          }
        ];
        break;

      default: // invité
      this.mobileMenus = [
        { 
          title: 'Actualité', 
          icon: 'fas fa-newspaper', 
          link: '/actualite', 
          items: [
            { title: 'Communiqués', link: '/communiques', icon: 'fas fa-bullhorn' },
          ] 
        },
        { 
          title: 'Matchs', 
          icon: 'fas fa-futbol', 
          link: '/match', 
          items: [] 
        },
        { 
          title: 'Planning', 
          icon: 'fas fa-calendar-alt', 
          link: '/planning', 
          items: [] 
        },
        { 
          title: 'Messages', 
          icon: 'fas fa-envelope', 
          link: '/messages', 
          items: [] 
        },
        { 
          title: 'Classement', 
          icon: 'fas fa-trophy',  // icône correcte pour classement
          link: '/classement', 
          items: [] 
        },
        { 
          title: 'Dashboard', 
          icon: 'fas fa-tachometer-alt', 
          link: '/dashboard', 
          items: [] 
        }
      ];
        break;
    }
  }

  get mobileMenuOpen(): boolean {
    return this._mobileMenuOpen;
  }

  set mobileMenuOpen(value: boolean) {
    this._mobileMenuOpen = value;
    if (value) {
      this.scrollPosition = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.classList.remove('menu-open');
      window.scrollTo(0, this.scrollPosition);
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleDropdown(id: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  closeDropdown(id: string): void {
    if (this.activeDropdown === id) this.activeDropdown = null;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('nav')) {
      this.activeDropdown = null;
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  private updateTheme(): void {
    const html = document.documentElement;
    if (this.isDarkMode) html.classList.add('dark');
    else html.classList.remove('dark');
  }

  deconnecter(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.userProfileService.clearProfile();
    this.router.navigate(['/connexion']);
  }

  private getInitiales(nom: string, prenom: string): string {
    const n = nom?.charAt(0) || '';
    const p = prenom?.charAt(0) || '';
    return (p + n).toUpperCase();
  }

  private addScrollLock(menuEl: HTMLElement) {
    let startY = 0;
    menuEl.addEventListener('touchstart', (e: TouchEvent) => { startY = e.touches[0].clientY; }, { passive: false });
    menuEl.addEventListener('touchmove', (e: TouchEvent) => {
      const scrollTop = menuEl.scrollTop;
      const scrollHeight = menuEl.scrollHeight;
      const offsetHeight = menuEl.offsetHeight;
      const direction = e.touches[0].clientY - startY;
      if ((scrollTop === 0 && direction > 0) || (scrollTop + offsetHeight >= scrollHeight && direction < 0)) e.preventDefault();
    }, { passive: false });
    menuEl.addEventListener('wheel', (e: WheelEvent) => {
      const scrollTop = menuEl.scrollTop;
      const scrollHeight = menuEl.scrollHeight;
      const offsetHeight = menuEl.offsetHeight;
      const delta = e.deltaY;
      if ((scrollTop === 0 && delta < 0) || (scrollTop + offsetHeight >= scrollHeight && delta > 0)) e.preventDefault();
    }, { passive: false });
  }
}
