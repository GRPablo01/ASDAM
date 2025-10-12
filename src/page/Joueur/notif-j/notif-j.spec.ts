import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifJ } from './notif-j';

describe('NotifJ', () => {
  let component: NotifJ;
  let fixture: ComponentFixture<NotifJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
