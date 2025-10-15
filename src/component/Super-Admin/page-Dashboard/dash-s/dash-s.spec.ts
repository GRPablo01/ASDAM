import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashS } from './dash-s';

describe('DashS', () => {
  let component: DashS;
  let fixture: ComponentFixture<DashS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
