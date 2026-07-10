import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profil.html',
  styleUrl: './user-profil.css',
})
export class UserProfil implements OnInit {

  loading = false;
  showNotification = false;
  notificationMessage = '';

  user: any = {
    key: '',
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: '',
    club: '',
    equipe: '',
    status: '',
    cookie: '',
    compte: '',
    codeAcces: '',
    photo: '',
  };

  constructor(
    public themeService: ThemeService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  // =========================================================
  // STYLE INPUT
  // =========================================================
  get inputStyle() {
    return {
      background: this.themeService.Backgroundsecondairetest,
      border: '1px solid ' + this.themeService.Bordernormal,
      color: this.themeService.Textsecondaire,
      boxShadow: this.themeService.Bowshadowtest
    };
  }

  // =========================================================
  // LOAD USER
  // =========================================================
  loadUser(): void {
    const storedUser = localStorage.getItem('utilisateur');

    if (storedUser) {
      this.user = {
        ...this.user,
        ...JSON.parse(storedUser)
      };

      console.log('👤 USER LOAD :', this.user);
    }
  }

  showToast(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
  
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
  
  closeNotification(): void {
    this.showNotification = false;
  }

  // =========================================================
  // 🔥 UPDATE USER (ID OU KEY) - CHAMPS MODIFIÉS UNIQUEMENT
  // =========================================================
  updateUser(): void {

    console.log('====================================');
    console.log('🚀 UPDATE USER GLOBAL');
    console.log('====================================');

    console.log('👤 USER :', this.user);

    const idOrKey = this.user?.key?.trim();

    if (!idOrKey) {
      console.error('❌ Aucun ID/KEY trouvé');
      this.showToast('Erreur : utilisateur introuvable ❌');
      return;
    }

    this.loading = true;

    const url = `http://localhost:3000/api/users/${idOrKey}`;

    // 🔥 BODY DYNAMIQUE (uniquement champs modifiés)
    const body: any = {};

    if (this.user.nom !== undefined) body.nom = this.user.nom;
    if (this.user.prenom !== undefined) body.prenom = this.user.prenom;
    if (this.user.email !== undefined) body.email = this.user.email;
    if (this.user.password !== undefined && this.user.password !== '') body.password = this.user.password;
    if (this.user.role !== undefined) body.role = this.user.role;
    if (this.user.club !== undefined) body.club = this.user.club;
    if (this.user.equipe !== undefined) body.equipe = this.user.equipe;
    if (this.user.status !== undefined) body.status = this.user.status;
    if (this.user.cookie !== undefined) body.cookie = this.user.cookie;
    if (this.user.compte !== undefined) body.compte = this.user.compte;
    if (this.user.codeAcces !== undefined) body.codeAcces = this.user.codeAcces;
    if (this.user.photo !== undefined) body.photo = this.user.photo;

    console.log('🌐 URL :', url);
    console.log('📦 BODY (champs modifiés) :', body);

    this.http.put(url, body).subscribe({

      next: (res: any) => {

        console.log('✅ USER MIS À JOUR', res);

        // 🔥 sync localStorage
        localStorage.setItem('utilisateur', JSON.stringify(this.user));

        this.loading = false;

        this.showToast('Profil mis à jour avec succès ✅');

      },

      error: (err) => {

        console.error('❌ ERREUR UPDATE USER', err);

        this.loading = false;

        this.showToast('Erreur lors de la mise à jour ❌');

      }

    });
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

  // =========================================================
  // PASSWORD PAGE
  // =========================================================
  goToPasswordPage() {
    this.router.navigate(['/change-password']);
  }

  deleteAccount(): void {

    const userId = this.user?._id || this.user?.id;
    const userKey = this.user?.key;
  
    // 👉 priorité à l’ID, sinon KEY
    if (userId) {
  
      console.log('➡️ Redirection avec ID :', userId);
      this.router.navigate(['/users/deleteID', userId]);
  
      return;
    }
  
    if (userKey) {
  
      console.log('➡️ Redirection avec KEY :', userKey);
      this.router.navigate(['/users/deleteKEY/key', userKey]);
  
      return;
    }
  
    console.error('❌ Aucun ID ni KEY utilisateur trouvé');
  }
}