import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterA } from './footer-a';

describe('FooterA', () => {
  let component: FooterA;
  let fixture: ComponentFixture<FooterA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
