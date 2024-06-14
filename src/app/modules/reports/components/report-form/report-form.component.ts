import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {PacientService} from "../../../../services/pacients/pacients.service";
import { FormBuilder, Validators} from "@angular/forms";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {ProgressBarModule} from "primeng/progressbar";
import {ReportsService} from "../../../../services/reports/reports.service";
import {ReportEvent} from "../../../../../models/interfaces/enums/report/ReportEvent.js";
import {EditReportAction} from "../../../../../models/interfaces/reports/event/EditReportAction";
import {
  GetReportResponse,
  ReportRequest
} from "../../../../../models/interfaces/reports/response/GetAllProductsResponse";
import {CookieService} from "ngx-cookie-service";
import {environments} from "../../../../../environments/environments";
import {ClipboardService} from "ngx-clipboard";
import {AnnotationService} from "../../../../services/annotation/annotation.service";
import {AnnotationResponse} from "../../../../../models/interfaces/annotation/annotationResponse";

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: [],
  providers: [ToastMessage]
})
export class ReportFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  isLoading = false
  loadingMode: ProgressBarModule = 'indeterminate';

  public addReportAction = ReportEvent.ADD_REPORT_EVENT;
  public editReportAction = ReportEvent.EDIT_REPORT_EVENT;
  public reportAction !: { event: EditReportAction }
  integrationUrl = 'https://annotation-pacient-form.vercel.app';
  private readonly USER_AUTH = environments.COOKIES_VALUE.user_auth
  reportId = 0;
  pacientId = 0
  pacientAnnotation !: AnnotationResponse
  public reportForm = this.formBuilder.group({

    medicalHistory: ['', Validators.required],
    currentMedications: ['', Validators.required],
    cardiovascularIssues: [false],
    diabetes: [false],
    familyHistoryCardiovascularIssues: [false],
    familyHistoryDiabetes: [false],
    physicalActivity: ['', Validators.required],
    smoker: [false],
    alcoholConsumption: [0, [Validators.min(0), Validators.max(5)]],
    emergencyContactName: ['', Validators.required],
    emergencyContactPhone: ['', Validators.required],
    observations: ['']
  })
  private token = this.cookie.get(this.USER_AUTH)



  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private pacientService: PacientService,
    private reportService: ReportsService,
    private annotationService: AnnotationService,
    private toastMessage: ToastMessage,
    private cookie: CookieService,
    private clipboardService: ClipboardService,
  ) {
  }

  ngOnInit(): void {
    this.reportAction = this.ref.data;
    if(this.reportAction.event.id  && this.reportAction.event.action == this.addReportAction)
    {
      this.pacientId = this.reportAction.event.id
      this.getPacientAnnotation()
    }

    if(this.reportAction.event.action == this.editReportAction && this.reportAction.event.id)
    {
      this.pacientId = this.reportAction.event.id
      this.getPacientAnnotation()
      this.loadReportData(this.reportAction.event.id)


    }

  }
  getIntegrationLink():void{
    const url = `${this.integrationUrl}/?token=${this.token}&pacientId=${this.pacientId}`;
    this.clipboardService.copyFromContent(url)
    this.toastMessage.InfoMessage('Link para anamnese copiado com sucesso!')
  }
  handleSubmitReportAction(): void {
    if (this.reportAction?.event?.action === this.editReportAction) this.handleSubmitEditReport()
    if (this.reportAction?.event?.action === this.addReportAction) this.handleSubmitAddReport()
  }

  sendIntegrationWhatsApp(): void {
    this.pacientService.getPacientById(this.pacientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pacientData: any) => {
          const url = `${this.integrationUrl}/?token=${this.token}&pacientId=${this.pacientId}`;
          const message = `Olá *${pacientData.username}*, aqui está o link para a anamnese:\n${url}`;
          const encodedMessage = encodeURIComponent(message);
          const whatsappLink = `https://api.whatsapp.com/send?phone=${encodeURIComponent(pacientData.phone)}&text=${encodedMessage}`;
          window.open(whatsappLink, '_blank');
        },
        error: (err) => {
          console.error(err);
          this.toastMessage.ErrorMessage('Erro ao enviar o link via WhatsApp');
        }
      });
  }


  getPacientAnnotation(){
    this.annotationService.getPacientAnnotation(this.pacientId).
    pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(response: AnnotationResponse) =>{
            this.pacientAnnotation = response
          console.log('Aqui a anotattion: ', this.pacientAnnotation)
        }
      })
  }
  handleSubmitEditReport(): void {
    if (this.reportId <= 0) {
      console.error('ID do relatório inválido');
      return;
    }
    const requestUpdateForm = this.reportForm.value as ReportRequest;
    this.reportService.editReport(this.reportId, requestUpdateForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.reportForm.reset();
          this.toastMessage.SuccessMessage('Ficha editada com sucesso!');
        },
        error: (err) => {
          console.error(err);
          this.reportForm.reset();
          this.toastMessage.ErrorMessage('Erro ao editar ficha');
        }
      });
  }

  handleSubmitAddReport(): void {
    var pacientId  = this.reportAction?.event?.id
    if (this.reportForm?.value && this.reportForm?.valid && pacientId) {
      const requestCreateForm = this.reportForm.value as  ReportRequest
      this.reportService.createReport(pacientId, requestCreateForm).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if(response){
              this.reportForm.reset();
              this.toastMessage.SuccessMessage('Ficha criada com sucesso!')
            }
          },
          error:(err) =>{
            console.log(err)
            this.reportForm.reset();
            this.toastMessage.ErrorMessage('Erro ao criar ficha')
          }
        })
      this.reportForm.reset();
    }
  }


  loadReportData(pacientId: number): void {
    this.reportService.getReportByPacientId(pacientId, this.reportForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reportData: GetReportResponse) => {
          this.reportId = reportData.reportId
        },
        error: (error) => {
          console.error('Erro ao  dados da ficha:', error);
        }
      });
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

