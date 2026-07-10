import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMatch2 } from './detail-match2';

describe('DetailMatch2', () => {
  let component: DetailMatch2;
  let fixture: ComponentFixture<DetailMatch2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailMatch2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailMatch2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
