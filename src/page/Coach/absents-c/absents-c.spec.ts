import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsentsC } from './absents-c';

describe('AbsentsC', () => {
  let component: AbsentsC;
  let fixture: ComponentFixture<AbsentsC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbsentsC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsentsC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
