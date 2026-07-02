import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMatch } from './get-match';

describe('GetMatch', () => {
  let component: GetMatch;
  let fixture: ComponentFixture<GetMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
