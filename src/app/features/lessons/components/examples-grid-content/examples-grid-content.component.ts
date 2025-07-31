import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, Output, signal, Input } from '@angular/core'; // أضف Input
import { AddExampleItemRequest, ExamplesGridContent, LessonContent } from '../../../../Core/api/api-models';
import { ToAbsoluteUrlPipe } from "../../../../Core/pipes/to-absolute-url.pipe";
import { CommonModule } from '@angular/common';
import { AddExampleItemFormComponent } from '../../add-examples-grid-form/add-example-item-form/add-example-item-form.component';

@Component({
  selector: 'app-examples-grid-content',
  standalone: true,
  imports: [CommonModule, ToAbsoluteUrlPipe, AddExampleItemFormComponent],
  templateUrl: './examples-grid-content.component.html',
  styleUrls: ['./examples-grid-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamplesGridContentComponent {
  // --- المدخلات والمخرجات ---
  content = input.required<LessonContent>();
  @Input() editMode: boolean = false; // <-- هذا هو الإدخال الجديد للتحكم في الوضع
  @Output() saveItem = new EventEmitter<AddExampleItemRequest>();
  @Output() deleteItem = new EventEmitter<string>();

  // --- Signals ---
  gridContent = computed(() => {
    const c = this.content();
    return c.contentType === 'ExamplesGrid' ? (c as ExamplesGridContent) : null;
  });
  isAdding = signal(false);
  playingAudio = signal<HTMLAudioElement | null>(null);

  // --- دوال التعامل مع الأحداث (تبقى كما هي لوضع التعديل) ---
  onSaveItem(request: AddExampleItemRequest): void {
    this.saveItem.emit(request);
    this.isAdding.set(false); // يمكننا إرجاع هذا السطر الآن، سيتم إغلاق النموذج بعد الحفظ
  }

  onDeleteItem(itemId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.deleteItem.emit(itemId);
  }

  // --- دوال الصوت (تبقى كما هي) ---
  toggleAudio(audioPlayer: HTMLAudioElement): void {
    const currentlyPlaying = this.playingAudio();
    if (currentlyPlaying && currentlyPlaying !== audioPlayer) {
      currentlyPlaying.pause();
    }
    if (audioPlayer.paused) {
      audioPlayer.play().then(() => this.playingAudio.set(audioPlayer));
    } else {
      audioPlayer.pause();
      this.playingAudio.set(null);
    }
  }

  onAudioEnded(): void {
    this.playingAudio.set(null);
  }
}
