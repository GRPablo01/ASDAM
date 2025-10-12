import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageC } from './message-c';

describe('MessageC', () => {
  let component: MessageC;
  let fixture: ComponentFixture<MessageC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
