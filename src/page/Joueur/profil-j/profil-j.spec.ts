import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilJ } from './profil-j';

describe('ProfilJ', () => {
  let component: ProfilJ;
  let fixture: ComponentFixture<ProfilJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
