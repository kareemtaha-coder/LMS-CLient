import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCurriculumComponent } from './create-curriculum.component';

describe('CreateCurriculumComponent', () => {
  let component: CreateCurriculumComponent;
  let fixture: ComponentFixture<CreateCurriculumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCurriculumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
