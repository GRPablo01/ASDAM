import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesMatch } from './mes-match';

describe('MesMatch', () => {
  let component: MesMatch;
  let fixture: ComponentFixture<MesMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
