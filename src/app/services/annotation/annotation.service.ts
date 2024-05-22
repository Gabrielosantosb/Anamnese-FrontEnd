import { Injectable } from '@angular/core';
import {environments} from "../../../environments/environments";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs";
import {AnnotationResponse} from "../../../models/interfaces/annotation/annotationResponse";

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {
  private API_URL = environments.API_URL
  private token = this.cookie.get("USER_INFO")
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    })
  }


  constructor(private http: HttpClient, private cookie: CookieService) {
  }

  getPacientAnnotation(pacientId: number):Observable<AnnotationResponse>{
      return this.http.get<AnnotationResponse>(
        `${this.API_URL}/api/Annotation/get-annotation/${pacientId}`,
        this.httpOptions
      )
  }
}
