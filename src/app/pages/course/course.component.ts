import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  course = {code: "INF 151", name: "Introduction to Project Mgmt", courseCode: "12345"};
  sessions = [
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()},
    {sessionId: 1, courseCode:"12345", date:new Date(), attended: 350, sessionStart: new Date(), sessionEnd: new Date()}
  ];
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  onNewSession(){
    this.router.navigate(['/session']);
  }

  onCheckin(){

  }

  isInstructor(){
    if(this.auth.getRole()=="instructor") return true;
    return false;
  }

  isStudent(){
    if(this.auth.getRole()=="student") return true;
    return false;
  }

}
