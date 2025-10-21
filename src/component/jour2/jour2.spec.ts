import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jour2 } from './jour2';

describe('Jour2', () => {
  let component: Jour2;
  let fixture: ComponentFixture<Jour2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jour2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jour2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
