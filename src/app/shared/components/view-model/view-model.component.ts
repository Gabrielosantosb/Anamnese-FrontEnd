import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-view-model',
  templateUrl: './view-model.component.html',
  styleUrls: ['./view-model.component.scss']
})
export class ViewModelComponent {
  @Input() report: any;
  display: boolean = false;

  constructor() { }

  open(report: any) {
    this.report = report;
    this.display = true;
  }

  close() {
    this.display = false;
  }
}
