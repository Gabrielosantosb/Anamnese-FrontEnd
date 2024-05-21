import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import {SharedModule} from "../../shared/shared.module";
import {FullCalendarModule} from "@fullcalendar/angular";



@NgModule({
  declarations: [
    // UserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FullCalendarModule
  ]
})
export class UserModule { }
