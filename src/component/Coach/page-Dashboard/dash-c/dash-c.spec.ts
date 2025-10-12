import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashC } from './dash-c';

describe('DashC', () => {
  let component: DashC;
  let fixture: ComponentFixture<DashC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
