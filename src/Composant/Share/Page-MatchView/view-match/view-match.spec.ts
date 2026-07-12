import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMatch } from './view-match';

describe('ViewMatch', () => {
  let component: ViewMatch;
  let fixture: ComponentFixture<ViewMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
