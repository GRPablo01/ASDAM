import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsC } from './resultats-c';

describe('ResultatsC', () => {
  let component: ResultatsC;
  let fixture: ComponentFixture<ResultatsC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatsC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatsC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
