import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Login } from '../../../Composant/auth/login/login';
import { Mobile } from '../../../Composant/Share/mobile/mobile';
import { ResetPassword } from '../../../Composant/Share/Page-ChangePassword/reset-password/reset-password';


@Component({
  selector: 'app-change-password',
  imports: [CommonModule,ResetPassword],
  standalone:true,
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {


  // ✅ Variable pour simuler le chargement
  isLoaded: boolean = false;

  constructor(
    private titleService: Title,
  ) {}

  ngOnInit(): void {

    // 🧠 Titre onglet
    this.titleService.setTitle('ASDAM | ChangePassword');

    // ⏳ Petit effet de chargement
    setTimeout(() => {
      this.isLoaded = true;
    }, 10);
  }

}
