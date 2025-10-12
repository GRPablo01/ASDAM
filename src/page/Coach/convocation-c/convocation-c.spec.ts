import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocationC } from './convocation-c';

describe('ConvocationC', () => {
  let component: ConvocationC;
  let fixture: ComponentFixture<ConvocationC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvocationC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvocationC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
