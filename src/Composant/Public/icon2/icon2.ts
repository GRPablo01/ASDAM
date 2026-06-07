import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Icon } from '../../Share/icon/icon';
import { Notif } from '../../Share/Page-Header/notif/notif';
import { News } from '../../Share/Page-Header/news/news';
import { Theme } from '../../Share/Page-Header/theme/theme';









@Component({
  selector: 'app-icon2',
  standalone: true,
  imports: [Notif, News, Theme,Icon,CommonModule],
  templateUrl: './icon2.html',
  styleUrl: './icon2.css',
})
export class Icon2 {

  constructor(public themeService: ThemeService) {}
}
