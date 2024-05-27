import { CalendarOptions } from '@fullcalendar/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetUserInfo } from "../../../models/interfaces/user/GetUserInfo";
import { takeUntil } from "rxjs/operators";
import { UserService } from "../../services/user/user.service";
import { Subject } from "rxjs";
import dayGridPlugin from '@fullcalendar/daygrid';
import allLocales from "@fullcalendar/core/locales-all";
import { AppointmentService } from "../../services/appointment/appointments.service";
import { AppointmentResponse } from "../../../models/interfaces/appointment/appointmentResponse";
import { ProfissionalAvailableResponse } from "../../../models/interfaces/profissional/profissionalAvailableResponse";
import { ProfissionalAvailableService } from "../../services/profissionalAvailable/profissional-available.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastMessage } from "../../services/toast-message/toast-message";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [],
    locales: allLocales,
    locale: 'pt-br',
    eventClick: this.handleCalendarClick.bind(this)
  };
  private destroy$ = new Subject<void>();
  public userInfo!: GetUserInfo;
  public appointmentInfo: AppointmentResponse[] = [];
  public disponibilidades: ProfissionalAvailableResponse[] = [];
  private profissionalId: number = 0
  public displayModal = false;
  public displayPatientModal = false;
  public selectedPatients: AppointmentResponse[] = [];

  disponibilityForm = this.formBuilder.group({
    dayOfWeek: ["Friday", Validators.required],
    startTime: ["10:00:00", Validators.required],
    endTime: ["18:00:00", Validators.required]
  }, { validators: this.timeDifferenceValidator });

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private profissionalAvailableService: ProfissionalAvailableService,
    private formBuilder: FormBuilder,
    private toastMessage: ToastMessage
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }

  public getUserInfo(): void {
    this.userService.getProfissionalInfo().pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (response: any) => {
        if (response) {
          this.userInfo = response;
          this.profissionalId = response.profissionalId;
          this.getProfissionalAppointments();
          console.log('Aqui a response', this.userInfo);
        } else {
          console.error('Resposta vazia ao obter informações do usuário');
        }
      },
      error => {
        console.error('Erro ao obter informações do usuário:', error);
      }
    );
  }

  getProfissionalDisponibilidades(profissionalId: number) {
    if (profissionalId < 0 || profissionalId == null) {
      return;
    }
    this.profissionalAvailableService.getProfissionalAvailable(profissionalId)
      .subscribe({
        next: (response: ProfissionalAvailableResponse[]) => {
          this.disponibilidades = response;
          console.log("Aqui a disponibilidade", this.disponibilidades);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  public getProfissionalAppointments(): void {
    const profissionalId = this.profissionalId;
    this.appointmentService.getProfissionalAppointment(profissionalId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: AppointmentResponse[]) => {
          this.appointmentInfo = response;
          this.updateCalendarEvents();
          console.log('resposta dos appointments', response);
        },
        (error) => {
          console.error('Erro ao obter appointments', error);
        }
      );
  }

  public sendProfissionalAvailability() {
    console.log(this.disponibilityForm.value);
    const startTime = this.disponibilityForm.value.startTime;
    const endTime = this.disponibilityForm.value.endTime;
    const dayOfWeek = this.disponibilityForm.value.dayOfWeek;
    const startTimeFormatted = new Date(startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const endTimeFormatted = new Date(endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    this.profissionalAvailableService.sendProfissionalAvailable(this.profissionalId, dayOfWeek, startTimeFormatted, endTimeFormatted)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ProfissionalAvailableResponse) => {
          this.toastMessage.SuccessMessage("Disponibilidade criada com sucesso");
          this.disponibilityForm.reset();
          this.displayModal = false;
        },
        error: (err) => {
          console.log(err);
          this.disponibilityForm.reset();
          this.toastMessage.ErrorMessage("Erro ao criar disponibilidade");
        }
      });
  }

  private updateCalendarEvents(): void {
    this.calendarOptions.events = this.appointmentInfo.map(appointment => ({
      title: appointment.pacientName,
      start: appointment.appointmentDateTime,
      id: appointment.appointmentId.toString()
    }));
  }

  timeDifferenceValidator(formGroup: FormGroup): { [key: string]: any } | null {
    const startTime = formGroup.get('startTime')?.value;
    const endTime = formGroup.get('endTime')?.value;

    if (!startTime || !endTime) {
      return null;
    }

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    return diff > 8 ? { maxEightHours: true } : null;
  }

  showModal() {
    this.displayModal = true;
    this.getProfissionalDisponibilidades(this.profissionalId);
  }

  handleCalendarClick(arg: any) {
    const clickedDate = new Date(arg.event.startStr).toDateString();
    this.selectedPatients = this.appointmentInfo
      .filter(app => new Date(app.appointmentDateTime).toDateString() === clickedDate)
      .sort((a, b) => new Date(a.appointmentDateTime).getTime() - new Date(b.appointmentDateTime).getTime());

    if (this.selectedPatients.length > 0) {
      this.displayPatientModal = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
