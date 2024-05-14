import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GetPacientsResponse} from "../../../../../models/interfaces/pacients/get-pacient-service.service";
import {EditPacientAction} from "../../../../../models/interfaces/pacients/event/editPacient";
import {PacientsEvent} from "../../../../../models/interfaces/enums/pacients/PacientEvent";
import {DeletePacient} from "../../../../../models/interfaces/pacients/event/deletePacient";
import {PacientService} from "../../../../services/pacients/pacients.service";
import {ReportEvent} from "../../../../../models/interfaces/enums/report/ReportEvent.js";
import {EditReportAction} from "../../../../../models/interfaces/reports/event/EditReportAction";
import {MedicalSpecialty} from "../../../../../models/interfaces/enums/medicalSpeciality/medicalSpeciality";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {ReferralService} from "../../../../services/referral/referral.service";
import {style} from "@angular/animations";
import {ProfissionalAvailableService} from "../../../../services/profissionalAvailable/profissional-available.service";
import {GetUserInfo} from "../../../../../models/interfaces/user/GetUserInfo";
import {AppointmentService} from "../../../../services/appointment/appointments.service";
import {FormBuilder, Validators} from "@angular/forms";

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
  public showAppointmentForm: boolean = false;
  public pacientSelected!: GetPacientsResponse;
  public addPacientAction = PacientsEvent.ADD_PACIENT_ACTION;
  public editPacientAction = PacientsEvent.EDIT_PACIENT_ACTION;
  public addReportAction = ReportEvent.ADD_REPORT_EVENT;
  public editReportAction = ReportEvent.EDIT_REPORT_EVENT;
  public specialityProfissional: GetUserInfo[] = [];
  selectedProfissional?: GetUserInfo;
  selectedProfissionalId: number = 0;

  displayModal: boolean = false;
  showProfissionalPacients = false;
  showOtherField: boolean = false;
  pacientId: number = 0;

  constructor(private pacientService: PacientService,
              private toastMessage: ToastMessage,
              private profissionalAvailableService: ProfissionalAvailableService,
              private appointmentService: AppointmentService,
              private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    console.log("AQUI OS PACIENTES:", this.pacients);
  }

  public usernamesArray: string[] = [];

  getProfissionalBySpeciality(speciality: string) {
    this.profissionalAvailableService.getProfissionalsBySpeciality(speciality).subscribe({
      next: (response) => {
        console.log('Response profissionalAvailableService', response);
        this.specialityProfissional = response;
        // Atualiza o array de nomes de usuário
        this.usernamesArray = this.specialityProfissional.map(profissional => profissional.username);

        this.showAppointmentForm = true;
      },
      error: (err) => {
        console.log("Erro ao buscar profissional com a especialidade");
        this.toastMessage.InfoMessage(`Não existe nenhum profissional com a especialidade ${speciality}`);
        this.showAppointmentForm = false;
      }
    });
  }

  appointmentForm = this.formBuilder.group({
    data: ["", [Validators.required]],
    hora: ["", Validators.required]
  });

  sendScheduleAppointment() {
    if (this.selectedProfissionalId < 1) {
      this.toastMessage.ErrorMessage("Selecione um profissional.");
      return;
    }
    const profissionalId = this.selectedProfissionalId;
    this.appointmentService.scheduleAppointment(
      profissionalId,
      this.pacientId,
      "2024-05-10",
      "17:00:00"
    ).subscribe({
      next: (response) => {
        console.log("Response Appointment", response)
        this.toastMessage.SuccessMessage("Paciente encaminhado com sucesso!")
      },
      error: (err) => {
        this.toastMessage.ErrorMessage("Falha ao encaminhar com sucesso!")
      }
    });
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
      this.deletePacientEvent.emit({pacient_id, pacientName});
    }
  }

  handleReportEvent(action: string, id?: number, pacientName?: string): void {
    if (action && action !== '') {
      this.reportEvent.emit({action, id, pacientName});
    }
  }

  handlePacientEvent(action: string, id?: number, pacientName?: string): void {
    if (action && action !== '') this.pacientEvent.emit({action, id, pacientName});
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

  getProfissionalDisponibilidades(profissionalId: number) {
    if (profissionalId < 0 || profissionalId == null) {
      return
    }
    this.profissionalAvailableService.getProfissionalAvailable(profissionalId)
      .subscribe({
        next: (response) =>{
          console.log("Aqui a disponibilidade", response)
        },
        error: (error) =>{
          console.log(error)
        }
      })
  }

  onSpecialityDropdownChange(event: any) {
    const selectedSpeciality = event.value;
    // Chamar a função para obter os profissionais com base na especialidade selecionada
    this.getProfissionalBySpeciality(selectedSpeciality);
  }

  onProfissionalDropdownChange(event: any) {
    console.log('O evento chegando aqui', event)
    if (event && event.value) {
      //   this.selectedProfissional = event.value.profissionalId;
      this.selectedProfissionalId = event.value.profissionalId;
      this.getProfissionalDisponibilidades(this.selectedProfissionalId)
      console.log(this.selectedProfissionalId)
    }
  }

}
