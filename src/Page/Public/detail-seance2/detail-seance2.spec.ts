import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSeance2 } from './detail-seance2';

describe('DetailSeance2', () => {
  let component: DetailSeance2;
  let fixture: ComponentFixture<DetailSeance2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSeance2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSeance2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
