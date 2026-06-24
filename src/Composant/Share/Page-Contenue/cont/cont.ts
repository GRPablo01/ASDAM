import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cont',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cont.html',
  styleUrl: './cont.css',
})
export class Cont {

  constructor(public themeService: ThemeService) {}

  // =====================================================
  // 📦 DATA MODULES
  // =====================================================
  items = [
    {
      title: 'Événements',
      icon: 'fa-solid fa-calendar-days',
      image: '/assets/ImageEvent.png',
      link: '/event'
    },
    {
      title: 'Matchs',
      icon: 'fa-solid fa-futbol',
      image: '/assets/ImageMatch.png',
      link: '/match2'
    },
    {
      title: 'Actualités',
      icon: 'fa-solid fa-newspaper',
      image: '/assets/ImageActus.png',
      link: '/news'
    },
    {
      title: 'Équipe',
      icon: 'fa-solid fa-user-group',
      image: '/assets/ImageEquipe.png',
      link: '/team'
    },
    {
      title: 'Convocations',
      icon: 'fa-solid fa-clipboard-list',
      image: '/assets/ImageConvocation.png',
      link: '/convocation'
    },
    {
      title: 'Communiquer',
      icon: 'fa-solid fa-comments',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1400&auto=format&fit=crop',
      link: '/communiquer'
    }
  ];

  // =====================================================
  // 📄 PAGINATION
  // =====================================================
  currentPage = 0;
  pageSize = 3;

  get totalPages(): number {
    return Math.ceil(this.items.length / this.pageSize);
  }

  get paginatedItems() {
    const start = this.currentPage * this.pageSize;
    return this.items.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
}