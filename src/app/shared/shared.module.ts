import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FeatherIconComponent } from './components/feather-icon/feather-icon.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [BreadcrumbComponent, FeatherIconComponent, HeaderComponent, FooterComponent, SidebarComponent, ContentLayoutComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [FeatherIconComponent]
})
export class SharedModule { }
