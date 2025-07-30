import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumBuilderPageComponent } from './curriculum-builder-page.component';

describe('CurriculumBuilderPageComponent', () => {
  let component: CurriculumBuilderPageComponent;
  let fixture: ComponentFixture<CurriculumBuilderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumBuilderPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumBuilderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
