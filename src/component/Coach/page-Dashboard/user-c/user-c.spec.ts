import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserC } from './user-c';

describe('DashC', () => {
  let component: UserC;
  let fixture: ComponentFixture<UserC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
