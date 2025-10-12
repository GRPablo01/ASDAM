import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerEventC } from './creer-event-c';

describe('CreerEventC', () => {
  let component: CreerEventC;
  let fixture: ComponentFixture<CreerEventC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerEventC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerEventC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
