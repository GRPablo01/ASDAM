import { Component } from '@angular/core';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { MMSC } from '../../../component/Coach/page-message/mmsc/mmsc';

@Component({
  selector: 'app-message-s',
  imports: [HeaderS,MMSC],
  templateUrl: './message-s.html',
  styleUrl: './message-s.css'
})
export class MessageS {

}
