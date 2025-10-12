import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section2J } from './section2-j';

describe('Section2J', () => {
  let component: Section2J;
  let fixture: ComponentFixture<Section2J>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section2J]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section2J);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
