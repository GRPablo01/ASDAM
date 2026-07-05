import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../Backend/Services/user.service';
import { AuthService } from '../../../../Backend/Services/auth.service';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Icon } from '../../../Composant/Share/icon/icon';

@Component({
  selector: 'app-supprimer-user-key',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './supprimer-user-key.html',
  styleUrl: './supprimer-user-key.css',
})
export class SupprimerUserKey implements OnInit {

  user: any = {
    _id: '',
    key:'',
    nom: '',
    prenom: '',
    email: '',
    role: ''
  };

  loading: boolean = false;

  // 👉 identifiant unique (id OU key)
  userKey: string = '';

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

    // ======================================================
    // 🔥 RÉCUPÉRATION ID / KEY DE L’URL
    // ======================================================
    const id = this.route.snapshot.paramMap.get('key')
          || this.route.snapshot.paramMap.get('id');

    this.userKey = id || '';

    console.log('🔎 IDENTIFIANT REÇU :', this.userKey);

    if (!this.userKey) {
      console.error('❌ Aucun identifiant trouvé dans l’URL');
      return;
    }

    this.loadUser();
  }

  // =========================================================
  // ROLE GRADIENT (inchangé)
  // =========================================================
  getRoleGradient(role: string = ''): string {

    const r = role.toLowerCase();
    const isDark = this.themeService.isDarkMode;

    const light: any = {
      superadmin: `linear-gradient(135deg, ${this.themeService.c11Light}, ${this.themeService.c11Light})`,
      admin: `linear-gradient(135deg, ${this.themeService.c17Light}, ${this.themeService.c17Light})`,
      entraineur: `linear-gradient(135deg, ${this.themeService.c9Light}, ${this.themeService.c9Light})`,
      joueur: `linear-gradient(135deg, ${this.themeService.c2Light}, ${this.themeService.c2Light})`,
      inviter: `linear-gradient(135deg, ${this.themeService.c12Light}, ${this.themeService.c12Light})`
    };

    const dark: any = {
      superadmin: `linear-gradient(135deg, ${this.themeService.c11Dark}, ${this.themeService.c11Dark})`,
      admin: `linear-gradient(135deg, ${this.themeService.c17Dark}, ${this.themeService.c17Dark})`,
      entraineur: `linear-gradient(135deg, ${this.themeService.c9Dark}, ${this.themeService.c9Dark})`,
      joueur: `linear-gradient(135deg, ${this.themeService.c2Dark}, ${this.themeService.c2Dark})`,
      inviter: `linear-gradient(135deg, ${this.themeService.c12Dark}, ${this.themeService.c12Dark})`
    };

    return (isDark ? dark : light)[r] || light.inviter;
  }


  // ======================================================
  // 👤 LOAD USER (ID OU KEY)
  // ======================================================
  loadUser() {

    this.loading = true;

    this.authService.getAllUsers().subscribe({
      next: (res: any) => {

        const users = res?.users || res;

        const found = users.find((u: any) => {

          const value = String(this.userKey).trim();

          return (
            String(u._id).trim() === value ||
            String(u.id).trim() === value ||
            String(u.key).trim() === value
          );
        });

        if (found) {
          this.user = found;
          console.log('✅ Utilisateur trouvé :', found);
        } else {
          console.warn('⚠️ Aucun utilisateur trouvé avec :', this.userKey);
        }

        this.loading = false;
      },

      error: (err) => {
        console.error('❌ Erreur load users:', err);
        this.loading = false;
      }
    });
  }

  // ======================================================
  // 🔔 TOAST
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

    if (!this.userKey) {
      console.error('❌ Identifiant utilisateur manquant');
      this.notificationMessage = 'Utilisateur introuvable';
      this.showNotification = true;
      return;
    }

    this.userService.deleteUser(this.userKey).subscribe({
      next: () => {

        console.log('✅ Utilisateur supprimé');

        this.notificationMessage = 'Utilisateur supprimé avec succès';
        this.showNotification = true;

        setTimeout(() => {
          this.router.navigate(['/user']);
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
    this.router.navigate(['/profil']);
  }
}