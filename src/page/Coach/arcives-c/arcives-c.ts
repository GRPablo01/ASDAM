import { Component } from '@angular/core';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { FooterC } from "../../../component/Coach/footer-c/footer-c";
import { Arch } from '../../../component/Coach/page-archives/arch/arch';

@Component({
  selector: 'app-arcives-c',
  imports: [HeaderC, FooterC,Arch],
  templateUrl: './arcives-c.html',
  styleUrl: './arcives-c.css'
})
export class ArcivesC {

}
