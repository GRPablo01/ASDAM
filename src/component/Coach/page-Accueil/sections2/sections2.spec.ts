import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sections2 } from './sections2';

describe('Sections2', () => {
  let component: Sections2;
  let fixture: ComponentFixture<Sections2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sections2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sections2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
