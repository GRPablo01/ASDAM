import { Component } from '@angular/core';
import { HeaderA } from '../../../component/Admin/header-a/header-a';
import { FooterA } from '../../../component/Admin/footer-a/footer-a';
import { ConvoqueA } from '../../../component/Admin/convoque-a/convoque-a';

@Component({
  selector: 'app-convocation-a',
  imports: [HeaderA,FooterA,ConvoqueA],
  templateUrl: './convocation-a.html',
  styleUrl: './convocation-a.css'
})
export class ConvocationA {

}
