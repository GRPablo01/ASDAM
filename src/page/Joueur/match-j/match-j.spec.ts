import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchJ } from './match-j';

describe('MatchJ', () => {
  let component: MatchJ;
  let fixture: ComponentFixture<MatchJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
