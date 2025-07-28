import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterAccordionComponent } from './chapter-accordion.component';

describe('ChapterAccordionComponent', () => {
  let component: ChapterAccordionComponent;
  let fixture: ComponentFixture<ChapterAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterAccordionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChapterAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
