import { Component } from '@angular/core';
import { HeaderA } from "../../header-a/header-a";

@Component({
  selector: 'app-section1',
  imports: [HeaderA],
  templateUrl: './section1.html',
  styleUrl: './section1.css'
})
export class Section1 {
  isPopupOpen = false;

  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }
}