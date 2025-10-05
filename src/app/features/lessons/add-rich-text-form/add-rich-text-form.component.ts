import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Input,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddRichTextRequest, NoteType, RichTextContent } from '../../../Core/api/api-models';
import { CommonModule } from '@angular/common';
declare const Quill: any;

@Component({
  selector: 'app-add-rich-text-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-rich-text-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddRichTextFormComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);

  // NEW: Input to pre-fill the form in "edit" mode
  @Input() initialData?: Omit<RichTextContent, 'id' | 'contentType' | 'sortOrder'>;

  @Output() save = new EventEmitter<Omit<AddRichTextRequest, 'sortOrder'>>();
  @Output() cancel = new EventEmitter<void>();

  // NEW: Adding descriptive objects for note types for tooltips and icons
  noteTypes: { type: NoteType; label: string; icon: string; color: string }[] = [
    { type: 0, label: 'عادي', icon: 'M3 5.75A.75.75 0 013.75 5h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 5.75zm0 4A.75.75 0 013.75 9h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 9.75zm0 4A.75.75 0 013.75 13h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 13.75z', color: 'slate' },
    { type: 1, label: 'هام', icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM10 12a1 1 0 100 2 1 1 0 000-2z', color: 'blue' },
    { type: 2, label: 'تحذير', icon: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h12.94a2 2 0 001.71-3L9.71 3.86a2 2 0 00-3.42 0zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM10 12a1 1 0 100 2 1 1 0 000-2z', color: 'amber' },
    { type: 3, label: 'نصيحة', icon: 'M10 20a10 10 0 110-20 10 10 0 010 20zM8 11a1 1 0 100-2 1 1 0 000 2zm2-2a1 1 0 11-2 0 1 1 0 012 0zm2 2a1 1 0 100-2 1 1 0 000 2z', color: 'teal' },
  ];

  form = this.fb.group({
    title: ['', Validators.required],
    arabicText: ['', Validators.required],
    englishText: ['', Validators.required],
    noteType: this.fb.control<NoteType>(0, Validators.required),
  });

  @ViewChild('arabicEditor', { static: false }) arabicEditorRef?: ElementRef;
  @ViewChild('englishEditor', { static: false }) englishEditorRef?: ElementRef;
  private arabicQuill?: any;
  private englishQuill?: any;

  ngOnInit(): void {
    // NEW: If initial data is provided, patch the form
    if (this.initialData) {
      this.form.patchValue({
        ...this.initialData,
        title: String(this.initialData.title),
      });
    }
  }

  ngAfterViewInit(): void {
    const modules = {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ header: [2, 3, false] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
      ],
      clipboard: { matchVisual: false },
    };

    if (this.arabicEditorRef) {
      this.arabicQuill = new Quill(this.arabicEditorRef.nativeElement, {
        theme: 'snow',
        modules,
        placeholder: 'اكتب النص العربي...'
      });
      const initialHtml = this.form.controls.arabicText.value ?? '';
      if (initialHtml) {
        this.arabicQuill.clipboard.dangerouslyPasteHTML(initialHtml);
      }
      this.arabicQuill.on('text-change', () => {
        const html = this.normalizeHtml(this.arabicQuill.root.innerHTML);
        this.form.controls.arabicText.setValue(html);
      });
      // RTL styling
      this.arabicQuill.root.setAttribute('dir', 'rtl');
      this.arabicQuill.root.style.textAlign = 'right';
    }

    if (this.englishEditorRef) {
      this.englishQuill = new Quill(this.englishEditorRef.nativeElement, {
        theme: 'snow',
        modules,
        placeholder: 'Write the English text...'
      });
      const englishHtml = this.form.controls.englishText.value ?? '';
      if (englishHtml) {
        this.englishQuill.clipboard.dangerouslyPasteHTML(englishHtml);
      }
      this.englishQuill.on('text-change', () => {
        const html = this.normalizeHtml(this.englishQuill.root.innerHTML);
        this.form.controls.englishText.setValue(html);
      });
    }
  }

  selectNoteType(type: NoteType): void {
    this.form.controls.noteType.setValue(type);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value as Omit<AddRichTextRequest, 'sortOrder'>);
    } else {
      // NEW: Mark all fields as touched to show errors if user clicks save while form is invalid
      this.form.markAllAsTouched();
    }
  }

  // NEW: Helper function to easily check for control validity in the template
  isInvalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.get(controlName) as FormControl;
    return control.invalid && (control.dirty || control.touched);
  }

  private normalizeHtml(html: string): string {
    if (!html || html === '<p><br></p>') {
      return '';
    }
    return html;
  }
}
