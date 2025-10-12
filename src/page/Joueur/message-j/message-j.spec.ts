import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageJ } from './message-j';

describe('MessageJ', () => {
  let component: MessageJ;
  let fixture: ComponentFixture<MessageJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
