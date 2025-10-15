import { Component } from '@angular/core';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { ConvoqueA } from '../../../component/Admin/convoque-a/convoque-a';

@Component({
  selector: 'app-convocation-s',
  imports: [HeaderS,ConvoqueA],
  templateUrl: './convocation-s.html',
  styleUrl: './convocation-s.css'
})
export class ConvocationS {

}
