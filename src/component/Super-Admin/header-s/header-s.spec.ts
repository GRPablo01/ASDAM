import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderS } from './header-s';

describe('HeaderS', () => {
  let component: HeaderS;
  let fixture: ComponentFixture<HeaderS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
