import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActusC } from './actus-c';

describe('ActusC', () => {
  let component: ActusC;
  let fixture: ComponentFixture<ActusC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActusC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActusC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
