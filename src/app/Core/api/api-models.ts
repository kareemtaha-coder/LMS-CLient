// =================================================================
// #region API Error Structures
// =================================================================

/**
 * [cite_start]Represents a general domain error from the API. [cite: 3645-3652]
 */
export interface GeneralDomainError {
  type: string;
  title: string;
  status: number;
  detail: string;
}

/**
 * [cite_start]Represents a validation error from the API, containing specific field errors. [cite: 3653-3666]
 */
export interface ValidationError {
  type: string;
  title: string;
  status: number;
  errors: {
    [key: string]: string[];
  };
}

/**
 * Represents the request body for updating a lesson's title.
 * As per `PUT /api/Lessons/{lessonId}/title`.
 */
export interface UpdateLessonTitleRequest {
  title: string;
}
// =================================================================
// #region Curriculums
// =================================================================

/**
 * Represents a summary of a curriculum.
 * [cite_start]As per response from `GET /api/Curriculums`. [cite: 3673-3676]
 */
export interface CurriculumSummary {
  id: string; // guid
  title: string;
}

/**
 * Represents the request body for creating a new curriculum.
 * [cite_start]As per `POST /api/Curriculums`. [cite: 3691-3694]
 */
export interface CreateCurriculumRequest {
  title: string;
  introduction: string;
}

/**
 * Represents the full details of a curriculum.
 * [cite_start]As per response from `GET /api/Curriculums/{id}`. [cite: 3682-3687]
 */
export interface CurriculumDetails {
  id: string; // guid
  title: string;
  introduction: string;
  // ... other details
}

/**
 * Represents the request body for updating an existing curriculum.
 * [cite_start]As per `PUT /api/Curriculums/{curriculumId}`. [cite: 3702-3705]
 */
export interface UpdateCurriculumRequest {
  title: string;
  introduction: string;
}

// =================================================================
// #region Chapters
// =================================================================
/**
 * Represents a chapter containing its lessons, as part of CurriculumDetails.
 */
export interface ChapterWithLessons {
  id: string; // guid
  title: string;
  sortOrder: number;
  lessons: LessonSummary[]; // We already have the LessonSummary interface
}

/**
 * Represents the full details of a curriculum, now including its chapters.
 * As per response from `GET /api/Curriculums/{id}`.
 */
export interface CurriculumDetails {
  id: string; // guid
  title: string;
  introduction: string;
  chapters: ChapterWithLessons[]; // <-- Add this array
}
/**
 * Represents the request body for adding a new chapter.
 * [cite_start]As per `POST /api/curriculums/{curriculumId}/chapters`. [cite: 3720-3723]
 */
export interface AddChapterRequest {
  title: string;
  sortOrder: number;
}

/**
 * Represents the request body for updating a chapter's title.
 * [cite_start]As per `PUT /api/chapters/{chapterId}`. [cite: 3730-3733]
 */
export interface UpdateChapterRequest {
  title: string;
}

// =================================================================
// #region Lessons & Lesson Contents
// =================================================================

/**
 * [cite_start]Represents the possible types for a note within a RichText content block. [cite: 3822]
 */
export enum NoteType {
  Normal = 0,
  Important = 1,
  Warning = 2,
  Tip = 3,
}

/**
 * [cite_start]Represents the possible content types for a lesson. [cite: 3773-3793]
 */
export type ContentType =
  | 'RichText'
  | 'Video'
  | 'ImageWithCaption'
  | 'ExamplesGrid';

/**
 * Represents a summary of a lesson within a chapter.
 * [cite_start]As per response from `GET /api/Chapters/{chapterId}/lessons`. [cite: 3760-3763]
 */
export interface LessonSummary {
  id: string;
  title: string;
  sortOrder: number;
  status: number; // 0 = Draft, 1 = Published
  contentCount: number; // <-- الإضافة الجديدة المطلوبة
}
/**
 * Represents the full details of a lesson, including all its content blocks.
 * [cite_start]As per response from `GET /api/Lessons/{lessonId}`. [cite: 3769-3783]
 */
export interface LessonDetails {
  id: string; // guid
  title: string;
  sortOrder: number;
  contents: LessonContent[];
}

// --- Discriminated Union for Lesson Content ---

interface LessonContentBase {
  id: string;
  sortOrder: number;
  title: string;
}

export interface RichTextContent extends LessonContentBase {
  contentType: 'RichText';
  arabicText: string;
  englishText: string;
  noteType: NoteType;
}

export interface AddRichTextLessonRequest {
  title: string;
  sortOrder: number;
  arabicText: string;
  englishText: string;
  noteType: NoteType;
}

export interface VideoContent extends LessonContentBase {
  contentType: 'Video';
  videoUrl: string;
}

export interface ImageWithCaptionContent extends LessonContentBase {
  contentType: 'ImageWithCaption';
  imageUrl: string;
  caption: string;
}

export interface ExamplesGridContent extends LessonContentBase {
  contentType: 'ExamplesGrid';
  exampleItems: ExampleItem[];
}


/** A union of all possible lesson content types. */
export type LessonContent =
  | RichTextContent
  | VideoContent
  | ImageWithCaptionContent
  | ExamplesGridContent;

// =================================================================
// #region Lesson Content API Requests
// =================================================================

/**
 * Represents the request body for adding a lesson.
 * [cite_start]As per `POST /api/Chapters/{chapterId}/lessons`. [cite: 3748-3751]
 */
export interface AddLessonRequest {
  title: string;
  sortOrder: number;
}

/**
 * Represents the request body for adding a rich text content block.
 * [cite_start]As per `POST /api/lessons/{lessonId}/contents/rich-text`. [cite: 3818-3823]
 */
export interface AddRichTextRequest {
  title: string; // The form will send a simple string
  sortOrder: number;
  arabicText: string;
  englishText: string;
  noteType: NoteType;
}
/**
 * Represents the request body for adding a video content block.
 * [cite_start]As per `POST /api/lessons/{lessonId}/contents/video`. [cite: 3829-3832]
 */
export interface AddVideoRequest {
  title: string;
  sortOrder: number;
  videoUrl: string;
}

/**
 * Represents the request body for adding an empty examples grid.
 * [cite_start]As per `POST /api/lessons/{lessonId}/contents/examples-grid`. [cite: 3844-3848]
//  */
// export interface AddExamplesGridRequest {
//   title: string; // The form will send a simple string
//   sortOrder: number;
// }

// 2. Define the main request interface, ensuring it includes the 'examples' array
export interface AddExamplesGridRequest {
  title: string;
  sortOrder: number;
}
export interface ExamplesGridContent extends LessonContentBase {
  contentType: 'ExamplesGrid';
  examples: ExampleItem[];
}
// Core/api/api-models.ts


/**
 * Represents the request body for adding an empty examples grid.
 * [cite_start]As per `POST /api/lessons/{lessonId}/contents/examples-grid`. [cite: 212, 213]
 */
export interface AddExamplesGridRequest {
  sortOrder: number;
}

/**
 * Represents the structure of a single item within an examples grid.
 * [cite_start]As per response from `GET /api/Lessons/{lessonId}`. [cite: 160, 161]
 */
export interface ExampleItem {
  id: string; // guid
  imageUrl: string;
  audioUrl: string | null;
}

/**
 * Represents the structure of the ExamplesGrid content block.
 */
export interface ExamplesGridContent extends LessonContentBase {
  contentType: 'ExamplesGrid';
  exampleItems: ExampleItem[];
}

/**
 * Represents the form data for adding a new item to an examples grid.
 * This is a multipart/form-data request.
 * [cite_start]As per `POST /api/contents/{contentId}/example-items`. [cite: 259, 260, 263]
 */
export interface AddExampleItemRequest {
  imageFile: File;
  audioFile?: File;
}


/**
 * Represents the request body for updating a rich text content block.
 * As per `PUT /api/lessons/{lessonId}/contents/{contentId}/rich-text`.
 */
export interface UpdateRichTextRequest {
  title: string;
  arabicText: string;
  englishText: string;
  noteType: NoteType;
}

/**
 * Represents the request body for updating a video content block.
 * As per `PUT /api/lessons/{lessonId}/contents/{contentId}/video`.
 */
export interface UpdateVideoRequest {
  title: string;
  videoUrl: string;
}

/**
 * Represents the request body for updating an image-with-caption content block.
 * Mirrors the ImageFormSaveRequest but is specific to updates.
 * As per `PUT /api/lessons/{lessonId}/contents/{contentId}/image-with-caption`.
 */
export interface UpdateImageRequest {
  title: string;
  caption: string;
  imageFile?: File | null; // The image file is optional during an update
}

export interface ImageFormSaveRequest {
  title: string;
  caption: string;
  imageFile: File;
}
export interface AddImageRequest {
  title: string;
  caption?: string;
  sortOrder: number;
  imageFile: File;
}
/**
 * Represents the request body for reordering content within a lesson.
 * [cite_start]As per `PUT /api/lessons/{lessonId}/contents/reorder`. [cite: 3855-3861]
 */
export interface ReorderContentsRequest {
  orderedContentIds: string[]; // array of guids
}

/**
 * Represents the request body for updating a rich text content block.
 * [cite_start]As per `PUT /api/contents/{contentId}/rich-text`. [cite: 3867-3871]
 */
export interface UpdateRichTextRequest {
  arabicText: string;
  englishText: string;
  noteType: NoteType;
  title: string; // The form will send a simple string
}

/**
 * Represents the request body for updating a video content block.
 * [cite_start]As per `PUT /api/contents/{contentId}/video`. [cite: 3876-3878]
 */
export interface UpdateVideoRequest {
  videoUrl: string;
  title: string; // The form will send a simple string
}
