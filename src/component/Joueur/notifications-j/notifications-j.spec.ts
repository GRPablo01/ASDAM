import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsJ } from './notifications-j';

describe('NotificationsJ', () => {
  let component: NotificationsJ;
  let fixture: ComponentFixture<NotificationsJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
