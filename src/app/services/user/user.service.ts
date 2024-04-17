import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environments} from "../../../environments/environments";
import {SignUpUserRequest} from "../../../models/interfaces/user/SignUpUserRequest";
import {Observable} from "rxjs";
import {SignUpUserResponse} from "../../../models/interfaces/user/SignUpUserResponse";
import {AuthRequest} from "../../../models/interfaces/auth/AuthRequest";
import {AuthResponse} from "../../../models/interfaces/auth/AuthResponse";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environments.API_URL
  constructor(private http: HttpClient, private cookieService: CookieService) { }


  getProfissionalId(){

  }
  isLoggedIn():boolean{
    // Se o usuario possui um token ou cookie
    const token = this.cookieService.get('USER_INFO');
    return token ? true : false;
  }
  signupUser (requestData: SignUpUserRequest): Observable<SignUpUserResponse>
  {
    console.log('aqui', requestData)
    return this.http.post<SignUpUserResponse>(
      `${this.API_URL}/api/Profissional/create-profissional`,
      requestData
    )
  }

  authUser(requestData: AuthRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(
      `${this.API_URL}/api/Profissional/login`,
      requestData
    )
  }
}
