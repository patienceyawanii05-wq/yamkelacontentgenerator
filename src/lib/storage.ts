import type { GeneratedContent, SocialPost, Platform } from '@/types';

const STORAGE_KEY = 'eventcraft_saved_content';
const POSTS_KEY = 'eventcraft_saved_posts';
const HISTORY_KEY = 'eventcraft_history';

export function loadSavedContent(): GeneratedContent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveContent(content: GeneratedContent): GeneratedContent[] {
  const existing = loadSavedContent();
  const updated = [content, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteContent(id: string): GeneratedContent[] {
  const existing = loadSavedContent();
  const updated = existing.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function loadSavedPosts(): SocialPost[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function savePost(post: SocialPost): SocialPost[] {
  const existing = loadSavedPosts();
  const idx = existing.findIndex((p) => p.id === post.id);
  let updated: SocialPost[];
  if (idx >= 0) {
    updated = [...existing];
    updated[idx] = post;
  } else {
    updated = [post, ...existing];
  }
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  return updated;
}

export function deletePost(id: string): SocialPost[] {
  const existing = loadSavedPosts();
  const updated = existing.filter((p) => p.id !== id);
  localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  return updated;
}

export function loadHistory(): GeneratedContent[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function addToHistory(content: GeneratedContent): GeneratedContent[] {
  const existing = loadHistory();
  const updated = [content, ...existing].slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function deleteHistoryItem(id: string): GeneratedContent[] {
  const existing = loadHistory();
  const updated = existing.filter((c) => c.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

const STATS_KEY = 'eventcraft_stats';

export interface GenerationStats {
  promptsCreated: number;
  imagesGenerated: number;
  codeGenerated: number;
  textGenerated: number;
  socialPosts: number;
}

const DEFAULT_STATS: GenerationStats = {
  promptsCreated: 0,
  imagesGenerated: 0,
  codeGenerated: 0,
  textGenerated: 0,
  socialPosts: 0,
};

export function loadStats(): GenerationStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return DEFAULT_STATS;
  }
}

export function incrementStat(key: keyof GenerationStats, amount: number = 1): GenerationStats {
  const stats = loadStats();
  stats[key] += amount;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject(new Error('Clipboard not available'));
}

export function setHidden(id: string, hidden: boolean): GeneratedContent[] {
  const existing = loadSavedContent();
  const updated = existing.map((c) => (c.id === id ? { ...c, hidden } : c));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  const hist = loadHistory();
  const updatedHist = hist.map((c) => (c.id === id ? { ...c, hidden } : c));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHist));
  return updated;
}

export function toggleHidden(id: string): GeneratedContent[] {
  const existing = loadSavedContent();
  const item = existing.find((c) => c.id === id);
  return setHidden(id, !item?.hidden);
}

export interface SocialActivity {
  id: string;
  platform: Platform;
  botHandle: string;
  botAvatar: string;
  content: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  postedAt: number;
  imageUrl?: string | null;
}

const ACTIVITY_KEY = 'eventcraft_social_activity';

const BOT_PROFILES: Record<string, { handle: string; avatar: string }> = {
  instagram: { handle: '@eventify.studio', avatar: '📸' },
  facebook: { handle: 'Eventify Studio', avatar: '👍' },
  twitter: { handle: '@eventifyai', avatar: '🐦' },
  linkedin: { handle: 'Eventify Studio', avatar: '💼' },
  tiktok: { handle: '@eventify', avatar: '🎵' },
  email: { handle: 'Eventify Newsletter', avatar: '📧' },
};

export function loadActivity(): SocialActivity[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function addActivity(platform: Platform, content: string, hashtags: string[], imageUrl?: string | null): SocialActivity[] {
  const bot = BOT_PROFILES[platform] || BOT_PROFILES.instagram;
  const activity: SocialActivity = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    platform,
    botHandle: bot.handle,
    botAvatar: bot.avatar,
    content,
    hashtags,
    likes: Math.floor(Math.random() * 50) + 5,
    comments: Math.floor(Math.random() * 15) + 1,
    shares: Math.floor(Math.random() * 20) + 2,
    postedAt: Date.now(),
    imageUrl: imageUrl || null,
  };
  const existing = loadActivity();
  const updated = [activity, ...existing].slice(0, 50);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteActivity(id: string): SocialActivity[] {
  const existing = loadActivity();
  const updated = existing.filter((a) => a.id !== id);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
  return updated;
}

export function likeActivity(id: string): SocialActivity[] {
  const existing = loadActivity();
  const updated = existing.map((a) => (a.id === id ? { ...a, likes: a.likes + 1 } : a));
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
  return updated;
}
