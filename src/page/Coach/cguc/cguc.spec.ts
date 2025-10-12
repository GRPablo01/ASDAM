import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CGUC } from './cguc';

describe('CGUC', () => {
  let component: CGUC;
  let fixture: ComponentFixture<CGUC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CGUC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CGUC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
