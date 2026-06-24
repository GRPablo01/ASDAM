import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActus } from './add-actus';

describe('AddActus', () => {
  let component: AddActus;
  let fixture: ComponentFixture<AddActus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddActus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddActus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
