import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListJoueur } from './list-joueur';

describe('ListJoueur', () => {
  let component: ListJoueur;
  let fixture: ComponentFixture<ListJoueur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListJoueur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListJoueur);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
