import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchA } from './match-a';

describe('MatchA', () => {
  let component: MatchA;
  let fixture: ComponentFixture<MatchA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
