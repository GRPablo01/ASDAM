import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupEnvoi } from './coup-envoi';

describe('CoupEnvoi', () => {
  let component: CoupEnvoi;
  let fixture: ComponentFixture<CoupEnvoi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoupEnvoi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoupEnvoi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
