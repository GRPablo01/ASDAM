import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './dash.html',
  styleUrl: './dash.css',
})
export class Dash implements OnInit {

  utilisateur: any = null;
  role: string = '';

  // =========================================================
  // CARDS DASHBOARD
  // =========================================================

  dashboardCards = [

    {
      titre: 'Actualités',
      description: 'Créez et gérez les actualités du club rapidement.',
      icon: 'fa-solid fa-newspaper',
      image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1400&auto=format&fit=crop',
      route: '/createactus'
    },

    {
      titre: 'Évènements',
      description: 'Organisez les évènements et activités du club.',
      icon: 'fa-solid fa-calendar-days',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1400&auto=format&fit=crop',
      route: '/createevent'
    },

    {
      titre: 'Convocations',
      description: 'Gérez les convocations des joueurs et équipes.',
      icon: 'fa-solid fa-list-check',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1400&auto=format&fit=crop',
      route: '/createconvocation'
    },

    {
      titre: 'Équipes',
      description: 'Créez et administrez les équipes du club.',
      icon: 'fa-solid fa-people-group',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1400&auto=format&fit=crop',
      route: '/createequipe'
    },

    {
      titre: 'Communication',
      description: 'Envoyez des annonces et communiquez avec le club.',
      icon: 'fa-solid fa-comments',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop',
      route: '/createcommun'
    },

    {
      titre: 'Matchs',
      description: 'Planifiez et gérez les matchs du club.',
      icon: 'fa-solid fa-futbol',
      image: '/assets/ImageMatch.png',
      route: '/create-match'
    }

  ];

  // =========================================================
  // PAGINATION
  // =========================================================

  currentPage = 1;
  itemsPerPage = 3;

  paginatedCards: any[] = [];

  totalPages = 0;

  constructor(
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {

    // ==========================================
    // RECUPERATION UTILISATEUR LOCALSTORAGE
    // ==========================================

    const userData = localStorage.getItem('utilisateur');

    if (userData) {

      this.utilisateur = JSON.parse(userData);

      this.role = this.utilisateur.role;

      console.log('Utilisateur :', this.utilisateur);
      console.log('Rôle utilisateur :', this.role);

    } else {

      console.log('Aucun utilisateur trouvé');

    }

    // ==========================================
    // PAGINATION
    // ==========================================

    this.totalPages = Math.ceil(
      this.dashboardCards.length / this.itemsPerPage
    );

    this.updatePagination();

  }

  // =========================================================
  // UPDATE PAGINATION
  // =========================================================

  updatePagination(): void {

    const startIndex =
      (this.currentPage - 1) * this.itemsPerPage;

    const endIndex =
      startIndex + this.itemsPerPage;

    this.paginatedCards =
      this.dashboardCards.slice(startIndex, endIndex);

  }

  // =========================================================
  // PAGE SUIVANTE
  // =========================================================

  nextPage(): void {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.updatePagination();

    }

  }

  // =========================================================
  // PAGE PRECEDENTE
  // =========================================================

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();

    }

  }

  // =========================================================
  // CHANGER PAGE
  // =========================================================

  goToPage(page: number): void {

    this.currentPage = page;

    this.updatePagination();

  }

  // =========================================================
  // ARRAY PAGES
  // =========================================================

  get pages(): number[] {

    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);

  }

}