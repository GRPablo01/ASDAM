import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sections1C } from './sections1-c';

describe('Sections1C', () => {
  let component: Sections1C;
  let fixture: ComponentFixture<Sections1C>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sections1C]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sections1C);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
