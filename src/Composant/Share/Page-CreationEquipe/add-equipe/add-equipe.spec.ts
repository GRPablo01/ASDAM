import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEquipe } from './add-equipe';

describe('AddEquipe', () => {
  let component: AddEquipe;
  let fixture: ComponentFixture<AddEquipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEquipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEquipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
