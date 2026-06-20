import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { AuthService } from '../../../../../Backend/Services/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {

  constructor(
    public themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  // =========================
  // 👤 USERS DATA
  // =========================
  users: any[] = [];
  filteredUsers: any[] = [];

  // =========================
  // 🎯 FILTER
  // =========================
  selectedRole: string = 'tous';

  // =========================
  // ⏳ LOADING
  // =========================
  loading: boolean = false;

  // =========================
  // ❌ ERROR
  // =========================
  errorMessage: string = '';

  // =========================
  // 🚀 INIT
  // =========================
  ngOnInit(): void {
    this.loadUsers();
  }

  // =========================
  // 👤 LOAD USERS
  // =========================
  loadUsers(): void {

    this.loading = true;
    this.errorMessage = '';

    this.authService.getAllUsers().subscribe({

      next: (data: any) => {

        console.log('📦 DATA API : ', data);

        // ✅ sécuriser les données
        if (Array.isArray(data)) {

          this.users = data;

        } else if (data?.users && Array.isArray(data.users)) {

          this.users = data.users;

        } else {

          this.users = [];
        }

        // ✅ afficher tous les users
        this.filteredUsers = [...this.users];

        console.log('✅ Users chargés :', this.users);

        this.loading = false;
      },

      error: (err) => {

        console.error('❌ Erreur chargement users :', err);

        this.users = [];
        this.filteredUsers = [];

        this.errorMessage = 'Impossible de charger les utilisateurs';

        this.loading = false;
      }
    });
  }

  // =========================
  // 🔎 FILTER ROLE
  // =========================
  filtrerRole(role: string): void {

    this.selectedRole = role;

    // ✅ afficher tous les users
    if (role === 'tous') {

      this.filteredUsers = [...this.users];
      return;
    }

    // ✅ filtrage par rôle
    this.filteredUsers = this.users.filter(
      (u: any) =>
        u?.role?.toLowerCase() === role.toLowerCase()
    );
  }

  // =========================
  // 🎨 ACTIVE BUTTON
  // =========================
  isActive(role: string): boolean {
    return this.selectedRole === role;
  }

// =========================
// 🎨 ROLE COLOR — CLAIR / SOMBRE
// =========================
getRoleColor(role: string): string {
  const isDark = this.themeService.isDarkMode;

  switch (role?.toLowerCase()) {
    case 'superadmin':
      return isDark ? '#c084fc' : '#6b21a8';      // Violet rose (dark) / Violet profond (light)

    case 'admin':
      return isDark ? '#a78bfa' : '#7c3aed';      // Lavande (dark) / Violet royal (light)

    case 'joueur':
      return isDark ? '#60a5fa' : '#2563eb';      // Bleu ciel (dark) / Bleu royal (light)

    case 'entraineur':
      return isDark ? '#34d399' : '#059669';      // Émeraude (dark) / Vert forêt (light)

    case 'invite':
      return isDark ? '#fbbf24' : '#d97706';      // Ambre (dark) / Orange miel (light)

    default:
      return isDark ? '#9ca3af' : '#4b5563';      // Gris clair (dark) / Gris ardoise (light)
  }
}
  // =========================
  // ✏️ GO TO EDIT
  // =========================
  goToEdit(id: string): void {

    if (!id) {
      console.error('❌ ID utilisateur manquant');
      return;
    }

    this.router.navigate(['/users/edit', id]);
  }

  // =========================
  // ✏️ MODIFIER USER
  // =========================
  modifierUser(user: any): void {

    console.log('✏️ Modifier user :', user);

    if (user?._id) {

      this.goToEdit(user._id);

    } else if (user?.id) {

      this.goToEdit(user.id);

    } else {

      console.error('❌ Aucun ID trouvé pour cet utilisateur');
    }
  }

  // =========================
  // 🗑️ GO TO DELETE
  // =========================
  goToDelete(id: string): void {

    if (!id) {
      console.error('❌ ID utilisateur manquant');
      return;
    }

    console.log('➡️ Navigation vers /users/delete/' + id);
    this.router.navigate(['/users/delete', id]);
  }

  // =========================
  // 🗑️ SUPPRIMER USER
  // =========================
  supprimerUser(user: any): void {

    console.log('🗑️ Supprimer user :', user);

    const userId = user?._id || user?.id;

    if (!userId) {
      console.error('❌ ID utilisateur introuvable', user);
      return;
    }

    this.goToDelete(userId);
  }
}