import { Component } from '@angular/core';
import { HeaderC } from '../../header-c/header-c';
import { RouterLink } from '@angular/router';
import { AbsentC } from "../../page-Absents/absent-c/absent-c";


@Component({
  selector: 'app-sections1-c',
  imports: [HeaderC, RouterLink, AbsentC],
  templateUrl: './sections1-c.html',
  styleUrl: './sections1-c.css'
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