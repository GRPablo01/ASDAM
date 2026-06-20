import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierUser } from './modifier-user';

describe('ModifierUser', () => {
  let component: ModifierUser;
  let fixture: ComponentFixture<ModifierUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
