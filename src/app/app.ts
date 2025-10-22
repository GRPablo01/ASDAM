import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotifMessage } from '../component/notif-message/notif-message';
import { NotifCommunique } from "../component/notif-communiquer/notif-communiquer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotifMessage, NotifCommunique],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'ASDAM';
}
