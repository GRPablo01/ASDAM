import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterJ } from './footer-j';

describe('FooterJ', () => {
  let component: FooterJ;
  let fixture: ComponentFixture<FooterJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
