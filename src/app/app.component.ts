import { Component } from '@angular/core';
import { NotifyService } from './core/notify.service';
import { GeohashService } from './core/geohash.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'iCheckin-prod';

  constructor(private notify:NotifyService){
  }
  dismiss(){
    this.notify.clear();
  }

}
