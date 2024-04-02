import { NgModule } from '@angular/core';



import { NzResultModule } from 'ng-zorro-antd/result';
import { SharedModule } from '../../shared/shared.module';
import {NotfoundComponent} from "./notfound.component";
import {NotFoundRoutingModule} from "./not-found-routing.module";


@NgModule({
  declarations: [NotfoundComponent],
  imports: [
    NotFoundRoutingModule,
    SharedModule,
    NzResultModule
  ]
})
export class NotFoundModule { }
