import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupriperEvent } from './supriper-event';

describe('SupriperEvent', () => {
  let component: SupriperEvent;
  let fixture: ComponentFixture<SupriperEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupriperEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupriperEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
