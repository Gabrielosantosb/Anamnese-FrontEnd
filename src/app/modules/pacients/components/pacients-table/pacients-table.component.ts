import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetPacientsResponse } from "../../../../../models/interfaces/pacients/get-pacient-service.service";
import { EditPacientAction } from "../../../../../models/interfaces/pacients/event/editPacient";
import { PacientsEvent } from "../../../../../models/interfaces/enums/pacients/PacientEvent";
import { DeletePacient } from "../../../../../models/interfaces/pacients/event/deletePacient";
import { PacientService } from "../../../../services/pacients/pacients.service";
import { ReportEvent } from "../../../../../models/interfaces/enums/report/ReportEvent.js";
import { EditReportAction } from "../../../../../models/interfaces/reports/event/EditReportAction";
import { MedicalSpecialty } from "../../../../../models/interfaces/enums/medicalSpeciality/medicalSpeciality";
import { ToastMessage } from "../../../../services/toast-message/toast-message";
import { ReferralService } from "../../../../services/referral/referral.service";
import { style } from "@angular/animations";
import { ProfissionalAvailableService } from "../../../../services/profissionalAvailable/profissional-available.service";
import { GetUserInfo } from "../../../../../models/interfaces/user/GetUserInfo";

@Component({
  selector: 'app-pacients-table',
  templateUrl: './pacients-table.component.html',
  styleUrls: ['./pacients-table.component.scss']
})
export class PacientsTableComponent implements OnInit {
  @Input() public pacients: Array<GetPacientsResponse> = [];
  @Output() public pacientEvent = new EventEmitter<EditPacientAction>();
  @Output() public deletePacientEvent = new EventEmitter<DeletePacient>();
  @Output() public reportEvent = new EventEmitter<EditReportAction>();
  public medicalSpecialtys = Object.values(MedicalSpecialty);
  public selectProfissional: GetUserInfo[] = [];
  public showAppointmentForm: boolean = false;
  public pacientSelected!: GetPacientsResponse;
  public addPacientAction = PacientsEvent.ADD_PACIENT_ACTION;
  public editPacientAction = PacientsEvent.EDIT_PACIENT_ACTION;
  public addReportAction = ReportEvent.ADD_REPORT_EVENT;
  public editReportAction = ReportEvent.EDIT_REPORT_EVENT;
  selectedProfissional: any;
  displayModal: boolean = false;
  showProfissionalPacients = false;
  showOtherField: boolean = false;
  pacientId: number = 0;

  constructor(private pacientService: PacientService,
              private toastMessage: ToastMessage,
              private referralService: ReferralService,
              private profissionalAvailableService: ProfissionalAvailableService) {
  }

  ngOnInit(): void {
    console.log("AQUI OS PACIENTES:", this.pacients);
  }

  getProfissionalBySpeciality(speciality: string) {
    this.profissionalAvailableService.getProfissionalsBySpeciality(speciality).subscribe({
      next: (response) => {
        console.log('Response profissionalAvailableService', response);
        this.selectProfissional = response;
        this.showAppointmentForm = true
      },
      error: (err) => {
        console.log("Erro ao buscar profissional com a especialidade");
        this.toastMessage.InfoMessage(`Não existe nenhum profissional com a especialidade ${speciality}`);
        this.showAppointmentForm = false
      }
    });
  }

  sendMedicalSpeciality() {
    this.referralService.sendMedicalSpeciality(this.pacientId, this.selectedProfissional).subscribe({
      next: (response) => {
        console.log("aqui a response", response);
        this.handleShowAllPacients();
        this.toastMessage.SuccessMessage(`Paciente encaminhado para ${this.selectedProfissional}`);
        this.hideModal();
      },
      error: (err) => {
        console.error('Erro ao obter os pacientes do usuário:', err);
        this.toastMessage.ErrorMessage("Erro ao encaminhar paciente");
      }
    });
    this.handleShowAllPacients();
  }

  showModal(pacientId: number) {
    this.displayModal = true;
    this.pacientId = pacientId;

  }

  hideModal() {
    this.displayModal = false;
  }

  handleDeletePacientEvent(pacient_id: number, pacientName: string): void {
    if (pacient_id !== null && pacientName !== '') {
      this.deletePacientEvent.emit({ pacient_id, pacientName });
    }
  }

  handleReportEvent(action: string, id?: number, pacientName?: string): void {
    if (action && action !== '') {
      this.reportEvent.emit({ action, id, pacientName });

    }
  }

  handlePacientEvent(action: string, id?: number, pacientName?: string): void {
    if (action && action !== '') this.pacientEvent.emit({ action, id, pacientName });
  }

  handleShowAllPacients(): void {
    this.pacientService.getAllPacients().subscribe({
      next: (allPacientsData) => {
        console.log(allPacientsData);
        this.showProfissionalPacients = false;
        this.pacients = allPacientsData;
      },
      error: (error) => {
        console.error('Erro ao obter os pacientes do usuário:', error);
      }
    });
  }

  handleProfissionalPacients(): void {
    console.log('bateu no profissionalPacients');

    this.pacientService.getProfissionalPacients().subscribe({
      next: (profissionalPacientsData) => {
        this.pacients = profissionalPacientsData;
      },
      error: (error) => {
        console.error('Erro ao obter os pacientes do usuário:', error);
      }
    });
  }

  onDropdownChange(event: any) {
    const selectedSpeciality = event.value;
    this.showOtherField = selectedSpeciality === 'Outra';

    // Chamar a função para obter os profissionais com base na especialidade selecionada
    this.getProfissionalBySpeciality(selectedSpeciality);
  }

  protected readonly style = style;
}
