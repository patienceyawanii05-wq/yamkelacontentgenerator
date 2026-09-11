export type EventCategory =
  | 'birthday'
  | 'wedding'
  | 'business-launch'
  | 'conference'
  | 'party'
  | 'charity'
  | 'custom';

export type ContentType =
  | 'social-caption'
  | 'event-description'
  | 'invitation-text'
  | 'hashtag-set'
  | 'email-subject'
  | 'email-body'
  | 'email-invitation'
  | 'email-reminder'
  | 'email-followup'
  | 'image-prompt'
  | 'code-snippet';

export type Tone =
  | 'exciting'
  | 'elegant'
  | 'professional'
  | 'playful'
  | 'luxurious'
  | 'casual'
  | 'inspirational';

export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'email';

export type CodeLanguage = 'html' | 'react' | 'vue' | 'python' | 'javascript' | 'css' | 'json';

export interface CodeSnippet {
  id: string;
  language: CodeLanguage;
  title: string;
  description: string;
  code: string;
  createdAt: number;
}

export interface EventDetails {
  eventName: string;
  category: EventCategory;
  hostName: string;
  date: string;
  location: string;
  description: string;
  audience: string;
  tone: Tone;
  platform: Platform;
  keywords: string;
  rsvpLink: string;
}

export interface GeneratedContent {
  id: string;
  type: ContentType;
  title: string;
  body: string;
  hashtags: string[];
  imagePrompt: string;
  createdAt: number;
  eventDetails: EventDetails;
  hidden?: boolean;
}

export interface SavedProject {
  id: string;
  name: string;
  contents: GeneratedContent[];
  createdAt: number;
  updatedAt: number;
}

export interface PromptLibraryItem {
  id: string;
  title: string;
  category: EventCategory;
  contentType: ContentType;
  prompt: string;
  description: string;
  tags: string[];
}

export interface EventCategoryInfo {
  id: EventCategory;
  label: string;
  icon: string;
  description: string;
  gradient: string;
  sampleImage: string;
  gallery: string[];
}

export interface SocialPost {
  id: string;
  platform: Platform;
  content: string;
  hashtags: string[];
  imageUrl: string | null;
  scheduledFor: string | null;
  status: 'draft' | 'scheduled' | 'posted';
  createdAt: number;
}
