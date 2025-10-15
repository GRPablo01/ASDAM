import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommuniquerA } from './communiquer-a';

describe('CommuniquerA', () => {
  let component: CommuniquerA;
  let fixture: ComponentFixture<CommuniquerA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommuniquerA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommuniquerA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
