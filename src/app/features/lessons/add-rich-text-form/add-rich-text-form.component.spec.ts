import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRichTextFormComponent } from './add-rich-text-form.component';

describe('AddRichTextFormComponent', () => {
  let component: AddRichTextFormComponent;
  let fixture: ComponentFixture<AddRichTextFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRichTextFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRichTextFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
