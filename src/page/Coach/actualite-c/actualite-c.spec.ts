import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteC } from './actualite-c';

describe('ActualiteC', () => {
  let component: ActualiteC;
  let fixture: ComponentFixture<ActualiteC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualiteC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualiteC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
