import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientsFormComponent } from './pacients-form.component';

describe('CategoryFormComponent', () => {
  let component: PacientsFormComponent;
  let fixture: ComponentFixture<PacientsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacientsFormComponent]
    });
    fixture = TestBed.createComponent(PacientsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
