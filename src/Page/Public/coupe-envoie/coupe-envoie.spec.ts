import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupeEnvoie } from './coupe-envoie';

describe('CoupeEnvoie', () => {
  let component: CoupeEnvoie;
  let fixture: ComponentFixture<CoupeEnvoie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoupeEnvoie]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoupeEnvoie);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
