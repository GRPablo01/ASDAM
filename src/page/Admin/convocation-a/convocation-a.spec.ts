import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocationA } from './convocation-a';

describe('ConvocationA', () => {
  let component: ConvocationA;
  let fixture: ComponentFixture<ConvocationA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvocationA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvocationA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
