import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Msg{
  content: string;
  style:string;
}

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  private _msgSource = new Subject<Msg>();

  msg = this._msgSource.asObservable();

  constructor() { }

  update(content: string, style: string) {
    const msg: Msg = { content, style }
    this._msgSource.next(msg)
    setTimeout(() => {
      this.clear();
    },3000);
  }

  clear() {
    this._msgSource.next(null)
  }
}


