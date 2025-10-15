import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvoqueA } from './convoque-a';

describe('ConvoqueA', () => {
  let component: ConvoqueA;
  let fixture: ComponentFixture<ConvoqueA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvoqueA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvoqueA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
