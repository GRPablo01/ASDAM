import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMatch } from './detail-match';

describe('DetailMatch', () => {
  let component: DetailMatch;
  let fixture: ComponentFixture<DetailMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
