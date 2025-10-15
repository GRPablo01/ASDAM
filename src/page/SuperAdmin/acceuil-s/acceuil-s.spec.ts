import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilS } from './acceuil-s';

describe('AcceuilS', () => {
  let component: AcceuilS;
  let fixture: ComponentFixture<AcceuilS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuilS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceuilS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
