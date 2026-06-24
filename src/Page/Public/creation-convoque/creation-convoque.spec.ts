import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationConvoque } from './creation-convoque';

describe('CreationConvoque', () => {
  let component: CreationConvoque;
  let fixture: ComponentFixture<CreationConvoque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationConvoque]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationConvoque);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
