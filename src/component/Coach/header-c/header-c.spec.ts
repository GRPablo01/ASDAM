import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderC } from './header-c';

describe('HeaderC', () => {
  let component: HeaderC;
  let fixture: ComponentFixture<HeaderC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
