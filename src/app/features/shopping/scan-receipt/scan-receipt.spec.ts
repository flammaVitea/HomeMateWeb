import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanReceipt } from './scan-receipt';

describe('ScanReceipt', () => {
  let component: ScanReceipt;
  let fixture: ComponentFixture<ScanReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanReceipt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanReceipt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
