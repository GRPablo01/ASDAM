import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerPostC } from './creer-post-c';

describe('CreerPostC', () => {
  let component: CreerPostC;
  let fixture: ComponentFixture<CreerPostC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerPostC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerPostC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
