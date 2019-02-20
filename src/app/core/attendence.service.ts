import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Course } from '../models/course';
import { map } from 'rxjs/operators';
import { NotifyService } from './notify.service';
import { Session } from '../models/session';
import { Attendance } from '../models/attendance';
import { GeohashService } from './geohash.service';

interface Enrollment{
  eid?: string;
  cid: string;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendenceService {
  sessionCollection: AngularFirestoreCollection<Session>;
  attendanceCollection: AngularFirestoreCollection<Attendance>;
  enrollCollection: AngularFirestoreCollection<Enrollment>;

  constructor(private afs: AngularFirestore, private notify: NotifyService, private geohash: GeohashService) {
    this.attendanceCollection = this.afs.collection('attendance');
    this.enrollCollection = this.afs.collection('enrollment');
    this.sessionCollection = this.afs.collection('session');
  }

  getAttendence(){
    return this.attendanceCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        return a.payload.doc.data();
      })
    }));
  }

  logAttendence(uid: string, cid: string, sid: string, geohash: string){
    var x = this.sessionCollection.doc(sid).snapshotChanges().subscribe( doc => {
      const d = doc.payload.data();
      if(!d){
        this.notify.update('Invalid session id!', 'error');
      }
      else if(d['cid'] != cid){
        this.notify.update('Session id does not mach course id!', 'error');
      } else {
        if(!d['isActive']){
          this.notify.update('Session has already expired!', 'error');

        } else {
          var sessionGeo: string = d['location'];
          if(this.geohash.neighbors(sessionGeo).includes(geohash) || sessionGeo === geohash){
            var tmp = {sid: sid, uid: uid, method: "code", createdAt: new Date()};

            var docRef = this.afs.collection('attendance', ref => ref.where('uid', '==', uid).where('sid','==',sid));
            docRef.get().toPromise().then(doc => {
              if(doc.size == 0){
                this.attendanceCollection.add(tmp);
                this.notify.update("successfully checked in", 'success');
              } else {
                this.notify.update("You already checked in!", "error");
              }
            })

          } else {
            this.notify.update("You seem a bit far from the class!", "error");
          }
        }
      }
      x.unsubscribe();
    });
  }
}
