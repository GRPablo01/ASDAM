import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Plannig2 } from './plannig2';

describe('Plannig2', () => {
  let component: Plannig2;
  let fixture: ComponentFixture<Plannig2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Plannig2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Plannig2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
