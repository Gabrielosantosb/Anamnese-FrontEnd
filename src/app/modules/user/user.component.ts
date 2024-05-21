import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {GetUserInfo} from "../../../models/interfaces/user/GetUserInfo";
import {takeUntil} from "rxjs/operators";
import {UserService} from "../../services/user/user.service";
import {Subject} from "rxjs";
import dayGridPlugin from '@fullcalendar/daygrid';
import {CalendarOptions} from "@fullcalendar/core";
import allLocales from "@fullcalendar/core/locales-all";
import {AppointmentService} from "../../services/appointment/appointments.service";
import {AppointmentResponse} from "../../../models/interfaces/appointment/appointmentResponse";


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy{
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    events: [
      { title: 'Meeting', start: new Date() }
    ],
    locales: allLocales,
    locale: 'Pt-Br'
  };
  private destroy$ = new Subject<void>();
  public userInfo !: GetUserInfo
  public appointmentInfo: AppointmentResponse[] = [];
  private profissionalId: number = 0

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
  ) {
  }

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
          this.profissionalId = response.profissionalId
          this.getProfissionalAppointments()
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

  public getProfissionalAppointments(): void {
    const profissionalId = this.profissionalId;
    this.appointmentService.getProfissionalAppointment(profissionalId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: AppointmentResponse[]) => {
          this.appointmentInfo = response;
          console.log('resposta dos appointments', response);
        },
        (error) => {
          console.error('Erro ao obter appointments', error);
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
