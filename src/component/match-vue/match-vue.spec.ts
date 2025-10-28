import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchVue } from './match-vue';

describe('MatchVue', () => {
  let component: MatchVue;
  let fixture: ComponentFixture<MatchVue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchVue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchVue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
