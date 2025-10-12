import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderJ } from './header-j';

describe('HeaderJ', () => {
  let component: HeaderJ;
  let fixture: ComponentFixture<HeaderJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
