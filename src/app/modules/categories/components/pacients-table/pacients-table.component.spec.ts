import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientsTableComponent } from './pacients-table.component';

describe('CategoriesTableComponent', () => {
  let component: PacientsTableComponent;
  let fixture: ComponentFixture<PacientsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacientsTableComponent]
    });
    fixture = TestBed.createComponent(PacientsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
