import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jour } from './jour';

describe('Jour', () => {
  let component: Jour;
  let fixture: ComponentFixture<Jour>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jour]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
