import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor() { }

  tmpImg:string = "https://previews.123rf.com/images/yupiramos/yupiramos1607/yupiramos160710209/60039275-young-male-cartoon-profile-vector-illustration-graphic-design-.jpg";

  team = [
    {"name": "Liu, Victor", "email": "vliu8@uci.edu", "phone": "+1 510 364 8988", "profile": this.tmpImg},
    {"name": "Huai, Yuqi", "email": "yhuai@uci.edu", "phone": "+1 949 278 6346", "profile": this.tmpImg},
    {"name": "Ison, Dianne", "email": "isond@uci.edu", "phone": "+1 213 440 3352", "profile": this.tmpImg},
    {"name": "Mos, Tyler J.", "email": "tmos@uci.edu", "phone": "+1 562 338 0263", "profile": this.tmpImg},
  ]
  ngOnInit() {
  }

}
