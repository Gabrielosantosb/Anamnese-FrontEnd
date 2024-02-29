import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { HomeComponent } from './modules/home/home.component';
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {RippleModule} from "primeng/ripple";
import {CookieService} from "ngx-cookie-service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastMessage} from "./services/toast-message/toast-message";
import {SharedModule} from "./shared/shared.module";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CardModule,
        InputTextModule,
        ButtonModule,
        ToastModule,
        RippleModule,
        FormsModule,
        ConfirmDialogModule,
        SharedModule

    ],
  providers: [CookieService, MessageService,ConfirmationService, ToastMessage],
  bootstrap: [AppComponent]
})
export class AppModule { }
