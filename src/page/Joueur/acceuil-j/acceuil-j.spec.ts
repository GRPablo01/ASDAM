import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilJ } from './acceuil-j';

describe('AcceuilJ', () => {
  let component: AcceuilJ;
  let fixture: ComponentFixture<AcceuilJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuilJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceuilJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
