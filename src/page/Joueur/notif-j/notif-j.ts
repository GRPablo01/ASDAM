import { Component } from '@angular/core';
import { HeaderJ } from "../../../component/Joueur/header-j/header-j";
import { NotificationsJ } from "../../../component/Joueur/notifications-j/notifications-j";

@Component({
  selector: 'app-notif-j',
  imports: [HeaderJ, NotificationsJ],
  templateUrl: './notif-j.html',
  styleUrl: './notif-j.css'
})
export class NotifJ {

}
