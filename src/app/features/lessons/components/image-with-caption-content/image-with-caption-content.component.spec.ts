import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWithCaptionContentComponent } from './image-with-caption-content.component';

describe('ImageWithCaptionContentComponent', () => {
  let component: ImageWithCaptionContentComponent;
  let fixture: ComponentFixture<ImageWithCaptionContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageWithCaptionContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageWithCaptionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
