import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsS } from './resultats-s';

describe('ResultatsS', () => {
  let component: ResultatsS;
  let fixture: ComponentFixture<ResultatsS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatsS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatsS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
