import {Component} from '@angular/core';
import {ConfirmationModal} from "../../../services/confirmation/confirmation-service.service";
import {DialogService} from "primeng/dynamicdialog";

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar.scss'],
  providers: [ConfirmationModal,]
})
export class ToolbarNavigationComponent {

  constructor(private confirmationModal: ConfirmationModal, private dialogService: DialogService) {
  }

  navigateAnamneseForm():void{
    this.confirmationModal.confirmNavigatePacientForm('Link para preencher Anamnese')
  }
  logout(): void {
    this.confirmationModal.confirmLogout("Tem certeza que deseja sair?")
  }



}
