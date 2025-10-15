import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningS } from './planning-s';

describe('PlanningS', () => {
  let component: PlanningS;
  let fixture: ComponentFixture<PlanningS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
