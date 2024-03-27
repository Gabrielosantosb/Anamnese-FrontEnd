import {Injectable} from '@angular/core';
import {ConfirmationService} from "primeng/api";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {environments} from "../../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModal {

  constructor(private confirmationService: ConfirmationService, private router: Router, private cookie: CookieService) {
  }
  private readonly USER_AUTH = environments.COOKIES_VALUE.user_auth
  private token = this.cookie.get("USER_INFO")

  confirmLogout(message: string): void {
    this.confirmationService.confirm({
      message: message,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.cookie.delete(this.USER_AUTH)
        void this.router.navigate(["home"])
      }
    })
  }
  confirmNavigatePacientForm(link: string): void {
    this.confirmationService.confirm({
      message: `Link de Cópia:<br/><input type="text" value="${link}" readonly>`,
      acceptLabel: 'Fechar',
      rejectVisible: false,
      header: 'Link de Paciente',
    });
  }
  confirmReportDelete(message: string, onDelete: () => void): void {
    this.confirmationService.confirm({
      message: message,
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Não',
      acceptLabel: 'Sim',
      accept: () => {
        console.log('Deletou');
      }
    });
  }
  confirmDelete(message: string, onDelete: () => void): void {
    this.confirmationService.confirm({
      message: message,
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Não',
      acceptLabel: 'Sim',
      accept: () => {
        this.confirmationService.close();
        onDelete();
      }
    });
  }
}
