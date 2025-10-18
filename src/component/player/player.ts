import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UtilisateurService, User } from '../../../services/userService/utilisateur.Service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player.html',
  styleUrls: ['./player.css']
})
export class Player implements OnInit {

  utilisateurs: User[] = [];
  utilisateursFiltres: User[] = [];
  selectedRole: string = '';
  selectedEquipe: string = '';
  searchTerm: string = '';
  loading = true;
  showModal = false;
  currentUser: User | null = null;

  currentPage: number = 1;
  cardsPerPage: number = 8;

  filterRoles: string[] = [];
  equipes: string[] = [];

  // Map pour harmoniser les rôles boutons <-> données
  roleMap: { [key: string]: string } = {
    'joueur': 'joueur',
    'coach': 'coach',
    'invité': 'inviter'
  };

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.setFilterRoles();
    console.log('Rôles autorisés pour cet utilisateur :', this.filterRoles);
    this.loadUsers();
  }

  private setFilterRoles(): void {
    const connectedUser = localStorage.getItem('utilisateur');
    if (!connectedUser) return;

    const user = JSON.parse(connectedUser);
    const role = user.role;

    if (role === 'Super Admin') {
      this.filterRoles = ['Joueur', 'Coach', 'Inviter', 'Admin'];
    } else if (role === 'Admin') {
      this.filterRoles = ['Joueur', 'Coach', 'Inviter'];
    } else {
      this.filterRoles = [];
    }
    console.log('setFilterRoles() -> filterRoles :', this.filterRoles);
  }

  loadUsers(): void {
    this.loading = true;
    this.utilisateurService.getUsers().subscribe({
      next: (data) => {
        let users: User[] = (data || []).map(u => ({
          ...u,
          id: u.id || (u as any)._id
        }));

        // Suppression doublons basés sur l'ID
        const uniqueUsersMap = new Map<string, User>();
        users.forEach(u => {
          if (u.id && !uniqueUsersMap.has(u.id)) {
            uniqueUsersMap.set(u.id, u);
          }
        });
        this.utilisateurs = Array.from(uniqueUsersMap.values());

        // Liste des équipes uniques
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

  private normalizeText(text: string = ''): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  filtrerUtilisateurs(): void {
    let filtres = this.utilisateurs;

    // Filtre par rôle
    if (this.selectedRole) {
      const selected = this.roleMap[this.selectedRole] || this.selectedRole;
      filtres = filtres.filter(u => this.normalizeText(u.role) === this.normalizeText(selected));
    }

    // Filtre par équipe
    if (this.selectedEquipe) {
      filtres = filtres.filter(u => u.equipe === this.selectedEquipe);
    }

    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.normalizeText(this.searchTerm);
      filtres = filtres.filter(u =>
        this.normalizeText(u.prenom).includes(term) ||
        this.normalizeText(u.nom).includes(term)
      );
    }

    // Tri par nom
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
