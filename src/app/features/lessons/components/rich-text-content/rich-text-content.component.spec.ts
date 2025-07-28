import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichTextContentComponent } from './rich-text-content.component';

describe('RichTextContentComponent', () => {
  let component: RichTextContentComponent;
  let fixture: ComponentFixture<RichTextContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichTextContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RichTextContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
