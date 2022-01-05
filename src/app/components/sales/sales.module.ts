import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { TranscationsComponent } from './transcations/transcations.component';


@NgModule({
  declarations: [OrdersComponent, TranscationsComponent],
  imports: [
    CommonModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }
