import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { CourseService } from 'src/app/core/course.service';
import { User } from '../../models/user';
import { Course } from '../../models/course';
import { take, filter } from 'rxjs/operators';
import { NotifyService } from 'src/app/core/notify.service';
import { EnrollService } from 'src/app/core/enroll.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  user: User;
  courses: Course[];


  modal_courseCode: string;
  modal_courseName: string;
  modal_courseId: string;

  modal_newCourseCode: string = "";

  _subscription;

  constructor(private router: Router,
              private auth:AuthService,
              private courseService: CourseService,
              private enrollService: EnrollService,
              private notify: NotifyService) {

  }

  ngOnInit() {
    this.auth.getUser().subscribe(user => {
      this.user = new User();
      this.user.uid = user.uid;
      this.user.email = user.email;
      this.user.role = user.role;

      if(this.user.isInstructor()){
        this._subscription = this.courseService.getCoursesFor(this.user.email).subscribe(
          items => {
            this.courses = items;
          }
        )
      } else {
        this._subscription = this.courseService.getCourses().subscribe(
          items => {
            var tmpCourses = items;
            this.enrollService.getEnrolledCourses(this.user.uid).subscribe(
              items => {
                this.courses = tmpCourses.filter(course => {
                  for(var i = 0; i < items.length; ++i){
                    if(course.cid == items[i].cid) return true;
                  }
                  return false;
                });
              }
            )
          }
        )
      }

    });
  }

  cardOnClick(cid: string){
    this.router.navigate(['/course', cid]);
  }

  logout(){
    this.auth.signOut();
    this.router.navigate(['/']);
    this.notify.update('You have successfully logged out', 'success');
    this._subscription.unsubscribe();
  }

  onNewCourse(){
    if(this.modal_courseCode != "" && this.modal_courseId != "" && this.modal_courseName != ""){
      this.courseService.newCourse(this.modal_courseCode, +this.modal_courseId, this.modal_courseName, this.user.email);
    }
  }

  buttonMode(){
    if(this.user){
      if(this.user.isInstructor()){
        return 0;
      }
      return 1;
    }
    return 2;
  }

  onEnrollNewCourseCancel(){
    this.modal_newCourseCode = "";
  }

  onEnrollNewCourseConfirm(){
    this.enrollService.addEnrollment(this.modal_newCourseCode, this.user.uid);
    this.modal_newCourseCode = "";
  }
}
