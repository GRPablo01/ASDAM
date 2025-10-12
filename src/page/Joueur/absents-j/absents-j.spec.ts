import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsentsJ } from './absents-j';

describe('AbsentsJ', () => {
  let component: AbsentsJ;
  let fixture: ComponentFixture<AbsentsJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbsentsJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsentsJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
