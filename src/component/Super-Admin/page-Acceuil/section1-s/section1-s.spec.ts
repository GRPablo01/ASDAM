import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section1S } from './section1-s';

describe('Section1S', () => {
  let component: Section1S;
  let fixture: ComponentFixture<Section1S>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section1S]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section1S);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
