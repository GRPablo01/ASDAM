import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSeance } from './detail-seance';

describe('DetailSeance', () => {
  let component: DetailSeance;
  let fixture: ComponentFixture<DetailSeance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSeance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSeance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
