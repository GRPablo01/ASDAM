import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MMSC } from './mmsc';

describe('MMSC', () => {
  let component: MMSC;
  let fixture: ComponentFixture<MMSC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MMSC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MMSC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
