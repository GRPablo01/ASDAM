import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../Model/Notif';
import { NotificationService } from '../../../../services/notifications.Service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-notifications-j',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './notifications-j.html',
  styleUrls: ['./notifications-j.css']
})
export class NotificationsJ implements OnInit {
  notifications: Notification[] = [];

  constructor(private notifService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notifService.getNotifications().subscribe({
      next: (data) => this.notifications = data,
      error: (err) => console.error('Erreur récupération notifications', err)
    });
  }

  getIcon(type: string) {
    switch(type) {
      case 'match': return '⚽';
      case 'message': return '💬';
      case 'alerte': return '⚠️';
      default: return '';
    }
  }
}
