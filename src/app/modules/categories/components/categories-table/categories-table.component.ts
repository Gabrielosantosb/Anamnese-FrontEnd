import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GetCategoriesResponse} from "../../../../../models/interfaces/categories/get-categories-service.service";
import {EditCategoryAction} from "../../../../../models/interfaces/categories/event/editCategory";
import {CategoryEvent} from "../../../../../models/interfaces/enums/categories/CategoryEvent";
import {DeleteCategory} from "../../../../../models/interfaces/categories/event/deleteCategory";

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent {
  @Input() public categories: Array<GetCategoriesResponse> = [];
  @Output() public categoryEvent = new EventEmitter<EditCategoryAction>();
  @Output() public deleteCategoryEvent = new EventEmitter<DeleteCategory>();
  public categorySelected!: GetCategoriesResponse;
  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  handleDeleteCategoryEvent(category_id: string, categoryName: string): void {
    if (category_id !== '' && categoryName !== '') {
      this.deleteCategoryEvent.emit({ category_id, categoryName });
    }
  }

  handleCategoryEvent(action: string, id?: string, categoryName?: string): void {
    if (action && action !== '') this.categoryEvent.emit({ action, id, categoryName });
  }
}
