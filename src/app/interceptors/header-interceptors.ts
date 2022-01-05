import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../components/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptors implements HttpInterceptor {

  constructor(private _authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request: any;
    let currentUser: any;
    let isLoggedIn: boolean;

    this._authService.isLoggedIn.subscribe(res => {
      isLoggedIn = res;
    });

    if (isLoggedIn) {
      this._authService.currentUser.subscribe(res => {
        currentUser = res;

        if (req.headers.has('isImage')) {
          request = req.clone({ headers: req.headers.delete('isImage') });
          request = req.clone({
            setHeaders: {
              'Authorization': `Bearer ${currentUser.token}`
            }
          });
        } else {
          request = req.clone({
            setHeaders: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentUser.token}`,
            }
          });
        }
      });
    } else {
      request = req.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request);

  }
}
