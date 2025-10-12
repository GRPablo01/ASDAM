import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsentC } from './absent-c';

describe('AbsentC', () => {
  let component: AbsentC;
  let fixture: ComponentFixture<AbsentC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbsentC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsentC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
