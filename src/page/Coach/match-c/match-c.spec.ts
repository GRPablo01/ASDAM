import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchC } from './match-c';

describe('MatchC', () => {
  let component: MatchC;
  let fixture: ComponentFixture<MatchC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
