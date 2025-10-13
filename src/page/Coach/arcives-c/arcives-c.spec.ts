import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcivesC } from './arcives-c';

describe('ArcivesC', () => {
  let component: ArcivesC;
  let fixture: ComponentFixture<ArcivesC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArcivesC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArcivesC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
