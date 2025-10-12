import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerConvocationsC } from './creer-convocations-c';

describe('CreerConvocationsC', () => {
  let component: CreerConvocationsC;
  let fixture: ComponentFixture<CreerConvocationsC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerConvocationsC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerConvocationsC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
