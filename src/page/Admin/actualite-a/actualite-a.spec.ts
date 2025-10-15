import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteA } from './actualite-a';

describe('ActualiteA', () => {
  let component: ActualiteA;
  let fixture: ComponentFixture<ActualiteA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualiteA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualiteA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
