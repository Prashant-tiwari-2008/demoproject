import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<any>(null); //token user
  private loggedIn = new BehaviorSubject<boolean>(false);
  private message: string;

  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }


  constructor(private router: Router) {
    this.message = "";
  }


  login(objUserDetails: any) {
    if (objUserDetails.id == 0) {
      localStorage.removeItem("userDetails");
      this.loggedIn.next(false);
      this.message = "Please enter valid username and password !!";
    } else {
      this.currentUserSubject.next(objUserDetails);
      this.message = "";
      localStorage.setItem("userDetails", JSON.stringify(objUserDetails));
      this.loggedIn.next(true);
      this.router.navigate(['/dashboard/default']);
    }
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false);
    this.router.navigate(['/auth/login']);
  }

  getMessaage(): string {
    return this.message;
  }

}
