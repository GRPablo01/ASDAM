import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchS } from './match-s';

describe('MatchS', () => {
  let component: MatchS;
  let fixture: ComponentFixture<MatchS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
