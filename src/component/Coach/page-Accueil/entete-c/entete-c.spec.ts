import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnteteC } from './entete-c';

describe('EnteteC', () => {
  let component: EnteteC;
  let fixture: ComponentFixture<EnteteC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnteteC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnteteC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
