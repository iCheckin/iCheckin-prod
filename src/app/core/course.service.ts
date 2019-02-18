import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Course } from '../models/course';
import { map } from 'rxjs/operators';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  coursesCollection: AngularFirestoreCollection<Course>;
  courses: Observable<Course[]>;

  constructor(private afs: AngularFirestore,
              private notify: NotifyService) {
    this.coursesCollection = this.afs.collection('courses');
    this.courses = this.coursesCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Course;
        data.cid = a.payload.doc.id;
        return data;
      })
    }));
  }

  getCourses(){
    // return this.courses;
    return this.coursesCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Course;
        data.cid = a.payload.doc.id;
        return data;
      })
    }))
  }

  getCoursesFor(instructorEmail: string){
    var cC = this.afs.collection('courses', ref => ref.where("instructorEmail", "==", instructorEmail))
    var c = cC.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Course;
        data.cid = a.payload.doc.id;
        return data;
      })
    }))
    return c;
  }

  getCourseById(cid: string){
    var docRef = this.afs.collection('courses').doc(cid);
    return docRef.get().toPromise().then(doc => {
      if(doc.exists){
        const data = doc.data() as Course;
        data.cid = doc.id;
        return data;
      } else {
        this.notify.update('Incorrect course id', 'error');
      }
      return new Course();
    }).catch(error => {
      this.notify.update(error, 'error');
      return new Course();
    });
  }

  newCourse(code:string, id:number, name:string, email:string){
    var tmp = {
    courseCode : code,
    courseId : id,
    courseName : name,
    createdAt : new Date(),
    instructorEmail : email,
    isActive : true}

    this.coursesCollection.add(tmp);
  }
}
