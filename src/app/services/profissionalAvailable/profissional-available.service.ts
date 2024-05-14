import { Injectable } from '@angular/core';
import {environments} from "../../../environments/environments";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs";
import {ProfissionalAvailableResponse} from "../../../models/interfaces/profissional/profissionalAvailableResponse";
import {GetReportResponse, ReportRequest} from "../../../models/interfaces/reports/response/GetAllProductsResponse";
import {GetUserInfo} from "../../../models/interfaces/user/GetUserInfo";

@Injectable({
  providedIn: 'root'
})
export class ProfissionalAvailableService {
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
  getProfissionalAvailable(profissionalId: number): Observable<ProfissionalAvailableResponse[]> {
    return this.http.get<ProfissionalAvailableResponse[]>(
      `${this.API_URL}/api/ProfissionalAvailable/profissional-available/${profissionalId}`
    );
  }
  getProfissionalsBySpeciality(speciality: string): Observable<Array<GetUserInfo>> {
    return this.http.get<Array<GetUserInfo>>(
      `${this.API_URL}/api/ProfissionalAvailable/profissional-by-speciality?speciality=${speciality}`
    );
  }

}
