import { Component } from '@angular/core';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { NotificationsC } from '../../../component/Coach/notifications-c/notifications-c';

@Component({
  selector: 'app-notif-c',
  imports: [HeaderC,NotificationsC],
  templateUrl: './notif-c.html',
  styleUrl: './notif-c.css'
})
export class NotifC {

}
