import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { NotifyService } from 'src/app/core/notify.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  email: string = "";
  password: string = "";

  constructor(private auth: AuthService, private router: Router, private notify: NotifyService) { }

  ngOnInit() {
  }

  signUp(mode: string){
    if(this.email=="" || this.password==""){
      // alert("No!");
      this.notify.update('Type in something!', 'error');
    } else {
      // console.log(this.auth.emailSignUp(this.email, this.password, mode));
      this.auth.emailSignUp(this.email, this.password, mode).then(b => {
        if(b){
          this.router.navigate(['/courses']);
        } else {
          
        }
      })
    }
  }

}
