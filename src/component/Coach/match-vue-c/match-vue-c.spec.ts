import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchVueC } from './match-vue-c';

describe('MatchVueC', () => {
  let component: MatchVueC;
  let fixture: ComponentFixture<MatchVueC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchVueC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchVueC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
