import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilC } from './profil-c';

describe('ProfilC', () => {
  let component: ProfilC;
  let fixture: ComponentFixture<ProfilC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
