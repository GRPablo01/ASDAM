import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationMatch } from './creation-match';

describe('CreationMatch', () => {
  let component: CreationMatch;
  let fixture: ComponentFixture<CreationMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
