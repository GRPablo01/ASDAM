import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEvent2 } from './detail-event2';

describe('DetailEvent2', () => {
  let component: DetailEvent2;
  let fixture: ComponentFixture<DetailEvent2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailEvent2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailEvent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
