import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComnuniquerJ } from './comnuniquer-j';

describe('ComnuniquerJ', () => {
  let component: ComnuniquerJ;
  let fixture: ComponentFixture<ComnuniquerJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComnuniquerJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComnuniquerJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
