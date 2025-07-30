import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterAccordionFormComponent } from './chapter-accordion-form.component';

describe('ChapterAccordionFormComponent', () => {
  let component: ChapterAccordionFormComponent;
  let fixture: ComponentFixture<ChapterAccordionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterAccordionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChapterAccordionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
