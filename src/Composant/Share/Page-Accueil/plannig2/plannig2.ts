import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchService } from '../../../../../Backend/Services/match.service';
import { EventService } from '../../../../../Backend/Services/event.Service';
import { EquipeService } from '../../../../../Backend/Services/equipe.Service';

import { forkJoin } from 'rxjs';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-plannig2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plannig2.html',
  styleUrl: './plannig2.css',
})
export class Plannig2 implements OnInit {

  matchs: any[] = [];
  events: any[] = [];
  equipes: any[] = [];

  slides: any[] = [];
  visibleSlides: any[] = [];

  currentIndex = 0;

  intervalId: any;

  loading = false;

  constructor(
    private matchService: MatchService,
    private eventService: EventService,
    private equipeService: EquipeService,
    public themeService: ThemeService

  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    forkJoin({
      matchs: this.matchService.getMatchs(),
      events: this.eventService.getEvents(),
      equipes: this.equipeService.getTeams()
    }).subscribe({
      next: (data) => {

        this.matchs = data.matchs || [];
        this.events = data.events || [];
        this.equipes = data.equipes || [];

        this.prepareMatchs();
        this.buildSlides();
        this.updateVisibleSlides();

        this.loading = false;
      }
    });
  }

  // ======================
  // MATCH LOGOS
  // ======================
  prepareMatchs(): void {

    this.matchs = this.matchs.map(match => {

      const dom = this.equipes.find(e =>
        e.nom?.toLowerCase().trim() === match.equipeDomicile?.toLowerCase().trim()
      );

      const ext = this.equipes.find(e =>
        e.nom?.toLowerCase().trim() === match.equipeExterieur?.toLowerCase().trim()
      );

      return {
        ...match,
        type: 'match',
        logoEquipeDomicile: dom ? `http://localhost:3000/uploads/equipe/${dom.logo}` : '',
        logoEquipeExterieur: ext ? `http://localhost:3000/uploads/equipe/${ext.logo}` : ''
      };
    });
  }

  // ======================
  // MIX + RANDOM
  // ======================
  buildSlides(): void {

    const events = (this.events || []).map(e => ({
      ...e,
      type: 'event'
    }));

    const all = [...this.matchs, ...events];

    this.slides = this.shuffle(all);
  }

  // ================= STYLE =================
  get cardStyle() {
    return {
      background: this.themeService.GlassBackground,
      border: '2px solid ' + this.themeService.GlassBorder,
      backdropFilter: 'blur(22px) saturate(180%)',
      WebkitBackdropFilter: 'blur(22px) saturate(180%)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      color: this.themeService.Textprincipal
    };
  }

  // ======================
  // SHUFFLE ALÉATOIRE
  // ======================
  shuffle(array: any[]): any[] {

    return array
      .map(v => ({ v, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ v }) => v);
  }

  // ======================
  // 2 ITEMS VISIBLES
  // ======================
  updateVisibleSlides(): void {

    const start = this.currentIndex;

    this.visibleSlides = [
      this.slides[start],
      this.slides[start + 1]
    ].filter(Boolean);
  }

  // ======================
  // NEXT (2 par 2)
  // ======================
  next(): void {

    this.currentIndex += 2;

    if (this.currentIndex >= this.slides.length) {
      this.currentIndex = 0;
    }

    this.updateVisibleSlides();
  }

  // ======================
  // DOT CLICK
  // ======================
  goTo(index: number): void {

    this.currentIndex = index * 2;
    this.updateVisibleSlides();
  }

  startAuto(): void {

    clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.next();
    }, 15000);
  }
}