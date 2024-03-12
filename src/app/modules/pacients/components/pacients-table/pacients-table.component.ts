import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GetPacientsResponse} from "../../../../../models/interfaces/categories/get-categories-service.service";
import {EditCategoryAction} from "../../../../../models/interfaces/categories/event/editCategory";
import {PacientsEvent} from "../../../../../models/interfaces/enums/pacients/PacientEvent";
import {DeletePacient} from "../../../../../models/interfaces/categories/event/deletePacient";

@Component({
  selector: 'app-pacients-table',
  templateUrl: './pacients-table.component.html',
  styleUrls: ['./pacients-table.component.scss']
})
export class PacientsTableComponent {
  @Input() public pacients: Array<GetPacientsResponse> = [];
  @Output() public pacientEvent = new EventEmitter<EditCategoryAction>();
  @Output() public deleteCategoryEvent = new EventEmitter<DeletePacient>();

  public categorySelected!: GetPacientsResponse;
  public addCategoryAction = PacientsEvent.ADD_PACIENT_ACTION;
  public editCategoryAction = PacientsEvent.EDIT_PACIENT_ACTION;

  handleDeleteCategoryEvent(pacient_id: number, pacientName: string): void {
    if (pacient_id !== null && pacientName !== '') {
      this.deleteCategoryEvent.emit({ pacient_id, pacientName });
    }
  }

  handleCategoryEvent(action: string, id?: string, categoryName?: string): void {
    if (action && action !== '') this.pacientEvent.emit({ action, id, categoryName });
  }
}
