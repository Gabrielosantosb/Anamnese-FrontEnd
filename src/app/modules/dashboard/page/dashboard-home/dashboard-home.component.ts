import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ChartData, ChartOptions} from 'chart.js';
import {PacientService} from '../../../../services/pacients/pacients.service';
import {ReportsService} from "../../../../services/reports/reports.service";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {ReferralService} from "../../../../services/referral/referral.service";
import {UserService} from "../../../../services/user/user.service";
import {GetUserInfo} from "../../../../../models/interfaces/user/GetUserInfo";
import {ConfirmationModal} from "../../../../services/confirmation/confirmation-service.service";

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['dashboard-home.scss']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public barChartData!: ChartData;
  public barChartOptions!: ChartOptions;
  public donutChartData !: ChartData;
  public donutChartOptions!: ChartOptions;
  public allPacients!: number;
  public allReports !: number;
  public countSpeciality !: {}
  public userInfo !: GetUserInfo
  public allProfissionalPacients !: number;


  constructor(
    private pacientService: PacientService,
    private reportService: ReportsService,
    private userService: UserService,
    private messageService: MessageService,
    private referralService: ReferralService,
    private confirmationModal: ConfirmationModal
  ) {
  }

  ngOnInit(): void {
    this.getAllPacients();
    this.getProfissionalPacients()
    this.getAllReport()
    this.getSpecialysCount()
    this.getUserInfo()

  }


  private getUserInfo(): void {
    this.userService.getProfissionalInfo().pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (response: any) => {
        if (response) {
          this.userInfo = response;
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
  private getAllPacients(): void {
    this.pacientService
      .countAllPacients()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: number) => {
          this.allPacients = response;
          this.setProductsChartConfig();
        },
        (error: Error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar o total de pacientes',
            life: 2000
          });
        }
      );
  }


  private getProfissionalPacients(): void {
    this.pacientService
      .countProfissionalPacients()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: number) => {
          this.allProfissionalPacients = response;
          this.setProductsChartConfig();
        },
        (error: Error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar o total de pacientes do profissional',
            life: 2000
          });
        }
      );
  }

  private getAllReport(): void {
    this.reportService
      .countReport()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: number) => {
          this.allReports = response;
          this.setProductsChartConfig();
        },
        (error: Error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar o total de fichas',
            life: 2000
          });
        }
      );
  }

  private getSpecialysCount(): void {
    this.referralService.countSpeciality().pipe(takeUntil(this.destroy$)).subscribe(
      (response) => {
        this.countSpeciality = response
        this.setDonutChartConfig()
        console.log('AQUI, ', this.countSpeciality)
      },
      (error) => {
        console.log(error)
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar o total de especialidades',
          life: 2000
        })
      }
    )
  }

  private setProductsChartConfig(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.barChartData = {
      labels: ['Resultados totais'],
      datasets: [
        {
          label: 'Quantidade de pacientes',
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          borderColor: documentStyle.getPropertyValue('--indigo-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
          data: [this.allPacients]
        },
        {
          label: 'Seus pacientes',
          backgroundColor: documentStyle.getPropertyValue('--green-400'),
          borderColor: documentStyle.getPropertyValue('--green-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--green-500'),
          data: [this.allProfissionalPacients]
        },
        {
          label: 'Quantidade de fichas',
          backgroundColor: documentStyle.getPropertyValue('--orange-400'),
          borderColor: documentStyle.getPropertyValue('--orange-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--orange-500'),
          data: [this.allReports]
        },

      ]
    };
    this.barChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {legend: {labels: {color: textColor}}},
      scales: {
        x: this.createAxisConfig(textColorSecondary, surfaceBorder),
        y: this.createAxisConfig(textColorSecondary, surfaceBorder)
      }
    };
  }

  private setDonutChartConfig(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const specialityLabels = Object.keys(this.countSpeciality);
    const specialityValues: number[] = Object.values(this.countSpeciality);

    const colors = [
      '#6610f2', '#28a745', '#fd7e14',
      '#FF5733', '#FFBD33', '#FFC933',
      '#FFD933', '#DFFF33', '#8DFF33',
      '#a7c548', '#7f8d2d', '#4f6240'
    ];


    this.donutChartData = {
      labels: specialityLabels,
      datasets: [
        {
          label: 'Quantidade de encaminhados',
          backgroundColor: colors,
          hoverBackgroundColor: colors,
          data: specialityValues
        },
      ]
    };
    this.donutChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {legend: {labels: {color: textColor}}},
      scales: {
        x: this.createAxisConfig(textColorSecondary, surfaceBorder),
        y: this.createAxisConfig(textColorSecondary, surfaceBorder)
      }
    };
  }

  private generateRandomColor(): string {
    return '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase();
  }
  public desativateAccount(){
    this.confirmationModal.confirmDelete("Tem certeza que deseja desativar sua conta?", ()=>alert('Conta desativada'))
  }

  private createAxisConfig(tickColor: string, gridColor: string) {
    return {ticks: {color: tickColor, font: {weight: 500}}, grid: {color: gridColor}};
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
