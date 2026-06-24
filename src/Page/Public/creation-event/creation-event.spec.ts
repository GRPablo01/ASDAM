import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationEvent } from './creation-event';

describe('CreationEvent', () => {
  let component: CreationEvent;
  let fixture: ComponentFixture<CreationEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
