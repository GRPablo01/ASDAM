import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierEvent } from './modifier-event';

describe('ModifierEvent', () => {
  let component: ModifierEvent;
  let fixture: ComponentFixture<ModifierEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
