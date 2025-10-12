import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.html',
  styleUrls: ['./classement.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Classement {
  equipes: string[] = [
    'U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U23',
    'Senior A','Senior B','Senior C','Senior D'
  ];

  selectedEquipe: string | null = null;

  // Classement Senior A
  classement: { Pl: number, Equipe: string, Pts: number, Jo: number, G: number, N: number, P: number, F: number, BP: number, BC: number, Pé: number, Dif: number }[] = [
    { Pl: 1, Equipe: 'VALDAHON-VERCEL', Pts: 9, Jo: 3, G: 3, N: 0, P: 0, F: 0, BP: 8, BC: 2, Pé: 0, Dif: 6 },
    { Pl: 2, Equipe: '4 RIVIERES 70', Pts: 9, Jo: 3, G: 3, N: 0, P: 0, F: 0, BP: 6, BC: 3, Pé: 0, Dif: 3 },
    { Pl: 3, Equipe: 'ST VIT', Pts: 7, Jo: 3, G: 2, N: 1, P: 0, F: 0, BP: 11, BC: 3, Pé: 0, Dif: 8 },
    { Pl: 4, Equipe: 'BELFORTAINE ASM FC', Pts: 6, Jo: 3, G: 2, N: 0, P: 1, F: 0, BP: 7, BC: 4, Pé: 0, Dif: 3 },
    { Pl: 5, Equipe: 'BAUME LES DAMES', Pts: 4, Jo: 3, G: 1, N: 1, P: 1, F: 0, BP: 5, BC: 4, Pé: 0, Dif: 1 },
    { Pl: 6, Equipe: 'BART', Pts: 4, Jo: 3, G: 1, N: 1, P: 1, F: 0, BP: 6, BC: 6, Pé: 0, Dif: 0 },
    { Pl: 7, Equipe: 'MORTEAU MONTLEBON FC', Pts: 3, Jo: 3, G: 1, N: 0, P: 2, F: 0, BP: 2, BC: 6, Pé: 0, Dif: -4 },
    { Pl: 8, Equipe: 'LURONNES', Pts: 3, Jo: 3, G: 1, N: 0, P: 2, F: 0, BP: 2, BC: 3, Pé: 0, Dif: -1 },
    { Pl: 9, Equipe: 'NOIDANAIS', Pts: 3, Jo: 3, G: 1, N: 0, P: 2, F: 0, BP: 4, BC: 6, Pé: 0, Dif: -2 },
    { Pl: 10, Equipe: 'DANJOUTIN ANDELNANS', Pts: 2, Jo: 3, G: 0, N: 2, P: 1, F: 0, BP: 5, BC: 6, Pé: 0, Dif: -1 },
    { Pl: 11, Equipe: 'MELISEY STBARTHELEMY', Pts: 1, Jo: 3, G: 0, N: 1, P: 2, F: 0, BP: 1, BC: 6, Pé: 0, Dif: -5 },
    { Pl: 12, Equipe: 'BAVILLIERS AS', Pts: 0, Jo: 3, G: 0, N: 0, P: 3, F: 0, BP: 1, BC: 9, Pé: 0, Dif: -8 }
  ];

  selectEquipe(equipe: string) {
    this.selectedEquipe = equipe;
  }

  get classementFiltre() {
    return this.selectedEquipe
      ? this.classement.filter(c => c.Equipe.includes(this.selectedEquipe!))
      : [];
  }
}
