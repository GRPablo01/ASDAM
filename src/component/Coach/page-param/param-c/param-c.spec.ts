import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamC } from './param-c';

describe('ParamC', () => {
  let component: ParamC;
  let fixture: ComponentFixture<ParamC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParamC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParamC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
