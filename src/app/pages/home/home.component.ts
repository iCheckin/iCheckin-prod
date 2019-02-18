import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../core/auth.service';
import { NotifyService } from 'src/app/core/notify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  val1:boolean = false;
  user: User;
  constructor(private auth: AuthService, private notify: NotifyService) {
  }

  ngOnInit() {
    this.val1 = false;
    this.auth.getUser().subscribe(user => {
      this.user = new User();
      this.user.uid = user.uid;
      this.user.email = user.email;
      this.user.role = user.role;
      this.val1 = true;
    });
  }

  debug(){
    this.notify.update("123", "success");
  }

  dismiss(){
    this.notify.clear();
  }

}
