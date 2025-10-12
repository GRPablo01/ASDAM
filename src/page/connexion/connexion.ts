import { Component } from '@angular/core';
import { Login } from '../login/login';

@Component({
  selector: 'app-connexion',
  standalone: true,           // composant autonome
  imports: [Login],           // importe le composant login
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css']  // CORRECTION : styleUrls au pluriel
})
export class Connexion { }
