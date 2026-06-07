import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

interface NewsItem {
  key: string;
  titre: string;
  contenu: string;
  auteur: string;
  categorie: string;
  datePublication: Date;
  imageUrl?: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.html',
  styleUrls: ['./news.css'],
})
export class News {

  hoverNews = false;
  openNewsPanel = false;

  newsList: NewsItem[] = [];
  expandedNews: Record<string, boolean> = {};

  constructor(public themeService: ThemeService) {}

  // =====================================
  // 🔘 ACTIONS
  // =====================================

  toggleNewsPanel(): void {
    this.openNewsPanel = !this.openNewsPanel;
  }

  toggleExpand(key: string): void {
    this.expandedNews[key] = !this.expandedNews[key];
  }

  markAllNewsAsRead(): void {
    this.expandedNews = {};
  }

  // =====================================
  // 🎨 STYLES CENTRALISÉS
  // =====================================

  getNewsButtonStyle() {
    return {
      background: this.themeService.Background1,
      backdropFilter: 'blur(22px) saturate(180%)',
      WebkitBackdropFilter: 'blur(22px) saturate(180%)',
      boxShadow: this.hoverNews
        ? `0 0 25px ${this.themeService.primary}99`
        : `0 10px 30px ${this.themeService.c16Dark}40`,
      border: this.hoverNews
        ? `1px solid ${this.themeService.primary}4D`
        : `1px solid ${this.themeService.c2Base}1A`,
    };
  }

  getGlowStyle() {
    return {
      background: `linear-gradient(135deg, transparent, ${this.themeService.primary}25)`
    };
  }

  getPanelStyle() {
    return {
      background: this.themeService.c5Base + '0D',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      boxShadow: `0 20px 60px ${this.themeService.c16Dark}40`,
      border: `1px solid ${this.themeService.c2Base}33`,
    };
  }

  getHeaderStyle() {
    return {
      background: `linear-gradient(135deg, ${this.themeService.primary}, ${this.themeService.primary})`,
      color: '#fff'
    };
  }

  getCardStyle() {
    return {
      background: this.themeService.c16Base,
      borderColor: this.themeService.c2Base + '1A',
      borderLeft: `4px solid ${this.themeService.primary}`,
      boxShadow: `0 4px 15px ${this.themeService.c16Dark}20`
    };
  }

  getBadgePrimary() {
    return {
      background: this.themeService.primary + '24',
      color: this.themeService.primary,
      border: `1px solid ${this.themeService.primary}40`
    };
  }

  getBadgeSecondary() {
    return {
      background: this.themeService.c2Base + '24',
      color: this.themeService.c2Base,
      border: `1px solid ${this.themeService.c2Base}40`
    };
  }

  getEmptyIconStyle() {
    return {
      background: `linear-gradient(135deg, ${this.themeService.primary}, ${this.themeService.primary})`,
      boxShadow: `0 0 30px ${this.themeService.primary}4D`
    };
  }

  getFooterStyle() {
    return {
      background: this.themeService.c16Base,
      borderColor: this.themeService.c2Base + '1A'
    };
  }

  getPrimaryButtonStyle() {
    return {
      background: `linear-gradient(135deg, ${this.themeService.primary}, ${this.themeService.c2Base})`,
      boxShadow: `0 4px 15px ${this.themeService.primary}4D`
    };
  }
}