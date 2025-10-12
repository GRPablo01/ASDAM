import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifC } from './notif-c';

describe('NotifC', () => {
  let component: NotifC;
  let fixture: ComponentFixture<NotifC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
