import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environments} from "../../../environments/environments";
import {Observable} from "rxjs";
import {GetPacientsResponse} from "../../../models/interfaces/pacients/get-pacient-service.service";

@Injectable({
  providedIn: 'root'
})
export class PacientService {
  private API_URL = environments.API_URL;
  private readonly USER_AUTH = environments.COOKIES_VALUE.user_auth
  private token = this.cookie.get(this.USER_AUTH)
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    })
  }

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getAllCategories(): Observable<Array<GetPacientsResponse>> {
    return this.http.get<Array<GetPacientsResponse>>(
      `${this.API_URL}/categories`,
      this.httpOptions
    )
  }
  getAllPacients(): Observable<Array<GetPacientsResponse>> {
    return this.http.get<Array<GetPacientsResponse>>(
      `${this.API_URL}/api/Pacient/get-pacients`,
      this.httpOptions
    )
  }

  createPacient(requestData: {
    username: string;
    email: string;
    address: string;
    uf: string;
    phone: string;
    birth: string;
    profession: string;
    gender: string;}): Observable<Array<GetPacientsResponse>> {
      console.log('Request:', requestData)
    return this.http.post<Array<GetPacientsResponse>>(
      `${this.API_URL}/api/Pacient/create-pacient`,
      requestData,
      this.httpOptions
    );
  }

  editCategory(requestData: { category_id: string, name: string }): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/category/edit`,
      { name: requestData.name },
      { ...this.httpOptions, params: { category_id: requestData.category_id } }
    );
  }


  deletePacient(requestData: { pacient_id: number }): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/api/Pacient/remove-pacient/${requestData.pacient_id}`,
      this.httpOptions
    );
  }
}
