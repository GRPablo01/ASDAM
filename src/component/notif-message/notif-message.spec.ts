import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifMessage } from './notif-message';

describe('NotifMessage', () => {
  let component: NotifMessage;
  let fixture: ComponentFixture<NotifMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
