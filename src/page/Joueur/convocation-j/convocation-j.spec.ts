import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocationJ } from './convocation-j';

describe('ConvocationJ', () => {
  let component: ConvocationJ;
  let fixture: ComponentFixture<ConvocationJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvocationJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvocationJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
