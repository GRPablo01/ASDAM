import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerA } from './player-a';

describe('PlayerA', () => {
  let component: PlayerA;
  let fixture: ComponentFixture<PlayerA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
