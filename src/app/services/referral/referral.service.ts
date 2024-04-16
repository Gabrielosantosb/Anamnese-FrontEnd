import { Injectable } from '@angular/core';
import {environments} from "../../../environments/environments";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs";
import {SendMedicalSpecialityRequest} from "../../../models/interfaces/pacients/get-pacient-service.service";

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private API_URL = environments.API_URL
  private token = this.cookie.get("USER_INFO")
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    })
  }

  constructor(private http: HttpClient, private cookie: CookieService) {}

  sendMedicalSpeciality(pacientId: number, medicalSpeciality: string): Observable<SendMedicalSpecialityRequest> {
    const body = { medicalSpeciality };
    return this.http.post<SendMedicalSpecialityRequest>(
      `${this.API_URL}/api/Referral/send-referral/${pacientId}`,
      body,
      this.httpOptions
    );
  }

  countSpeciality(){
    return this.http.get(`${this.API_URL}/api/Referral/count-referrals-by-specialty`)
  }
}
