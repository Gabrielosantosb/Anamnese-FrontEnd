import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environments} from "../../../environments/environments";
import {Observable} from "rxjs";
import {GetCategoriesResponse} from "../../../models/interfaces/categories/get-categories-service.service";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
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

  getAllCategories(): Observable<Array<GetCategoriesResponse>> {
    return this.http.get<Array<GetCategoriesResponse>>(
      `${this.API_URL}/categories`,
      this.httpOptions
    )
  }

  createCategory(requestData: { name: string }): Observable<Array<GetCategoriesResponse>> {
    return this.http.post<Array<GetCategoriesResponse>>(
      `${this.API_URL}/category`,
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


  deleteCategory(requestData: { category_id: string }): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/category/delete`,
      {...this.httpOptions, params: {category_id: requestData.category_id}}
    );
  }

}
