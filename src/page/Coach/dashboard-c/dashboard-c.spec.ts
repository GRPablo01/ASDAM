import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardC } from './dashboard-c';

describe('DashboardC', () => {
  let component: DashboardC;
  let fixture: ComponentFixture<DashboardC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
