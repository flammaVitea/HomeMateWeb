import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetReports } from './budget-reports';

describe('BudgetReports', () => {
  let component: BudgetReports;
  let fixture: ComponentFixture<BudgetReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
