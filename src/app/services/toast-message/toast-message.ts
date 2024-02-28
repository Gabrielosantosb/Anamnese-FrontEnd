import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastMessage {
  constructor(private messageService: MessageService) {}

  SuccessMessage(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail,
      life: 2000,
    });
  }

  ErrorMessage(detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail,
      life: 2000,
    });
  }
}
