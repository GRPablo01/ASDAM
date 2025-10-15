import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardS } from './dashboard-s';

describe('DashboardS', () => {
  let component: DashboardS;
  let fixture: ComponentFixture<DashboardS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
