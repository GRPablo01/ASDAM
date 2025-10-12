import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningC } from './planning-c';

describe('PlanningC', () => {
  let component: PlanningC;
  let fixture: ComponentFixture<PlanningC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
