import { Component, HostListener, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Icon } from '../../icon/icon';
import { EnteteC } from '../../Coach/page-Accueil/entete-c/entete-c';
import { MessageService } from '../../../../services/message.service';
import { ProfileService } from '../../../../services/userService/Profil.Service';

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
  selector: 'app-header-c',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon, EnteteC],
  templateUrl: './header-c.html',
  styleUrls: ['./header-c.css']
})
export class HeaderC implements OnInit, AfterViewInit {
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
    private messageService: MessageService,
    private userProfileService: ProfileService
  ) {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateTheme();

    this.messageService.unreadCount$.subscribe(count => {
      this.unreadMessages = count;
    });
  }

  ngOnInit(): void {
    this.loadConnectedUser();
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
      this.buildMobileMenus(initiales);
      return;
    }

    const utilisateur = JSON.parse(utilisateurStorage);
    utilisateur.initiales = this.getInitiales(utilisateur.nom, utilisateur.prenom);
    this.connectedUser = utilisateur;
    initiales = utilisateur.initiales;

    if (utilisateur._id || utilisateur.id) {
      const userId = utilisateur._id || utilisateur.id;
      this.messageService.getUnreadCount(userId);
    }

    this.buildMobileMenus(initiales);
  }

  private buildMobileMenus(initiales: string): void {
    this.mobileMenus = [
      {
        title: 'Actualité',
        icon: 'fas fa-newspaper',
        link: '/actualiteC',
        items: [
          { title: 'Communiqués', link: '/actualiteC/communiquesC', icon: 'fas fa-bullhorn' },
          { title: 'Archives', link: '/actualiteC/archivesC', icon: 'fas fa-archive' }
        ]
      },
      {
        title: 'Match',
        icon: 'fas fa-futbol',
        link: '/matchC',
        items: [
          { title: 'Convocations', link: '/matchC/convocationsC', icon: 'fas fa-users' },
          { title: 'Résultats', link: '/matchC/resultatsC', icon: 'fas fa-trophy' }
        ]
      },
      { title: 'Planning', icon: 'fas fa-calendar-alt', link: '/PlanningC', items: [] },
      { title: 'Messages', icon: 'fas fa-envelope', link: '/messagesC', items: [] },
      { title: 'Absents', icon: 'fas fa-user-slash', link: '/absentsC', items: [] },
      {
        title: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        link: '/dashboardC',
        items: [
          { title: 'Mon Profil', link: '/dashboardC/profileC', initiales },
          { title: 'Paramètres', link: '/dashboardC/settingsC', icon: 'fas fa-cog' },
          { title: 'Déconnexion', link: '/connexion', icon: 'fas fa-sign-out-alt' }
        ]
      },
      { title: 'Déconnexion', icon: 'fas fa-sign-out-alt', link: '/connexion', items: [] }
    ];
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
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
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

  /*** Bloque le rebond du scroll sur mobile / desktop ***/
  private addScrollLock(menuEl: HTMLElement) {
    let startY = 0;

    menuEl.addEventListener('touchstart', (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    }, { passive: false });

    menuEl.addEventListener('touchmove', (e: TouchEvent) => {
      const scrollTop = menuEl.scrollTop;
      const scrollHeight = menuEl.scrollHeight;
      const offsetHeight = menuEl.offsetHeight;
      const direction = e.touches[0].clientY - startY;

      if ((scrollTop === 0 && direction > 0) || (scrollTop + offsetHeight >= scrollHeight && direction < 0)) {
        e.preventDefault();
      }
    }, { passive: false });

    menuEl.addEventListener('wheel', (e: WheelEvent) => {
      const scrollTop = menuEl.scrollTop;
      const scrollHeight = menuEl.scrollHeight;
      const offsetHeight = menuEl.offsetHeight;
      const delta = e.deltaY;

      if ((scrollTop === 0 && delta < 0) || (scrollTop + offsetHeight >= scrollHeight && delta > 0)) {
        e.preventDefault();
      }
    }, { passive: false });
  }
}
