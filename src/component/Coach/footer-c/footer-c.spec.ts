import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterC } from './footer-c';

describe('FooterC', () => {
  let component: FooterC;
  let fixture: ComponentFixture<FooterC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
