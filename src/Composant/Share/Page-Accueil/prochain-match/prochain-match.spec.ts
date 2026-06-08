import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProchainMatch } from './prochain-match';

describe('ProchainMatch', () => {
  let component: ProchainMatch;
  let fixture: ComponentFixture<ProchainMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProchainMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProchainMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
