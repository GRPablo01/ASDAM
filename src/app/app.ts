import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotifMessage } from '../component/notif-message/notif-message';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NotifMessage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'ASDAM';
}
