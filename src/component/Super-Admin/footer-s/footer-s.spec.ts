import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterS } from './footer-s';

describe('FooterS', () => {
  let component: FooterS;
  let fixture: ComponentFixture<FooterS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
