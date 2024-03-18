import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environments} from "../../../environments/environments";
import {map, Observable} from "rxjs";
import {
  GetAllProductsResponse,
  GetAllReportsResponse
} from "../../../models/interfaces/reports/response/GetAllProductsResponse";
import {DeleteProductResponse} from "../../../models/interfaces/reports/response/DeleteProductResponse";
import {CreateProductRequest} from "../../../models/interfaces/reports/request/CreateProductRequest";
import {CreateProductResponse} from "../../../models/interfaces/reports/response/CreateProductResponse";
import {EditProductRequest} from "../../../models/interfaces/reports/request/EditProductRequest";
import {SaleProductRequest} from "../../../models/interfaces/reports/request/SaleProductRequest";
import {SaleProductResponse} from "../../../models/interfaces/reports/response/SaleProductResponse";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
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


  getAllProducts(): Observable<Array<GetAllProductsResponse>> {
    return this.http.get<Array<GetAllProductsResponse>>(`${this.API_URL}/products`, this.httpOptions).pipe(
      map((product) => product.filter
      ((data) => data?.amount > 0))
    )
  }

  getAllReports(): Observable<Array<GetAllReportsResponse>> {
    return this.http.get<Array<GetAllReportsResponse>>(`${this.API_URL}/api/Report/get-reports`, this.httpOptions)
  }

  getReportById(reportId : number): Observable<Array<GetAllReportsResponse>> {
    return this.http.get<Array<GetAllReportsResponse>>(`${this.API_URL}/api/Report/get-reports/${reportId}`, this.httpOptions)
  }

  deleteProduct(product_id: string): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(`${this.API_URL}/product/delete`, {
      ...this.httpOptions, params: {
        product_id: product_id
      }
    });
  }

editReport(reportId: number, requestData: any): Observable<void>{
    return this.http.put<void>(`${this.API_URL}/api/Report/update-report/${reportId}`, this.httpOptions)
}

  editProduct(requestData: EditProductRequest): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/product/edit`, requestData,
      this.httpOptions)

  }

  countReport () : Observable<number>
  {
    return this.http.get<number>(`${this.API_URL}/api/Report/count-report`,
      this.httpOptions)
  }

  saleProduct(requestData: SaleProductRequest): Observable<SaleProductResponse> {
    return this.http.put<SaleProductResponse>(`${this.API_URL}/product/sale`, {amount: requestData?.amount}, {
        ...this.httpOptions,
          params: {
          product_id: requestData?.product_id
        }
      }
    )
  }

}
