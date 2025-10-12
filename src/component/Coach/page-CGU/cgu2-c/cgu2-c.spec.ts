import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CGU2C } from './cgu2-c';

describe('CGU2C', () => {
  let component: CGU2C;
  let fixture: ComponentFixture<CGU2C>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CGU2C]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CGU2C);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
