import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestColor } from './test-color';

describe('TestColor', () => {
  let component: TestColor;
  let fixture: ComponentFixture<TestColor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestColor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestColor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
