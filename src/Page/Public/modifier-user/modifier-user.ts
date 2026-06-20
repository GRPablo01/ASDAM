import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../Backend/Services/user.service';
import { AuthService } from '../../../../Backend/Services/auth.service';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Icon } from '../../../Composant/Share/icon/icon';

@Component({
  selector: 'app-modifier-user',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon],
  templateUrl: './modifier-user.html',
  styleUrl: './modifier-user.css',
})
export class ModifierUser implements OnInit {

  user: any = {
    _id: '',
    nom: '',
    prenom: '',
    email: '',
    role: ''
  };

  allUsers: any[] = [];
  loading: boolean = false;

  // 🔥 ID venant de la route
  userId: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    public themeService: ThemeService,
    private userService: UserService,
  ) { }

  ngOnInit() {

    // =========================
    // 🔥 récupérer ID URL
    // =========================
    this.userId = this.route.snapshot.paramMap.get('id') || '';

    console.log('🆔 ID USER ROUTE :', this.userId);

    if (!this.userId) {
      console.error('❌ Aucun ID dans la route');
      return;
    }

    this.loadUsers();
  }

  // ======================================================
  // 🔥 GET ALL USERS
  // ======================================================
  loadUsers() {

    this.authService.getAllUsers().subscribe({
      next: (res: any) => {

        const users: any[] = res?.users || res || [];
        this.allUsers = users;

        // 🔥 MATCH AVEC ID (_id OU id)
        const currentUser = users.find(
          (u: any) => (u._id || u.id) === this.userId
        );

        if (currentUser) {
          this.user = { ...currentUser };
          console.log('✅ User trouvé :', this.user);
        } else {
          console.error('❌ Utilisateur introuvable');
        }
      },

      error: (err) => {
        console.error('❌ Erreur chargement users', err);
      }
    });
  }

  showNotification = false;
  notificationMessage = '';

  closeNotification() {
    this.showNotification = false;
  }

  // ======================================================
// 🔥 UPDATE USER
// ======================================================

updateUser(): void {

  console.log('===================================');
  console.log('🔥 UPDATE USER');
  console.log('===================================');

  // ======================================================
  // CHECK USER ID
  // ======================================================

  if (!this.userId) {

    console.error('❌ ID utilisateur manquant');

    this.notificationMessage = 'ID utilisateur introuvable';
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);

    return;
  }

  // ======================================================
  // CHECK FORM
  // ======================================================

  if (
    !this.user.nom ||
    !this.user.prenom ||
    !this.user.email ||
    !this.user.role
  ) {

    console.error('❌ Champs manquants');

    this.notificationMessage = 'Veuillez remplir tous les champs';
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);

    return;
  }

  // ======================================================
  // START LOADING
  // ======================================================

  this.loading = true;

  console.log('📤 Données envoyées :', this.user);

  // ======================================================
  // API UPDATE (UserService)
  // ======================================================

  this.userService.updateUser(this.userId, this.user)
    .subscribe({

      // ======================================================
      // SUCCESS
      // ======================================================

      next: (res) => {

        console.log('✅ Utilisateur modifié :', res);

        this.loading = false;

        this.notificationMessage = 'Utilisateur modifié avec succès';
        this.showNotification = true;

        setTimeout(() => {

          this.showNotification = false;

          // 👉 redirection après update
          this.router.navigate(['/user']);

        }, 2000);

      },

      // ======================================================
      // ERROR
      // ======================================================

      error: (err) => {

        console.error('❌ Erreur modification utilisateur', err);

        this.loading = false;

        this.notificationMessage = 'Erreur lors de la modification';
        this.showNotification = true;

        setTimeout(() => {
          this.showNotification = false;
        }, 3500);

      }

    });

}

  // ======================================================
  // 🔙 BACK
  // ======================================================
  goBack() {

    console.log('🔙 Retour liste users');

    // optionnel: nettoyage si tu veux
    this.router.navigate(['/user']);
  }
}