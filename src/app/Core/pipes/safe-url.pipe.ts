import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(url: string | undefined | null): SafeResourceUrl | null {
    if (!url) {
      return null;
    }

    // THE FIX: Convert standard YouTube URLs to embeddable URLs
    const embedUrl = this.convertToEmbedUrl(url);

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private convertToEmbedUrl(url: string): string {
    // Regular expression to find a YouTube video ID from a standard URL
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
      // If it's a YouTube URL, construct the embed URL.
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    // For other URLs (like Vimeo or direct video files), return them as is.
    // You could add more converters here for other services if needed.
    return url;
  }
}
