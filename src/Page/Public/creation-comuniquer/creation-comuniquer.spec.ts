import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationComuniquer } from './creation-comuniquer';

describe('CreationComuniquer', () => {
  let component: CreationComuniquer;
  let fixture: ComponentFixture<CreationComuniquer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationComuniquer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationComuniquer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
