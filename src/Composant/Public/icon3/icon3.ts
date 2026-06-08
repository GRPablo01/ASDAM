import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../../Share/icon/icon';
import { Notif } from '../../Share/Page-Header/notif/notif';
import { News } from '../../Share/Page-Header/news/news';
import { Theme } from '../../Share/Page-Header/theme/theme';
import { ThemeService } from '../../../../Backend/Services/theme.service';




@Component({
  selector: 'app-icon3',
  imports: [Icon,Notif,News,Theme,CommonModule],
  templateUrl: './icon3.html',
  styleUrl: './icon3.css',
})
export class Icon3 {

  constructor(
      public themeService: ThemeService
    ) {}

}
