import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResponseInterceptors implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(3),
      map(res => {
        if (res instanceof HttpResponse) {
          console.log(res);
          return res;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errMsg = "";
        console.log(errMsg);
        // client-side error
        if (error.error instanceof ErrorEvent) {
          errMsg = `Error : ${error.message}`;
        } else { // server-side error
          errMsg = `Error Code: ${error.status} , Message : ${error.message}`;
        }
        return throwError(errMsg);
      })
    )
  }
}
