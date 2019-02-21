import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CourseService } from '../../core/course.service';
import { SessionService } from '../../core/session.service';
import { Session } from '../../models/session';
import { Course } from '../../models/course';
import { EnrollService } from 'src/app/core/enroll.service';
import { User } from '../../models/user';
import { NotifyService } from 'src/app/core/notify.service';
import { AttendenceService } from 'src/app/core/attendence.service';
import { GeohashService } from 'src/app/core/geohash.service';
@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  user: User;

  course: Course;
  enrollmentCount:number;

  sessions: Session[];
  position = null;
  checkInCode: string = "";

  constructor(private router: Router, private auth: AuthService,
              private courseService: CourseService, private sessionService: SessionService,
              private enrollService: EnrollService, private route: ActivatedRoute,
              private notify: NotifyService, private attendanceService: AttendenceService,
              private geohash: GeohashService) {
                navigator.geolocation.getCurrentPosition(data => this.position = data);
              }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(data => this.position = data);

    this.auth.getUser().subscribe(user => {
      this.user = new User();
      this.user.uid = user.uid;
      this.user.email = user.email;
      this.user.role = user.role;
    
      var courseId = this.route.snapshot.paramMap.get('id');
      this.enrollService.getEnrollmentCount(courseId).then(n => {this.enrollmentCount = n;});

      this.courseService.getCourseById(courseId).then( data => {
        this.course = data;
      });

      if(this.user.isInstructor()){
        this.sessionService.getSessionForCourse(courseId).subscribe( session => {
          this.sessions = session;
          this.sessions = this.sessions.filter( a => !a.isActive );
        })
      } else {
        this.sessionService.getSessionForCourse(courseId, this.user.uid).subscribe( session => {
          this.sessions = session;
          this.sessions = this.sessions.filter( a => !a.isActive );
        })
      }
    });
  }

  onNewSession(){
    this.router.navigate(['/session',  this.course.cid]);
  }

  onExport(){
    this.router.navigate(['/export', this.course.cid]);
  }

  onBack(){
    // this.router.navigate(['/courses']);
    this.router.navigateByUrl('courses');
  }

  checkIn(){
    if(this.checkInCode == "") this.notify.update("Please enter a keyword!", "error");
    else{
      this.notify.clear();
      this.attendanceService.logAttendence(this.user.uid, this.course.cid, this.checkInCode,this.geohash.encode(this.position['coords']['latitude'], this.position['coords']['latitude']));
      this.checkInCode = "";
    }
  }
}
