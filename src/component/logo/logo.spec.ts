import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loge } from './logo';

describe('Loge', () => {
  let component: Loge;
  let fixture: ComponentFixture<Loge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Loge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
