import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../Backend/Services/user.service';
import { AuthService } from '../../../../Backend/Services/auth.service';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Icon } from '../../../Composant/Share/icon/icon';

@Component({
  selector: 'app-supprimer-user',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './suprimer-user.html',
  styleUrl: './suprimer-user.css',
})
export class SupprimerUser implements OnInit {

  user: any = {
    _id: '',
    nom: '',
    prenom: '',
    email: '',
    role: ''
  };

  loading: boolean = false;
  userId: string = '';

  // ======================================================
  // 🔔 NOTIFICATION TOAST
  // ======================================================
  showNotification: boolean = false;
  notificationMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    public themeService: ThemeService,
    private userService: UserService,
  ) {}

  ngOnInit() {

    this.userId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.userId) return;

    this.loadUser();
  }

  // ======================================================
  // 👤 LOAD USER
  // ======================================================
  loadUser() {

    this.loading = true;

    this.authService.getAllUsers().subscribe({
      next: (res: any) => {

        const users = res?.users || res;

        const found = users.find(
          (u: any) => (u._id || u.id) === this.userId
        );

        if (found) {
          this.user = found;
        }

        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }
    });
  }

  // ======================================================
  // 🔔 SHOW TOAST (CONFIRMATION VISUELLE)
  // ======================================================
  openDeleteNotification() {
    this.showNotification = true;
    this.notificationMessage = `Suppression en cours pour ${this.user.prenom} ${this.user.nom}`;
  }

  closeNotification() {
    this.showNotification = false;
  }

  // ======================================================
// 🗑️ DELETE USER
// ======================================================

deleteUser(): void {

  console.log('===================================');
  console.log('🗑️ DELETE USER');
  console.log('===================================');

  // ======================================================
  // CHECK USER ID
  // ======================================================
  if (!this.userId) {
    console.error('❌ ID utilisateur manquant');
    this.notificationMessage = 'ID utilisateur introuvable';
    this.showNotification = true;
    return;
  }

  // ======================================================
  // CALL API (UserService)
  // ======================================================
  this.userService.deleteUser(this.userId).subscribe({
    next: () => {

      console.log('✅ Utilisateur supprimé');

      this.notificationMessage = 'Utilisateur supprimé avec succès';
      this.showNotification = true;

      setTimeout(() => {

        // 🔥 redirection après suppression
        this.router.navigate(['/user']); 
        // ex: ['/dashboard'], ['/users'], etc.

      }, 1200);

    },

    error: (err) => {
      console.error('❌ Erreur suppression user:', err);

      this.notificationMessage = 'Erreur lors de la suppression';
      this.showNotification = true;
    }
  });
}

  // ======================================================
  // 🔙 BACK
  // ======================================================
  goBack() {
    this.router.navigate(['/user']);
  }
}