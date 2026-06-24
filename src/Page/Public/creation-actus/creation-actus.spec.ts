import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationActus } from './creation-actus';

describe('CreationActus', () => {
  let component: CreationActus;
  let fixture: ComponentFixture<CreationActus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationActus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationActus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
