import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueillI } from './accueill-i';

describe('AccueillI', () => {
  let component: AccueillI;
  let fixture: ComponentFixture<AccueillI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueillI]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueillI);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
