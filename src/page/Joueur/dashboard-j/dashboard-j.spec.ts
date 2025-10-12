import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardJ } from './dashboard-j';

describe('DashboardJ', () => {
  let component: DashboardJ;
  let fixture: ComponentFixture<DashboardJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
