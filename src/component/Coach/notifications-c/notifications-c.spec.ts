import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsC } from './notifications-c';

describe('NotificationsC', () => {
  let component: NotificationsC;
  let fixture: ComponentFixture<NotificationsC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
