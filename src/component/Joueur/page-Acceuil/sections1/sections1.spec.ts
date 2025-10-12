import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sections1 } from './sections1';

describe('Sections1', () => {
  let component: Sections1;
  let fixture: ComponentFixture<Sections1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sections1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sections1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
