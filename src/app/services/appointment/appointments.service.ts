import {Injectable} from '@angular/core';
import {environments} from "../../../environments/environments";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {AppointmentRequest} from "../../../models/interfaces/appointment/appointmentRequest";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
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

  // scheduleAppointment(requestData: AppointmentRequest): Observable<AppointmentRequest>{
  scheduleAppointment(profissionalId: number, pacientId: number,appointmentDate: string, appointmentTime: string ): Observable<AppointmentRequest> {
    const requestData: AppointmentRequest = {
      profissionalId: profissionalId,
      pacientId: pacientId,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime
    };
    console.log('RequestAppointment', requestData)
    return this.http.post<AppointmentRequest>(
      `${this.API_URL}/api/Appointment/schedule-appointment`,
      requestData,
      this.httpOptions
    )
  }
}
