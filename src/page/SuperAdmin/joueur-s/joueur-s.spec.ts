import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoueurS } from './joueur-s';

describe('JoueurS', () => {
  let component: JoueurS;
  let fixture: ComponentFixture<JoueurS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoueurS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoueurS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
