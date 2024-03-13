import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsHomeComponent } from './reports-home.component';

describe('ProductsHomeComponent', () => {
  let component: ReportsHomeComponent;
  let fixture: ComponentFixture<ReportsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsHomeComponent]
    });
    fixture = TestBed.createComponent(ReportsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
