import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { contentRoute } from './shared/routes/content-routes';


const routes: Routes = [
  { path: '', component: ContentLayoutComponent, children: contentRoute, canActivate: [AuthGuard] }
 // { path: '', component: ContentLayoutComponent, children: contentRoute }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
