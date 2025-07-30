import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, Output, signal } from '@angular/core';
import { AddExampleItemRequest, ExamplesGridContent, LessonContent } from '../../../../Core/api/api-models';
import { ToAbsoluteUrlPipe } from "../../../../Core/pipes/to-absolute-url.pipe";
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-examples-grid-content',
  standalone: true,
  imports: [ToAbsoluteUrlPipe, NgClass],
  templateUrl: './examples-grid-content.component.html', // We will use a separate file for the template
  styleUrls: ['./examples-grid-content.component.css'],   // And a separate file for styles
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamplesGridContentComponent {
  content = input.required<LessonContent>();
  // CORRECTED: The EventEmitter is now strongly typed
  @Output() saveItem = new EventEmitter<AddExampleItemRequest>();
  @Output() deleteItem = new EventEmitter<string>();

  gridContent = computed(() => {
    const c = this.content();
    return c.contentType === 'ExamplesGrid' ? (c as ExamplesGridContent) : null;
  });
  isAdding = signal(false);
  playingAudio = signal<HTMLAudioElement | null>(null);

  toggleAudio(audioPlayer: HTMLAudioElement): void {
    const currentlyPlaying = this.playingAudio();
    if (currentlyPlaying && currentlyPlaying !== audioPlayer) {
      currentlyPlaying.pause();
    }
    if (audioPlayer.paused) {
      audioPlayer.play();
      this.playingAudio.set(audioPlayer);
    } else {
      audioPlayer.pause();
      this.playingAudio.set(null);
    }
  }

  onAudioEnded(): void {
    this.playingAudio.set(null);
  }
    onSaveItem(request: AddExampleItemRequest): void {
    this.saveItem.emit(request);
    this.isAdding.set(false);
  }
}
