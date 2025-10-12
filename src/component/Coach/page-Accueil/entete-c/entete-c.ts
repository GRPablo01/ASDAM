import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';

import { User, UtilisateurService } from '../../../../../services/userService/utilisateur.service';

// ⚡️ Enregistrer la locale française en dehors de la classe
registerLocaleData(localeFr);

@Component({
  selector: 'app-entete-c',
  templateUrl: './entete-c.html',
  styleUrls: ['./entete-c.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class EnteteC implements OnInit {
  user: User | null = null;
  loading: boolean = true;
  error: string | null = null;
  clubName: string = 'ASDAM'; // ⚡️ Peut être rendu dynamique plus tard

  constructor(private userService: UtilisateurService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data: User | null) => {
        if (data) {
          this.user = data;
        } else {
          this.error = 'Aucun utilisateur connecté';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur :', err);
        this.error = 'Erreur lors du chargement de l’utilisateur';
        this.loading = false;
      }
    });
  }

  // Récupère les initiales
  getInitials(): string {
    return this.user?.initiale ?? '';
  }

  // Récupère le rôle de l'utilisateur
  getRole(): string {
    return this.user?.role ?? '';
  }
}
