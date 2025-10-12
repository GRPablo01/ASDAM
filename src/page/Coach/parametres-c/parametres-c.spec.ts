import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametresC } from './parametres-c';

describe('ParametresC', () => {
  let component: ParametresC;
  let fixture: ComponentFixture<ParametresC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametresC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametresC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
