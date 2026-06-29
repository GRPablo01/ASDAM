import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommuniquer } from './add-communiquer';

describe('AddCommuniquer', () => {
  let component: AddCommuniquer;
  let fixture: ComponentFixture<AddCommuniquer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCommuniquer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCommuniquer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
