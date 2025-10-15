import { Component } from '@angular/core';
import { HeaderA } from "../../../component/Admin/header-a/header-a";
import { FooterA } from "../../../component/Admin/footer-a/footer-a";
import { MMSC } from "../../../component/Coach/page-message/mmsc/mmsc";

@Component({
  selector: 'app-message-a',
  imports: [HeaderA, FooterA, MMSC],
  templateUrl: './message-a.html',
  styleUrl: './message-a.css'
})
export class MessageA {

}
