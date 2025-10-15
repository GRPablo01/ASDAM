import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoueurA } from './joueur-a';

describe('JoueurA', () => {
  let component: JoueurA;
  let fixture: ComponentFixture<JoueurA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoueurA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoueurA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
