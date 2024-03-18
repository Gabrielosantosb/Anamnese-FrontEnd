import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, take, takeUntil} from "rxjs";
import {PacientService} from "../../../../services/pacients/pacients.service";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {GetPacientsResponse} from "../../../../../models/interfaces/pacients/get-pacient-service.service";

import {DynamicDialogConfig} from "primeng/dynamicdialog";

import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {SaleProductRequest} from "../../../../../models/interfaces/reports/request/SaleProductRequest";
import {ProgressBarModule} from "primeng/progressbar";
import {PacientsEvent} from "../../../../../models/interfaces/enums/pacients/PacientEvent";
import {UF} from "../../../../../models/interfaces/enums/UF/uf";
import {EditPacientAction} from "../../../../../models/interfaces/pacients/event/editPacient";
import {ConfirmationModal} from "../../../../services/confirmation/confirmation-service.service";
import {ReportsService} from "../../../../services/reports/reports.service";

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

  public addPacientAction = PacientsEvent.ADD_PACIENT_ACTION;
  public editPacientAction = PacientsEvent.EDIT_PACIENT_ACTION;
  public estados = Object.values(UF)
  public gender: string[] = ["Masculino", "Feminino", "Outro"];
  public pacientAction!: { event: EditPacientAction };
  public pacientForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    address: ['', Validators.required],
    uf: ['', Validators.required],
    phone: ['', Validators.required],
    birth: ['', [Validators.required, this.dateValidator]],

    gender: ['', Validators.required],
    profession: ['', Validators.required],
  });
  public reportForm = this.formBuilder.group({
    medicalHistory: ['', Validators.required],
    currentMedications: ['', Validators.required],
    cardiovascularIssues: [false],
    diabetes: [false],
    familyHistoryCardiovascularIssues: [false],
    familyHistoryDiabetes: [false],
    physicalActivity: ['', Validators.required],
    smoker: [false],
    alcoholConsumption: [0, Validators.min(0)],
    emergencyContactName: ['', Validators.required],
    emergencyContactPhone: ['', Validators.required],
    observations: ['']
  })


  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private pacientService: PacientService,
    private reportService: ReportsService,
    private confirmationModal: ConfirmationModal,
    private toastMessage: ToastMessage
  ) {}

  ngOnInit(): void {
    this.pacientAction = this.ref.data;

    if (
      this.pacientAction?.event?.action === this.editPacientAction &&
      this.pacientAction?.event?.pacientName !== null &&
      this.pacientAction?.event?.pacientName !== undefined &&
      this.pacientAction?.event?.id !== undefined
    ) {
      this.loadPacientData(this.pacientAction.event.id);
    }
  }

  dateValidator(control :AbstractControl) {
    const dateString = control.value;
    if (dateString) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Formato yyyy-mm-dd
      if (!dateRegex.test(dateString)) {
        return { invalidFormat: true };
      }
    }
    return null;
  }

  loadPacientData(pacientId: number): void {
    this.pacientService.getPacientById(pacientId, this.reportForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pacientData: GetPacientsResponse) => {
          console.log('Dados do paciente carregados:', pacientData);
        },
        error: (error) => {
          console.error('Erro ao carregar dados do paciente:', error);
        }
      });
  }

  handleSubmitPacientAction(): void {
    if (this.pacientAction?.event?.action === this.editPacientAction) this.handleSubmitEditPacient();
    return;
  }



  handleSubmitEditPacient(): void {
    if (
      this.pacientForm?.value &&
      this.pacientForm?.valid &&
      this.pacientAction?.event?.id
    ) {
      const requestEditPacient: {
        reportId: number,
        medicalHistory: string,
        currentMedications: string,
        cardiovascularIssues: boolean,
        diabetes: boolean,
        familyHistoryCardiovascularIssues: boolean,
        familyHistoryDiabetes: boolean,
        physicalActivity: string,
        smoker: boolean,
        alcoholConsumption: number,
        emergencyContactName: string,
        emergencyContactPhone: string,
        observations: string
      } =
        {
          reportId: this.pacientAction.event.id,
          medicalHistory: this.reportForm.get('medicalHistory')?.value as string,
          currentMedications: this.reportForm.get('currentMedications')?.value as string,
          cardiovascularIssues: this.reportForm.get('cardiovascularIssues')?.value as boolean,
          diabetes: this.reportForm.get('diabetes')?.value as boolean,
          familyHistoryCardiovascularIssues: this.reportForm.get('familyHistoryCardiovascularIssues')?.value as boolean,
          familyHistoryDiabetes: this.reportForm.get('familyHistoryDiabetes')?.value as boolean,
          physicalActivity: this.reportForm.get('physicalActivity')?.value as string,
          smoker: this.reportForm.get('smoker')?.value as boolean,
          alcoholConsumption: this.reportForm.get('alcoholConsumption')?.value as number,
          emergencyContactName: this.reportForm.get('emergencyContactName')?.value as string,
          emergencyContactPhone: this.reportForm.get('emergencyContactPhone')?.value as string,
          observations: this.reportForm.get('observations')?.value as string
      };
      console.log(requestEditPacient)
      this.reportService
        .editReport( this.pacientAction.event.id, requestEditPacient)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.pacientForm.reset();
            this.toastMessage.SuccessMessage('Paciente editada com sucesso!')
          },
          error: (err: any) => {
            console.log(err);
            this.pacientForm.reset();
            this.toastMessage.ErrorMessage('Erro ao editar Paciente!')
          },
        });
    }
  }

  setPacientName(pacientName: string): void {
    if (pacientName) {
      const formValues = {
        name: this.pacientForm.value.name || '',
        email: this.pacientForm.value.email || '',
        address: this.pacientForm.value.address || '',
        uf: this.pacientForm.value.uf || '',
        phone: this.pacientForm.value.phone|| '',
        birth: this.pacientForm.value.birth || '',
        gender: this.pacientForm.value.gender|| '',
        profession: this.pacientForm.value.profession|| '',
      };
      console.log(formValues)
      this.pacientForm.setValue(formValues);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

