import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Convocation } from './convocation';

describe('Convocation', () => {
  let component: Convocation;
  let fixture: ComponentFixture<Convocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Convocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Convocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
