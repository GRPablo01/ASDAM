import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Joueur,
  JoueurService
} from '../../../../../Backend/Services/joueur.service';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team implements OnInit {

  // ==============================
  // JOUEURS
  // ==============================
  joueurs: Joueur[] = [];

  // ==============================
  // EQUIPE COACH
  // ==============================
  equipeCoach = '';

  // ==============================
  // LOADING
  // ==============================
  isLoading = false;

  constructor(
    private joueurService: JoueurService
  ) {}

  // ==============================
  // INIT
  // ==============================
  ngOnInit(): void {

    this.getCoachEquipe();

    this.loadJoueurs();
  }

  // ==============================
  // GET EQUIPE COACH
  // ==============================
  getCoachEquipe(): void {

    const user = localStorage.getItem('utilisateur');

    if (!user) {
      console.error('❌ Aucun utilisateur trouvé');
      return;
    }

    const parsedUser = JSON.parse(user);

    console.log('👤 Coach connecté :', parsedUser);

    // Exemple :
    // parsedUser.equipe
    // parsedUser.team
    // parsedUser.nomEquipe

    this.equipeCoach = parsedUser.equipe;

    console.log('⚽ Equipe du coach :', this.equipeCoach);
  }

  // ==============================
  // LOAD JOUEURS
  // ==============================
  loadJoueurs(): void {

    console.log('⚽ Chargement des joueurs...');

    this.isLoading = true;

    this.joueurService.getAllJoueurs().subscribe({

      next: (data) => {

        console.log('✅ Tous les joueurs :', data);

        // =================================
        // FILTRE PAR EQUIPE
        // =================================
        this.joueurs = data.filter(
          joueur => joueur.equipe === this.equipeCoach
        );

        console.log('✅ Joueurs filtrés :', this.joueurs);

        this.isLoading = false;
      },

      error: (err) => {

        console.error('❌ Erreur récupération joueurs :', err);

        this.isLoading = false;
      }
    });
  }
}