import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilA } from './acceuil-a';

describe('AcceuilA', () => {
  let component: AcceuilA;
  let fixture: ComponentFixture<AcceuilA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuilA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceuilA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
