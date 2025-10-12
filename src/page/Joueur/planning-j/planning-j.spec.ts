import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningJ } from './planning-j';

describe('PlanningJ', () => {
  let component: PlanningJ;
  let fixture: ComponentFixture<PlanningJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
