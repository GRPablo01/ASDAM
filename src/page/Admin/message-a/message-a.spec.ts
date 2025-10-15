import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageA } from './message-a';

describe('MessageA', () => {
  let component: MessageA;
  let fixture: ComponentFixture<MessageA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
