import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-gest',
  imports: [CommonModule],
  templateUrl: './gest.html',
  styleUrl: './gest.css',
})
export class Gest {

  constructor(
      public themeService: ThemeService
    ) {}

}
