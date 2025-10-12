import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourC } from './jour-c';

describe('JourC', () => {
  let component: JourC;
  let fixture: ComponentFixture<JourC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JourC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
