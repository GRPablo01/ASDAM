import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Match2 } from './match2';

describe('Match2', () => {
  let component: Match2;
  let fixture: ComponentFixture<Match2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Match2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Match2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
