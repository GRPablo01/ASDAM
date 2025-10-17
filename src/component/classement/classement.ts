import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Equipe {
  equipe: string;
  pts: number;
  jo: number;
  g: number;
  n: number;
  p: number;
  f: number;
  bp: number;
  bc: number;
  pe: number;
  dif: number;
}

interface ClassementCategorie {
  _id?: string;
  categorie: string;
  equipes: Equipe[];
}

@Component({
  selector: 'app-classement',
  templateUrl: './classement.html',
  styleUrls: ['./classement.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class Classement implements OnInit {
  // ✅ Boutons visibles dans le menu
  equipes: string[] = [
    'U11',
    'U13',
    'U15',
    'U18',
    'U23',
    'Senior A',
    'Senior B',
    'Senior D',
  ];

  // ✅ Par défaut, afficher le dernier ou Senior A
  selectedEquipe: string | null = 'Senior A';
  classement: ClassementCategorie[] = [];

  // ✅ URL backend
  private apiUrl = 'http://localhost:3000/api/classements';

  // ✅ Mapping entre bouton et plusieurs catégories MongoDB
  private equipeMapping: { [key: string]: string[] } = {
    U11: ['U11 Automne POULE 04', 'U11 Automne CRIT U10 POULE 1'],
    U13: [
      'U13 Automne POULE N3A',
      'U13 Automne POULE N3B',
      'U13 Automne POULE N2C',
      'U13 FEMININES A 8 BRASSAGE PHASE AUT POULE D',
    ],
    U15: ['U15 D1 Automne POULE D'],
    U18: ['U18 Excellence POULE UNIQUE', 'U18 D2 Automne POULE D'],
    U23: ['Départemental 3 - Poule B'],
    'Senior A': ['REGIONAL 2 - Poule D'],
    'Senior B': ['Départemental 1 - Poule A'],
    'Senior D': ['Départemental 4 - Poule A'],
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  // Récupérer le dernier choix depuis localStorage
  const last = localStorage.getItem('lastEquipe');
  if (last) this.selectedEquipe = last;

  this.getClassements().subscribe({
    next: (data) => {
      this.classement = data;
      console.log('✅ Classements chargés :', data);
    },
    error: (err) => console.error('❌ Erreur récupération classement:', err),
  });
}


  // ✅ Récupère tous les classements depuis le backend
  getClassements(): Observable<ClassementCategorie[]> {
    return this.http.get<ClassementCategorie[]>(this.apiUrl);
  }

  // ✅ Sélection d’une équipe (groupe)
  selectEquipe(equipe: string): void {
    this.selectedEquipe = equipe;
    // On peut sauvegarder le dernier choix dans localStorage si tu veux
    localStorage.setItem('lastEquipe', equipe);
  }

  // ✅ Retourne les classements filtrés selon le groupe sélectionné
  get classementFiltre(): ClassementCategorie[] {
    if (!this.selectedEquipe) return [];
    const categories = this.equipeMapping[this.selectedEquipe] || [];
    return this.classement.filter((c) => categories.includes(c.categorie));
  }
}
