import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommuniquerS } from './communiquer-s';

describe('CommuniquerS', () => {
  let component: CommuniquerS;
  let fixture: ComponentFixture<CommuniquerS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommuniquerS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommuniquerS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
