import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/core/auth.service';
import { CourseService } from 'src/app/core/course.service';
import { EnrollService } from 'src/app/core/enroll.service';
import { SessionService } from 'src/app/core/session.service';
import { Course } from 'src/app/models/course';
import { Session } from 'src/app/models/session';
import { Location } from '@angular/common';
import { NotifyService } from 'src/app/core/notify.service';
import { Observable } from 'rxjs';
import { Attendance } from 'src/app/models/attendance';
import { GeohashService } from 'src/app/core/geohash.service';


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

  sessionKeyword:string;
  timerMinute = "0";
  timerSecond = "30";

  timeRemaining:number;

  user: User;
  enrollmentCount: number;
  session: Session = new Session();

  attended: Attendance[] = [];

  course: Course;

  QrCode: string = null;

  timerInterval;
  position = null;

  constructor(private router: Router, private auth: AuthService,
    private courseService: CourseService, private sessionService: SessionService,
    private enrollService: EnrollService, private route: ActivatedRoute,
    private notify: NotifyService, private geohash: GeohashService) { }

  ngOnInit() {
    this.auth.getUser().subscribe(user => {
      this.user = new User();
      this.user.uid = user.uid;
      this.user.email = user.email;
      this.user.role = user.role;

      var courseId = this.route.snapshot.paramMap.get('id');

      this.courseService.getCourseById(courseId).then( data => {
        this.course = data;
      });
      this.enrollService.getEnrollmentCount(courseId).then(n => {this.enrollmentCount = n;});
    });
    navigator.geolocation.getCurrentPosition(data => this.position = data);
  }


  onStartSession(){
    if(!this.position){
      this.notify.update('Cannot read your location!', 'error');
      return;
    }
    if(this.sessionKeyword == null || this.sessionKeyword === ""){
      this.notify.update("Cannot read keyword", "error");
      return;
    }
    this.started = true;
    this.timeRemaining = (+this.timerMinute) * 60 + (+this.timerSecond);
    
    this.initSession();
    
    this.sessionService.newSession(this.session).then(id => {
      this.session.sid = id;
      this.QrCode = id;
      // this.sessionService.getAttendanceCountForSession(this.session.sid)
      this.sessionService.getAttendences(this.session.sid).subscribe( n => {
        this.attended = n;
      });
    })

    this.timerInterval = setInterval( x => {
      
      if(!this.paused){
        this.timeRemaining = this.timeRemaining - 1;
      }

      if(this.timeRemaining < 0){
        clearInterval(this.timerInterval);
        this.timeRemaining = 0;
        this.notify.update('Completed attendance checking!', 'success');
        setTimeout('', 5000);
        this.updateSessionToDB()
        this.router.navigate(['/course', this.course.cid]);
      }

    }, 1000);
  }

  timeToString(seconds: number){
    if(Math.floor(seconds / 60) > 0) {
      return (Math.floor(seconds / 60)).toString() + "m " + (seconds % 60).toString() + "s";
    }
    return (seconds % 60).toString() + "s";
  }

  initSession(){
    this.session.cid = this.course.cid;
    this.session.isActive = true;
    this.session.createdAt = new Date();
    this.session.startedAt = new Date();
    this.session.endedAt = new Date();
    this.session.location = this.geohash.encode(this.position['coords']['latitude'], this.position['coords']['longitude']);
    this.session.keyword = this.sessionKeyword;

  }

  updateSessionToDB(){
    this.session.endedAt = new Date();
    this.session.isActive = false;
    this.sessionService.updateSession(this.session.sid, this.session);
  }

  onCancel(){
    if(this.started) this.started = false;
    else this.router.navigate(['/course', this.course.cid]);
  }

  onPause(){
    if(this.started){
      if(this.paused) this.paused = false;
      else this.paused = true;
    }
  }

  onComplete(){
    if(this.started){
      this.updateSessionToDB();
      clearInterval(this.timerInterval);
    }
    this.router.navigate(['/course', this.course.cid]);
  }

  onToggleTable(){
    this.showTable = !this.showTable;
  }

}
