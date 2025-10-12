import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommuniquerC } from './communiquer-c';

describe('CommuniquerC', () => {
  let component: CommuniquerC;
  let fixture: ComponentFixture<CommuniquerC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommuniquerC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommuniquerC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
