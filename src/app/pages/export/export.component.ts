import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/models/course';
import { Session } from 'src/app/models/session';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/models/user';
import { EnrollService } from 'src/app/core/enroll.service';
import { CourseService } from 'src/app/core/course.service';
import { SessionService } from 'src/app/core/session.service';
import { AttendenceService } from 'src/app/core/attendence.service';

class CustomData{
  uid: string;
  data: any[];
}

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})

export class ExportComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute,
              private auth: AuthService, private enrollService: EnrollService,
              private courseService: CourseService, private sessionService: SessionService,
              private attendenceService: AttendenceService) { }
  
  user: User;
  course: Course;
  sessions: Session[];
  enrolledStudents: any[];
  attendences: any[];

  exportedData: any[];

  users: any[];

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

      this.auth.getUsers().subscribe(d => {
        this.users = d;
      });

      if(this.user.isInstructor()){
        this.sessionService.getSessionForCourse(courseId).subscribe( session => {
          // session.sort((a,b) => {return b.startedAt.getTime() - a.startedAt.getTime();});
          this.sessions = session;
          this.sessions = this.sessions.filter( a => !a.isActive );
          
          this.enrollService.getEnrolledStudents(courseId).subscribe( enrollments => {
            this.enrolledStudents = enrollments;

            this.attendenceService.getAttendence().subscribe( d => {
              this.attendences = d;
            });
          });
        });
      } else {
        this.router.navigateByUrl('courses');
      };
    });
  }

  onBack(){
    this.router.navigate(["/course", this.course.cid]);
  }

  attended(sid:string, uid:string){
    // return this.sessionService.attended(sid, uid);
    if(!this.attendences) return false;
    for(var i = 0; i < this.attendences.length; ++i){
      if(this.attendences[i].sid === sid && this.attendences[i].uid === uid){
        return true;
      }
    }
    return false;
  }

  getEmail(uid: string){
    if(!this.users) return "";
    for(var i = 0; i < this.users.length; ++i){
      if(this.users[i].uid == uid) return this.users[i].email;
    }
    return "";
  }

  getAttendenceRate(uid:string){
    var count = 0;
    for(var i = 0; i < this.sessions.length; ++i){
      if(this.attended(this.sessions[i].sid, uid)) count++;
    }
    var v:number = count / this.sessions.length * 100;
    if(v == 0 || v == 100){
      return v;
    }
    else return v.toPrecision(4);
  }

}
