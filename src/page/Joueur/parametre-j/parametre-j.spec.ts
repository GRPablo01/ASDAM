import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreJ } from './parametre-j';

describe('ParametreJ', () => {
  let component: ParametreJ;
  let fixture: ComponentFixture<ParametreJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametreJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametreJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
