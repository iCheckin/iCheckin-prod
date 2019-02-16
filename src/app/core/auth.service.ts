import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getRole(){
    // return "student";
    return "instructor";
  }

  isInstructor(){
    return this.getRole()=="instructor";
  }
}
