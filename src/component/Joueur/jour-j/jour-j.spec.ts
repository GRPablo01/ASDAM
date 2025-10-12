import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourJ } from './jour-j';

describe('JourJ', () => {
  let component: JourJ;
  let fixture: ComponentFixture<JourJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JourJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
