import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoLettre } from './logo-lettre';

describe('LogoLettre', () => {
  let component: LogoLettre;
  let fixture: ComponentFixture<LogoLettre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoLettre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoLettre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
