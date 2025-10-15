import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocationS } from './convocation-s';

describe('ConvocationS', () => {
  let component: ConvocationS;
  let fixture: ComponentFixture<ConvocationS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvocationS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvocationS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
