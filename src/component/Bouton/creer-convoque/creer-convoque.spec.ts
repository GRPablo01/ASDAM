import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerConvoque } from './creer-convoque';

describe('CreerConvoque', () => {
  let component: CreerConvoque;
  let fixture: ComponentFixture<CreerConvoque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerConvoque]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerConvoque);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
