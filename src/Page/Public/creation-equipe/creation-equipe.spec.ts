import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationEquipe } from './creation-equipe';

describe('CreationEquipe', () => {
  let component: CreationEquipe;
  let fixture: ComponentFixture<CreationEquipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationEquipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationEquipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
