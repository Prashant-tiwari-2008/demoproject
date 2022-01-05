import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule } from './components/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { HeaderInterceptors } from './interceptors/header-interceptors';
import { ResponseInterceptors } from './interceptors/response-interceptors';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    SharedModule,
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptors, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptors, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
