import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningA } from './planning-a';

describe('PlanningA', () => {
  let component: PlanningA;
  let fixture: ComponentFixture<PlanningA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
