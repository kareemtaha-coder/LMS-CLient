import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLessonFormComponent } from './add-lesson-form.component';

describe('AddLessonFormComponent', () => {
  let component: AddLessonFormComponent;
  let fixture: ComponentFixture<AddLessonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLessonFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLessonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
