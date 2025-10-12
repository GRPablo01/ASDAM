import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsentJ } from './absent-j';

describe('AbsentJ', () => {
  let component: AbsentJ;
  let fixture: ComponentFixture<AbsentJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbsentJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsentJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
