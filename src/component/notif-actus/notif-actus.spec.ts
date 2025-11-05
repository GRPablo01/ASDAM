import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifActus } from './notif-actus';

describe('NotifActus', () => {
  let component: NotifActus;
  let fixture: ComponentFixture<NotifActus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifActus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifActus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
