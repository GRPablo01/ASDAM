import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteS } from './actualite-s';

describe('ActualiteS', () => {
  let component: ActualiteS;
  let fixture: ComponentFixture<ActualiteS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualiteS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualiteS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
