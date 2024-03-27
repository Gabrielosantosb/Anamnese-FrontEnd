import {Component} from '@angular/core';
import {ConfirmationModal} from "../../../services/confirmation/confirmation-service.service";
import {DialogService} from "primeng/dynamicdialog";
import {ClipboardService} from "ngx-clipboard";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar.scss'],
  providers: [ConfirmationModal,]
})
export class ToolbarNavigationComponent {

  constructor(private confirmationModal: ConfirmationModal,
              private dialogService: DialogService,
              private clipboardService: ClipboardService,

              private messageService: NzMessageService) {
  }

  getIntegrationLink():void{
    const url = 'teste123'
    this.clipboardService.copyFromContent(url)
    this.messageService.info('Link para anamnese copiado com sucesso!')
  }
  navigateAnamneseForm():void{
    this.confirmationModal.confirmNavigatePacientForm('Link para preencher Anamnese')
  }
  logout(): void {
    this.confirmationModal.confirmLogout("Tem certeza que deseja sair?")
  }



}
