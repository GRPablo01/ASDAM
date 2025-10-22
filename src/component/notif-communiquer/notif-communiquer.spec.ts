import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifCommuniquer } from './notif-communiquer';

describe('NotifCommuniquer', () => {
  let component: NotifCommuniquer;
  let fixture: ComponentFixture<NotifCommuniquer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifCommuniquer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifCommuniquer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
