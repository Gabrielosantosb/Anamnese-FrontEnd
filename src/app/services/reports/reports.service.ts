import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environments} from "../../../environments/environments";
import {map, Observable, tap} from "rxjs";
import {
  GetAllProductsResponse,
  GetReportResponse, ReportRequest
} from "../../../models/interfaces/reports/response/GetAllProductsResponse";
import {DeleteProductResponse} from "../../../models/interfaces/reports/response/DeleteProductResponse";
import {CreateProductRequest} from "../../../models/interfaces/reports/request/CreateProductRequest";
import {CreateProductResponse} from "../../../models/interfaces/reports/response/CreateProductResponse";
import {EditProductRequest} from "../../../models/interfaces/reports/request/EditProductRequest";
import {SaleProductRequest} from "../../../models/interfaces/reports/request/SaleProductRequest";
import {SaleProductResponse} from "../../../models/interfaces/reports/response/SaleProductResponse";
import {FormGroup} from "@angular/forms";

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


  createReport(pacientId: number, requestData: ReportRequest): Observable<Array<GetReportResponse>> {
    return this.http.post<Array<GetReportResponse>>(
      `${this.API_URL}/api/Report/create-report/${pacientId}`, requestData, this.httpOptions
    );
  }


  getAllReports(): Observable<Array<GetReportResponse>> {
    return this.http.get<Array<GetReportResponse>>(`${this.API_URL}/api/Report/get-reports`, this.httpOptions)
  }

  getReportByPacientId(pacientId: number, reportForm: FormGroup): Observable<GetReportResponse> {
    return this.http.get<GetReportResponse>(`${this.API_URL}/api/Report/get-pacient-report/${pacientId}`, this.httpOptions).pipe(
      tap((reportData: GetReportResponse) =>{
          reportForm.patchValue({
            medicalHistory: reportData.medicalHistory || '',
            currentMedications: reportData.currentMedications || '',
            cardiovascularIssues: reportData.cardiovascularIssues || false,
            diabetes: reportData.diabetes || false,
            familyHistoryCardiovascularIssues: reportData.familyHistoryCardiovascularIssues || false,
            familyHistoryDiabetes: reportData.familyHistoryDiabetes || false,
            physicalActivity: reportData.physicalActivity || '',
            smoker: reportData.smoker || false,
            alcoholConsumption: reportData.alcoholConsumption || 0,
            emergencyContactName: reportData.emergencyContactName || '',
            emergencyContactPhone: reportData.emergencyContactPhone || '',
            observations: reportData.observations || ''
          })
      })
    )
  }

  getReportById(reportId: number, reportForm: FormGroup): Observable<GetReportResponse> {
    return this.http.get<GetReportResponse>(
      `${this.API_URL}/api/Report/get-report/${reportId}`,
      this.httpOptions
    )
  }
  getReportId(pacientId: number): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/api/Report/get-pacient-report/${pacientId}`, this.httpOptions)
  }


  deleteProduct(product_id: string): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(`${this.API_URL}/product/delete`, {
      ...this.httpOptions, params: {
        product_id: product_id
      }
    });
  }

editReport(reportId: number, requestData: ReportRequest): Observable<void>{
    return this.http.put<void>(`${this.API_URL}/api/Report/update-report/${reportId}`, requestData, this.httpOptions)
}



  countReport () : Observable<number>
  {
    return this.http.get<number>(`${this.API_URL}/api/Report/count-report`,
      this.httpOptions)
  }




}
