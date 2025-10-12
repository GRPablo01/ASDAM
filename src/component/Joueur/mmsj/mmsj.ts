// mmsj.component.ts
import { Component } from '@angular/core';

interface Message {
  user: string;
  text: string;
  date: Date;
}

@Component({
  selector: 'app-mmsj',
  standalone: true,
  templateUrl: './mmsj.html',
  styleUrls: ['./mmsj.css']
})
export class MMSJ {
  currentUser: string = 'Moi'; // ici tu peux remplacer par le nom de l'utilisateur connecté
  newMessage: string = '';
  messages: Message[] = [];

  sendMessage() {
    if (this.newMessage.trim() === '') return;

    this.messages.push({
      user: this.currentUser,
      text: this.newMessage,
      date: new Date()
    });

    this.newMessage = '';
  }
}
