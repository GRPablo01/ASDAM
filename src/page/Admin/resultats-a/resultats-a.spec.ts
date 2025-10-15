import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsA } from './resultats-a';

describe('ResultatsA', () => {
  let component: ResultatsA;
  let fixture: ComponentFixture<ResultatsA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatsA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatsA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
