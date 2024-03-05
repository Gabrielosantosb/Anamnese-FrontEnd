import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientsHomeComponent } from './pacients-home.component';

describe('CategoriesHomeComponent', () => {
  let component: PacientsHomeComponent;
  let fixture: ComponentFixture<PacientsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacientsHomeComponent]
    });
    fixture = TestBed.createComponent(PacientsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
