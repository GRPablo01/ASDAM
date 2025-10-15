import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UtilisateurService, User } from '../../../../services/userService/utilisateur.service';

@Component({
  selector: 'app-player-a',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-a.html',
  styleUrls: ['./player-a.css']
})
export class PlayerA implements OnInit {

  utilisateurs: User[] = [];
  utilisateursFiltres: User[] = [];
  selectedRole: string = '';
  selectedEquipe: string = '';
  searchTerm: string = '';
  loading = true;
  showModal = false;
  currentUser: User | null = null;

  // Pagination
  currentPage: number = 1;
  cardsPerPage: number = 8;

  // Rôles dynamiques selon l'utilisateur connecté
  filterRoles: string[] = [];
  equipes: string[] = []; // Liste des équipes disponibles

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.setFilterRoles();
    this.loadUsers();
  }

  private setFilterRoles(): void {
    const connectedUser = localStorage.getItem('connectedUser');
    if (!connectedUser) return;

    const user = JSON.parse(connectedUser);
    const role = user.role;

    if (role === 'Super Admin') {
      this.filterRoles = ['Joueur', 'Coach', 'Invité', 'Admin'];
    } else if (role === 'Admin') {
      this.filterRoles = ['Joueur', 'Coach', 'Invité'];
    } else {
      this.filterRoles = [];
    }
  }

  loadUsers(): void {
    this.loading = true;
    this.utilisateurService.getUsers().subscribe({
      next: (data) => {
        this.utilisateurs = (data || []).map(u => ({
          ...u,
          id: u.id || (u as any)._id
        }));
        this.equipes = Array.from(new Set(this.utilisateurs.map(u => u.equipe).filter(Boolean)));
        this.filtrerUtilisateurs();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs :', err);
        this.loading = false;
      }
    });
  }

  filtrerUtilisateurs(): void {
    let filtres = this.utilisateurs;

    // Filtre par rôle
    if (this.selectedRole) {
      filtres = filtres.filter(u => u.role?.toLowerCase() === this.selectedRole.toLowerCase());
    }

    // Filtre par équipe
    if (this.selectedEquipe) {
      filtres = filtres.filter(u => u.equipe === this.selectedEquipe);
    }

    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtres = filtres.filter(u =>
        (u.prenom?.toLowerCase().includes(term) || u.nom?.toLowerCase().includes(term))
      );
    }

    // Tri alphabétique
    this.utilisateursFiltres = filtres.sort((a, b) => {
      const nameA = (a.prenom + ' ' + a.nom).toLowerCase();
      const nameB = (b.prenom + ' ' + b.nom).toLowerCase();
      return nameA.localeCompare(nameB);
    });

    this.currentPage = 1;
  }

  selectRole(role: string): void {
    this.selectedRole = this.selectedRole === role ? '' : role;
    this.filtrerUtilisateurs();
  }

  get totalPages(): number {
    return Math.ceil(this.utilisateursFiltres.length / this.cardsPerPage);
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.cardsPerPage;
    return this.utilisateursFiltres.slice(start, start + this.cardsPerPage);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  modifierUtilisateur(user: User): void {
    this.currentUser = { ...user };
    this.showModal = true;
  }

  saveChanges(form: NgForm): void {
    if (!this.currentUser) return;
    this.utilisateurService.updateUser(this.currentUser.id, this.currentUser).subscribe({
      next: () => {
        this.showModal = false;
        this.loadUsers();
      },
      error: (err) => console.error('Erreur mise à jour :', err)
    });
  }

  supprimerUtilisateur(user: User): void {
    if (!user.id) return console.error('ID utilisateur manquant');
    if (confirm(`Supprimer ${user.prenom} ${user.nom} ?`)) {
      this.utilisateurService.deleteUser(user.id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Erreur suppression :', err)
      });
    }
  }

}
