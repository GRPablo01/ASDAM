import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilI } from './acceuil-i';

describe('AcceuilI', () => {
  let component: AcceuilI;
  let fixture: ComponentFixture<AcceuilI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuilI]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceuilI);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
