import { Component, OnInit } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common'; // <-- important !

interface Notification {
  id: number;
  type: 'match' | 'message' | 'alerte';
  message: string;
  date: Date;
  lu: boolean;
}

@Component({
  selector: 'app-notifications-c',
  standalone: true, // <-- obligatoire pour un composant standalone
  imports: [CommonModule, UpperCasePipe], // <-- ajoute CommonModule pour les directives et pipes
  templateUrl: './notifications-c.html',
  styleUrls: ['./notifications-c.css']
})
export class NotificationsC implements OnInit {
  notifications: Notification[] = [];

  ngOnInit() {
    this.notifications = [
      { id: 1, type: 'match', message: 'Match contre l’équipe B ce samedi à 15h', date: new Date(), lu: false },
      { id: 2, type: 'message', message: 'Le joueur Paul a envoyé un message', date: new Date(), lu: true },
      { id: 3, type: 'alerte', message: 'Pense à confirmer la présence des joueurs pour le prochain entraînement', date: new Date(), lu: false }
    ];
  }

  marquerCommeLu(notification: Notification) {
    notification.lu = true;
  }
}
