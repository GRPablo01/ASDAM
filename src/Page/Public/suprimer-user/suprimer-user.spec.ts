import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupriperUser } from './supriper-user';

describe('SupriperUser', () => {
  let component: SupriperUser;
  let fixture: ComponentFixture<SupriperUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupriperUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupriperUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
