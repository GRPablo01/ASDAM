import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvoqueJ } from './convoque-j';

describe('ConvoqueJ', () => {
  let component: ConvoqueJ;
  let fixture: ComponentFixture<ConvoqueJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvoqueJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvoqueJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
