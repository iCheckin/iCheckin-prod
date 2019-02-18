import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Course } from '../models/course';
import { map } from 'rxjs/operators';
import { NotifyService } from './notify.service';


interface Enrollment{
  eid?: string;
  cid: string;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollService {

  enrollCollection: AngularFirestoreCollection<Enrollment>;
  courses: Observable<Course[]>;
  enrollments: Observable<Enrollment[]>;

  constructor(private afs: AngularFirestore, private notify: NotifyService) {
    this.enrollCollection = this.afs.collection('enrollment');
  }

  getEnrolledCourses(uid: string){
    var eC = this.afs.collection('enrollment', ref => ref.where("uid", "==", uid));
    this.enrollments = eC.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Enrollment;
        data.eid = a.payload.doc.id;
        return data;
      })
    }));
    return this.enrollments;
  }

  getEnrollmentCount(cid: string){
    var docRef = this.afs.collection('enrollment', ref => ref.where('cid', '==', cid))
    return docRef.get().toPromise().then(doc => {
      return doc.size;
    })
  }

  addEnrollment(cid: string, uid: string){
    var docRef = this.afs.collection('courses').doc(cid);
    docRef.get().toPromise().then(doc => {
      if (doc.exists) {
          var docRef2 = this.afs.collection('enrollment', ref => ref.where('cid', '==', cid).where('uid', '==', uid));
          docRef2.get().toPromise().then(doc => {
            if(doc.empty){
              // did not enroll already
              var tmp = {cid: cid, uid: uid}
              this.enrollCollection.add(tmp).then(result => {
                this.notify.update("Successfully added the course!", 'success');
              }).catch(error => {
                this.notify.update("Something went wrong!", "error");
              })
            } else {
              // enrolled already
              this.notify.update("You have already enrolled!", 'error');
            }
          })
      } else {
          this.notify.update("Invalid Course Code!", "error")
      }
  }).catch(function(error) {
      this.notify.update('Something went wrong, try again', 'error');
  });


  }
}
