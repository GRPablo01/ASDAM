import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Icon } from "../../component/icon/icon";

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, Icon],
})
export class Login {
  passwordVisible = false;
  isLoading = false;
  message: string | null = null;
  errorMessage: string | null = null;
  redirectionApresConnexion: string | null = null;
  formSubmitted = false;
  rememberMe = false;

  connexionData = {
    email: '',
    password: '',
  };

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('rememberMe');
    if (saved) {
      const { email, password } = JSON.parse(saved);
      this.connexionData.email = email;
      this.connexionData.password = password;
      this.rememberMe = true;
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  formulaireValide(): boolean {
    const { email, password } = this.connexionData;
    return !!email && !!password && password.length >= 6;
  }

  private saveUser(user: any): void {
    try {
      const sessionUser = {
        _id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email || '',
        role: (user.role || '').trim().toLowerCase(), // super admin déjà géré
        initiale:
          user.initiale ||
          ((user.prenom?.[0] ?? '').toUpperCase() +
            (user.nom?.[0] ?? '').toUpperCase()),
        equipe: user.equipe || '',
      };
      
      localStorage.setItem('utilisateur', JSON.stringify(sessionUser));
      console.log('Session utilisateur enregistrée :', sessionUser);
    } catch (e) {
      console.error('Erreur lors de la sauvegarde de l’utilisateur', e);
    }
  }

  valider(): void {
    this.formSubmitted = true;

    if (!this.formulaireValide()) {
      return;
    }

    this.isLoading = true;
    const { email, password } = this.connexionData;

    this.http
      .post('http://localhost:3000/api/asdam/login', { email, password })
      .subscribe({
        next: (user: any) => {
          this.saveUser(user);

          if (this.rememberMe) {
            localStorage.setItem('rememberMe', JSON.stringify(this.connexionData));
          } else {
            localStorage.removeItem('rememberMe');
          }

          this.message = `Bienvenue ${user.prenom || 'sur TeamAsdam'} !`;

          // Map des rôles incluant super admin
          const routeMap: { [key: string]: string } = {
            admin: '/accueilA',
            'super admin': '/accueilS', // <-- rôle super admin ajouté
            coach: '/accueilC',
            joueur: '/accueilJ',
            inviter: '/accueilI',
          };

          const roleKey = (user.role || 'joueur').toLowerCase();
          this.redirectionApresConnexion = routeMap[roleKey] || '/accueilJ';

          setTimeout(() => {
            this.router.navigate([this.redirectionApresConnexion!]);
            this.message = null;
            this.redirectionApresConnexion = null;
            this.isLoading = false;
          }, 1200);
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message || 'Email ou mot de passe incorrect';
          this.isLoading = false;
          console.error('Erreur de connexion :', err);
        },
      });
  }

  deconnecter(): void {
    try {
      localStorage.removeItem('utilisateur');
      console.log('Utilisateur déconnecté et localStorage vidé');
    } catch (e) {
      console.error('Erreur lors de la suppression du localStorage', e);
    }
    this.router.navigate(['/connexion']);
  }
}
