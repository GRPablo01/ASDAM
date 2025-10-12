import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsJ } from './resultats-j';

describe('ResultatsJ', () => {
  let component: ResultatsJ;
  let fixture: ComponentFixture<ResultatsJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatsJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatsJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
