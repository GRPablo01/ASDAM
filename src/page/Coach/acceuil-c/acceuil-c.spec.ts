import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilC } from './acceuil-c';

describe('AcceuilC', () => {
  let component: AcceuilC;
  let fixture: ComponentFixture<AcceuilC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuilC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceuilC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
