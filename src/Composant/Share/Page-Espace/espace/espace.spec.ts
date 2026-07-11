import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Espace } from './espace';

describe('Espace', () => {
  let component: Espace;
  let fixture: ComponentFixture<Espace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Espace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Espace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
