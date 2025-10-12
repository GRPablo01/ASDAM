import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerMatchC } from './creer-match-c';

describe('CreerMatchC', () => {
  let component: CreerMatchC;
  let fixture: ComponentFixture<CreerMatchC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerMatchC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerMatchC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
