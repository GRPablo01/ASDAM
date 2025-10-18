import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerPost } from './creer-post';

describe('CreerPost', () => {
  let component: CreerPost;
  let fixture: ComponentFixture<CreerPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerPost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
