import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderI } from './header-i';

describe('HeaderI', () => {
  let component: HeaderI;
  let fixture: ComponentFixture<HeaderI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderI]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderI);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
