import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchC2 } from './match-c2';

describe('MatchC2', () => {
  let component: MatchC2;
  let fixture: ComponentFixture<MatchC2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchC2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchC2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
