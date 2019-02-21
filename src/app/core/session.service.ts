import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Course } from '../models/course';
import { map, filter } from 'rxjs/operators';
import { NotifyService } from './notify.service';
import { Session } from '../models/session';
import { Attendance } from '../models/attendance';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  sessionCollection: AngularFirestoreCollection<Session>;

  constructor(private afs: AngularFirestore, private notify: NotifyService) {
    this.sessionCollection = this.afs.collection('session');
  }

  getSessionForCourse(cid: string, uid: string = ""){
    var docRef = this.afs.collection('session', ref => ref.orderBy('createdAt'));
    var docs = docRef.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Session;
        data.sid = a.payload.doc.id;
        this.getAttendanceCountForSession(data.sid).then( c => {
          data.count = c;
        });
        if(uid != ""){
          this.attended(data.sid, uid).then( b => {
            data.attended = b;
          })
        }
        return data;
      }).filter( s => s.cid == cid );
    }))
    return docs;
  }

  getAttendences(sid: string){
    var docRef = this.afs.collection('attendance', ref => ref.orderBy('createdAt'));

    var tmp = docRef.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Attendance;
        var dRef = this.afs.collection('users').doc(data.uid);
        dRef.get().toPromise().then(d => {
          data.email = d.data()['email'];
        })

        return data;
      }).filter(s => s.sid == sid);
    }));
    return tmp;
  }

  getAttendanceCountForSession(sid: string){
    var docRef = this.afs.collection('attendance', ref => ref.where('sid', '==', sid));
    return docRef.get().toPromise().then(doc => {
      return doc.size;
    })
  }

  async attended(sid: string, uid: string){
    var docRef = this.afs.collection('attendance', ref => ref.where('sid', '==', sid).where('uid', '==', uid));
    return docRef.get().toPromise().then(doc => {
      if(doc.empty) return false;
      else return true;
    })
  }

  newSession(s: Session){
    var tmp = {
      cid: s.cid,
      createdAt: s.createdAt,
      startedAt: s.startedAt,
      isActive: s.isActive,
      location: s.location,
      endedAt: s.startedAt,
      keyword: s.keyword
    }
    return this.sessionCollection.add(tmp).then(
      doc => {
        return doc.id;
      }
    );
  }

  updateSession(sid: string, s: Session){
    var tmp = {
      cid: s.cid,
      createdAt: s.createdAt,
      startedAt: s.startedAt,
      isActive: s.isActive,
      location: s.location,
      endedAt: s.endedAt
    }
    var docRef = this.sessionCollection.doc(sid);
    docRef.update(tmp);
  }
}
