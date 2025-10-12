import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MMSJ } from './mmsj';

describe('MMSJ', () => {
  let component: MMSJ;
  let fixture: ComponentFixture<MMSJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MMSJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MMSJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
