// src/app/pages/convocations/convoque-a/convoque-a.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvocationService, Convocation, User } from '../../../../services/convocation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-convoque-a',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './convoque-a.html',
  styleUrls: ['./convoque-a.css']
})
export class ConvoqueA implements OnInit {

  convocations: Convocation[] = [];
  userInConvocations: Convocation[] = [];
  loading = false;
  error = '';
  userConnecte: User | null = null;
  backendUrl = 'http://localhost:3000';
  notificationMessage = '';

  constructor(
    private convocationService: ConvocationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.recupererUtilisateur();
    this.chargerConvocations();
  }

  private recupererUtilisateur(): void {
    const userJson = localStorage.getItem('utilisateur');
    if (userJson) {
      try {
        this.userConnecte = JSON.parse(userJson) as User;
      } catch (e) {
        console.error('Erreur parsing utilisateur depuis localStorage', e);
        this.userConnecte = null;
      }
    }
  }

  private chargerConvocations(): void {
    this.loading = true;
    this.convocationService.getConvocations().subscribe({
      next: (data: Convocation[]) => {
        this.convocations = data;

        if (this.userConnecte) {
          if (this.userConnecte.role === 'admin') {
            // 🔥 L’admin voit toutes les convocations
            this.userInConvocations = this.convocations;
          } else if (this.userConnecte.role === 'coach') {
            // 👟 Le coach voit uniquement les convocations de son équipe
            this.userInConvocations = this.convocations.filter(conv =>
              conv.equipe === this.userConnecte!.equipe
            );
          } else {
            // 👤 Le joueur voit uniquement ses convocations
            this.userInConvocations = this.convocations.filter(conv =>
              conv.joueurs.some(j => j.nom === this.userConnecte!.nom && j.prenom === this.userConnecte!.prenom)
            );
          }
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des convocations', err);
        this.error = 'Impossible de récupérer les convocations.';
        this.loading = false;
      }
    });
  }

  hasAlreadyClickedForDate(dateConvocation: string | Date): boolean {
    if (!this.userConnecte) return false;

    const dateStr = typeof dateConvocation === 'string'
      ? dateConvocation
      : dateConvocation.toISOString().split('T')[0];

    const presenceKey = `presence_${this.userConnecte.nom}_${this.userConnecte.prenom}_${dateStr}`;
    return localStorage.getItem(presenceKey) === 'true';
  }

  updatePresence(conv: Convocation, present: boolean): void {
    if (!this.userConnecte?._id) return;

    const dateConv = typeof conv.date === 'string'
      ? conv.date
      : conv.date.toISOString().split('T')[0];

    const presenceKey = `presence_${this.userConnecte.nom}_${this.userConnecte.prenom}_${dateConv}`;

    if (localStorage.getItem(presenceKey) === 'true') {
      this.notificationMessage = "Vous avez déjà répondu pour cette convocation.";
      setTimeout(() => (this.notificationMessage = ''), 3000);
      return;
    }

    this.userConnecte.etatPresence = present ? 'present' : 'absent';
    this.userConnecte.hasClicked = true;

    if (!this.userConnecte.hasClickedConv) this.userConnecte.hasClickedConv = {};
    this.userConnecte.hasClickedConv[conv._id!] = true;

    localStorage.setItem(presenceKey, 'true');

    conv.joueurs = conv.joueurs.map(j =>
      j._id === this.userConnecte!._id
        ? { ...j, etatPresence: this.userConnecte!.etatPresence, hasClicked: true }
        : j
    );

    this.convocationService.updatePresence(conv._id!, this.userConnecte._id, present).subscribe({
      next: res => console.log('Mise à jour DB réussie ✅', res),
      error: err => console.error('Erreur mise à jour DB ❌', err)
    });

    if (conv.mailCoach) {
      this.http.post(`${this.backendUrl}/api/confirmation`, {
        prenom: this.userConnecte.prenom,
        nom: this.userConnecte.nom,
        mailCoach: conv.mailCoach,
        match: conv.match,
        date: conv.date,
        lieu: conv.lieu,
        present
      }).subscribe({
        next: () => console.log('Mail envoyé au coach ✅'),
        error: err => console.error('Erreur envoi mail :', err)
      });
    }

    this.notificationMessage = present
      ? "Vous avez confirmé votre présence ✅"
      : "Vous avez indiqué votre absence ❌";

    setTimeout(() => (this.notificationMessage = ''), 3000);
  }

  canClick(conv: Convocation): boolean {
    if (!this.userConnecte) return false;

    const dateConv = typeof conv.date === 'string'
      ? conv.date
      : conv.date.toISOString().split('T')[0];

    const presenceKey = `presence_${this.userConnecte.nom}_${this.userConnecte.prenom}_${dateConv}`;
    return localStorage.getItem(presenceKey) !== 'true';
  }

  getInitiales(joueur: any): string {
    return ((joueur.prenom?.charAt(0) || '') + (joueur.nom?.charAt(0) || '')).toUpperCase();
  }
}
