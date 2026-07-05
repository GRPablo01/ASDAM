import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupprimerUserKey } from './supprimer-user-key';

describe('SupprimerUserKey', () => {
  let component: SupprimerUserKey;
  let fixture: ComponentFixture<SupprimerUserKey>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupprimerUserKey]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupprimerUserKey);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
