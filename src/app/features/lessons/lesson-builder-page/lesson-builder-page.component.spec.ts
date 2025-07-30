import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonBuilderPageComponent } from './lesson-builder-page.component';

describe('LessonBuilderPageComponent', () => {
  let component: LessonBuilderPageComponent;
  let fixture: ComponentFixture<LessonBuilderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonBuilderPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonBuilderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
