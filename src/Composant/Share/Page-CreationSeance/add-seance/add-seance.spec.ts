import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeance } from './add-seance';

describe('AddSeance', () => {
  let component: AddSeance;
  let fixture: ComponentFixture<AddSeance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSeance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSeance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
