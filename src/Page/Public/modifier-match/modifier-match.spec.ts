import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierMatch } from './modifier-match';

describe('ModifierMatch', () => {
  let component: ModifierMatch;
  let fixture: ComponentFixture<ModifierMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
