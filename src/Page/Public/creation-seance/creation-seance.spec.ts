import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationSeance } from './creation-seance';

describe('CreationSeance', () => {
  let component: CreationSeance;
  let fixture: ComponentFixture<CreationSeance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationSeance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationSeance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
