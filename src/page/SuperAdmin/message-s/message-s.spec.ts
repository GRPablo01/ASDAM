import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageS } from './message-s';

describe('MessageS', () => {
  let component: MessageS;
  let fixture: ComponentFixture<MessageS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
