import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { NotifyService } from 'src/app/core/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usrEmail: string = "";
  usrPassword: string = "";
  constructor(private auth: AuthService, private router: Router, private notify: NotifyService) { }

  ngOnInit() {
  }

  login(){
    this.auth.emailSignIn(this.usrEmail, this.usrPassword);
    this.router.navigate(['/courses']);
    this.notify.clear();
  }
}
