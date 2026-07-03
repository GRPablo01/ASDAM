import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import {
  Convocation,
  ConvocationService,
  Joueur
} from '../../../../../Backend/Services/convocation.service';

import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-convo',
  templateUrl: './convo.html',
  styleUrls: ['./convo.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class Convo implements OnInit {

  // ================= DATA =================
  convocations: Convocation[] = [];
  convo?: Convocation;

  loading = false;
  errorMessage = '';
  isLoading = false;

  // ================= USER =================
  equipe = '';
  role = '';
  nom = '';
  prenom = '';

  // ================= UI =================
  currentFilter: 'tous' | 'present' | 'absent' = 'tous';
  selectedJoueurs: Joueur[] = [];

  constructor(
    private convocationService: ConvocationService,
    public themeservice: ThemeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getUserFromLocalStorage();
    this.loadConvocations();
  }

  // ================= USER =================
  getUserFromLocalStorage(): void {
    const user = localStorage.getItem('utilisateur');

    if (!user) return;

    const parsed = JSON.parse(user);

    this.equipe = parsed.equipe ?? '';
    this.role = parsed.role ?? '';
    this.nom = parsed.nom ?? '';
    this.prenom = parsed.prenom ?? '';
  }

  // ================= DATA LOAD =================
  loadConvocations(): void {
    this.loading = true;

    this.convocationService.getConvocations().subscribe({
      next: (data) => {

        this.convocations = data.filter(convo => {

          const bonneEquipe = convo.equipe === this.equipe;

          // 👨‍🏫 ENTRENNEUR
          if (this.role === 'entraineur') {
            return bonneEquipe;
          }

          // 🧑 JOUEUR
          if (this.role === 'joueur') {
            const isInConvo = convo.joueurs?.some(j =>
              j.nom?.toLowerCase().trim() === this.nom.toLowerCase().trim() &&
              j.prenom?.toLowerCase().trim() === this.prenom.toLowerCase().trim()
            );

            return bonneEquipe && isInConvo;
          }

          return false;
        });

        this.convo = this.convocations[0];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des convocations.';
        this.loading = false;
      }
    });
  }

  // ================= ACTIONS JOUEUR =================
  changerStatut(joueur: Joueur, statut: 'oui' | 'non' | 'non_repondu'): void {

    if (!this.convo?._id || !joueur?.key) return;

    const url = `http://localhost:3000/api/convocation/${this.convo._id}/joueur/${joueur.key}`;

    this.http.put(url, { present: statut }).subscribe({
      next: () => {
        joueur.present = statut;
      },
      error: (err) => console.error(err)
    });
  }

  // ================= FILTERS =================
  setFilter(filter: 'tous' | 'present' | 'absent'): void {
    this.currentFilter = filter;
  }

  getFilteredJoueurs(convo: Convocation): Joueur[] {
    if (!convo?.joueurs) return [];

    switch (this.currentFilter) {
      case 'present':
        return convo.joueurs.filter(j => j.present === 'oui');
      case 'absent':
        return convo.joueurs.filter(j => j.present === 'non');
      default:
        return convo.joueurs;
    }
  }

  // ================= STATS =================
  getPresentCount(convo: Convocation): number {
    return convo.joueurs?.filter(j => j.present === 'oui').length ?? 0;
  }

  getAbsentCount(convo: Convocation): number {
    return convo.joueurs?.filter(j => j.present === 'non').length ?? 0;
  }

  getResponseRate(convo: Convocation): number {
    if (!convo.joueurs?.length) return 0;

    const answered = convo.joueurs.filter(j =>
      j.present === 'oui' || j.present === 'non'
    ).length;

    return Math.round((answered / convo.joueurs.length) * 100);
  }

  // ================= HELPERS =================
  isJoueurConnecte(joueur: Joueur): boolean {
    return this.role === 'joueur' &&
      joueur.nom?.toLowerCase().trim() === this.nom.toLowerCase().trim() &&
      joueur.prenom?.toLowerCase().trim() === this.prenom.toLowerCase().trim();
  }

  aDejaRepondu(joueur: Joueur): boolean {
    return joueur.present === 'oui' || joueur.present === 'non';
  }

  isSelected(joueur: Joueur): boolean {
    return this.selectedJoueurs.includes(joueur);
  }

  getInitiales(joueur: Joueur): string {
    if (!joueur) return '';
    return ((joueur.prenom?.[0] ?? '') + (joueur.nom?.[0] ?? '')).toUpperCase();
  }

  // ================= NAVIGATION =================
  scrollToConvocation(index: number): void {
    const elements = document.querySelectorAll('.convocation-item');
    elements[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}