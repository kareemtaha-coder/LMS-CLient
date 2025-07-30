import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChapterFormComponent } from './add-chapter-form.component';

describe('AddChapterFormComponent', () => {
  let component: AddChapterFormComponent;
  let fixture: ComponentFixture<AddChapterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddChapterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddChapterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
