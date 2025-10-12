import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarreJ } from './barre-j';

describe('BarreJ', () => {
  let component: BarreJ;
  let fixture: ComponentFixture<BarreJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarreJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarreJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
