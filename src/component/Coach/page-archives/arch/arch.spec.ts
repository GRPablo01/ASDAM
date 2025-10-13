import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Arch } from './arch';

describe('Arch', () => {
  let component: Arch;
  let fixture: ComponentFixture<Arch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Arch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Arch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
