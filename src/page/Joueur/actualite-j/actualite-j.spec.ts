import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteJ } from './actualite-j';

describe('ActualiteJ', () => {
  let component: ActualiteJ;
  let fixture: ComponentFixture<ActualiteJ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualiteJ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualiteJ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
