import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuprimerMatch } from './suprimer-match';

describe('SuprimerMatch', () => {
  let component: SuprimerMatch;
  let fixture: ComponentFixture<SuprimerMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuprimerMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuprimerMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
