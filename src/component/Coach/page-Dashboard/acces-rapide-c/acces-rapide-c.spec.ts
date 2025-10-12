import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesRapideC } from './acces-rapide-c';

describe('AccesRapideC', () => {
  let component: AccesRapideC;
  let fixture: ComponentFixture<AccesRapideC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccesRapideC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccesRapideC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
