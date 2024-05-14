import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {GetUserInfo} from "../../../models/interfaces/user/GetUserInfo";
import {takeUntil} from "rxjs/operators";
import {PacientService} from "../../services/pacients/pacients.service";
import {ReportsService} from "../../services/reports/reports.service";
import {UserService} from "../../services/user/user.service";
import {MessageService} from "primeng/api";
import {ReferralService} from "../../services/referral/referral.service";
import {ConfirmationModal} from "../../services/confirmation/confirmation-service.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  public userInfo !: GetUserInfo

  constructor(
    private userService: UserService,
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
