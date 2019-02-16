import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses = [
    {code: "INF 151", name: "Introduction to Project Mgmt", courseCode: "12345"},
    {code: "INF 151", name: "Introduction to Project Mgmt", courseCode: "12345"},
    {code: "INF 151", name: "Introduction to Project Mgmt", courseCode: "12345"},
    {code: "INF 151", name: "Introduction to Project Mgmt", courseCode: "12345"},
    {code: "INF 151", name: "Introduction to Project Mgmt", courseCode: "12345"}
  ]
  constructor(private router: Router, private auth:AuthService) { }

  ngOnInit() {
  }

  cardOnClick(){
    this.router.navigate(['/course']);
  }

  logout(){
    this.router.navigate(['/']);
  }

  isInstructor(){
    return this.auth.isInstructor();
  }

}
