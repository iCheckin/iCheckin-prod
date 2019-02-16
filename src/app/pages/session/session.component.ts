import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  currentDate = new Date();
  started:boolean = false;
  paused:boolean = false;
  showTable:boolean = false;

  timerMinute = "1";
  timerSecond = "30";

  course = {code: "INF 151", name: "Introduction to Project Mgmt", courseCode: "12345"};
  logs=[
    {name:"Steve", method:"QR", timestamp: 1041241},
    {name:"Benzos", method:"Code", timestamp: 1041241},
    {name:"Jobs", method:"QR", timestamp: 1041241},
    {name:"Hermans", method:"Code", timestamp: 1041241},
    {name:"Thornton", method:"QR", timestamp: 1041241},
    {name:"Klefstad", method:"QR", timestamp: 1041241},
    {name:"Pattis", method:"QR", timestamp: 1041241},
    {name:"Richard", method:"QR", timestamp: 1041241},
    {name:"Raymond", method:"QR", timestamp: 1041241},
    {name:"Alex", method:"QR", timestamp: 1041241},
    {name:"Kay", method:"QR", timestamp: 1041241},
    {name:"David", method:"QR", timestamp: 1041241},
  ]

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onStartSession(){
    this.started = true;
  }

  onCancel(){
    if(this.started) this.started = false;
    else this.router.navigate(['/course']);
  }

  onPause(){
    if(this.started){
      if(this.paused) this.paused = false;
      else this.paused = true;
    }
  }

  onComplete(){

  }

  onToggleTable(){
    this.showTable = !this.showTable;
  }

}
