import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GetPacientsResponse} from "../../../../../models/interfaces/pacients/get-pacient-service.service";
import {EditPacientAction} from "../../../../../models/interfaces/pacients/event/editPacient";
import {PacientsEvent} from "../../../../../models/interfaces/enums/pacients/PacientEvent";
import {DeletePacient} from "../../../../../models/interfaces/pacients/event/deletePacient";
import {PacientService} from "../../../../services/pacients/pacients.service";

@Component({
  selector: 'app-pacients-table',
  templateUrl: './pacients-table.component.html',
  styleUrls: ['./pacients-table.component.scss']
})
export class PacientsTableComponent {
  @Input() public pacients: Array<GetPacientsResponse> = [];
  @Output() public pacientEvent = new EventEmitter<EditPacientAction>();
  @Output() public deletePacientEvent = new EventEmitter<DeletePacient>();

  public pacientSelected!: GetPacientsResponse;
  public addPacientAction = PacientsEvent.ADD_PACIENT_ACTION;
  public editPacientAction = PacientsEvent.EDIT_PACIENT_ACTION;
  showProfissionalPacients = false

  constructor(private pacientService: PacientService) {
  }

  handleDeletePacientEvent(pacient_id: number, pacientName: string): void {
    if (pacient_id !== null && pacientName !== '') {
      this.deletePacientEvent.emit({pacient_id, pacientName});
    }
  }

  handlePacientEvent(action: string, id?: number, pacientName?: string): void {
    if (action && action !== '') this.pacientEvent.emit({action, id, pacientName});
  }

  handleShowAllPacients(): void {

    this.pacientService.getAllPacients().subscribe({
      next: (allPacientsData) => {
        this.showProfissionalPacients = false
        this.pacients = allPacientsData;
      },
      error: (error) => {
        console.error('Erro ao obter os pacientes do usuário:', error);
      }
    });
  }
  handleProfissionalPacients(): void {

    this.pacientService.getProfissionalPacients().subscribe({
      next: (profissionalPacientsData) => {
        this.showProfissionalPacients = true
        this.pacients = profissionalPacientsData;
      },
      error: (error) => {
        console.error('Erro ao obter os pacientes do usuário:', error);
      }
    });
  }
}
