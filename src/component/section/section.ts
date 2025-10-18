import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../header/header';



@Component({
  selector: 'app-section',
  imports: [RouterLink,Header],
  templateUrl: './section.html',
  styleUrl: './section.css'
})
export class Sections1C {
  isPopupOpen = false;

  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }
}