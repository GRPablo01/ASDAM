import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../services/userService/Profil.Service';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'app-barre-j',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, Icon],
  templateUrl: './barre-j.html',
  styleUrls: ['./barre-j.css']
})
export class BarreJ implements OnInit {
  user: any = null;

  constructor(
    public profileService: ProfileService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserCard();
  }

  loadUserCard(): void {
    const currentUser = this.profileService.getUser();
    if (!currentUser?._id) return;

    this.http.get(`http://localhost:3000/asdam/card/${currentUser._id}`)
      .subscribe({
        next: (data: any) => {
          const { nom, prenom, equipe, role, initiale } = data;
          this.user = {
            nom,
            prenom,
            equipe,
            membre: role,
            initiales: initiale
          };
        },
        error: (err) => console.error('Erreur lors de la récupération de la carte utilisateur :', err)
      });
  }

  getInitiales(): string {
    return this.user?.initiales || this.profileService.getInitiales();
  }

  getNomComplet(): string {
    return this.user ? `${this.user.prenom} ${this.user.nom}` : this.profileService.getNomComplet();
  }
}
