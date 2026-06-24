import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConvo } from './add-convo';

describe('AddConvo', () => {
  let component: AddConvo;
  let fixture: ComponentFixture<AddConvo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddConvo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConvo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
