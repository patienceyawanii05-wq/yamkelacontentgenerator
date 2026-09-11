import { useState, useEffect } from 'react';
import type { Platform, SocialPost, EventDetails } from '@/types';
import { generateSocialPost, generateHashtags } from '@/lib/generator';
import { EventForm } from '@/components/EventForm';
import { Icon } from '@/components/Icon';
import { PLATFORM_OPTIONS } from '@/data';
import { copyToClipboard, loadSavedPosts, savePost, deletePost, incrementStat, addActivity } from '@/lib/storage';
import { Share2, Send, Copy, Check, Trash2, Calendar, Image as ImageIcon, CheckCircle2, Clock, FileText } from 'lucide-react';

const DEFAULT_DETAILS: EventDetails = {
  eventName: '',
  category: 'birthday',
  hostName: '',
  date: '',
  location: '',
  description: '',
  audience: '',
  tone: 'exciting',
  platform: 'instagram',
  keywords: '',
  rsvpLink: '',
};

const PLATFORMS: Platform[] = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'email'];

const platformColors: Record<Platform, string> = {
  instagram: 'bg-gradient-to-br from-pink-500 to-purple-500',
  facebook: 'bg-blue-600',
  twitter: 'bg-slate-800',
  linkedin: 'bg-blue-700',
  tiktok: 'bg-slate-900',
  email: 'bg-emerald-600',
};

export function SocialMediaManager() {
  const [details, setDetails] = useState<EventDetails>(DEFAULT_DETAILS);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['instagram']);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedPosts, setGeneratedPosts] = useState<SocialPost[]>([]);

  useEffect(() => {
    setPosts(loadSavedPosts());
  }, []);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const newPosts: SocialPost[] = selectedPlatforms.map((p) => ({
        id: `post-${Date.now()}-${p}-${Math.random().toString(36).slice(2, 6)}`,
        platform: p,
        content: generateSocialPost(details, p),
        hashtags: generateHashtags(details),
        imageUrl: null,
        scheduledFor: null,
        status: 'draft' as const,
        createdAt: Date.now(),
      }));
      setGeneratedPosts(newPosts);
      incrementStat('socialPosts', newPosts.length);
      incrementStat('promptsCreated', newPosts.length);
      setGenerating(false);
    }, 600);
  };

  const handlePost = (post: SocialPost) => {
    const updated: SocialPost = { ...post, status: 'posted' };
    savePost(updated);
    setPosts(loadSavedPosts());
    setGeneratedPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
    addActivity(post.platform, post.content, post.hashtags);
  };

  const handleSchedule = (post: SocialPost) => {
    const updated: SocialPost = { ...post, status: 'scheduled', scheduledFor: details.date || new Date(Date.now() + 86400000).toISOString().split('T')[0] };
    savePost(updated);
    setPosts(loadSavedPosts());
    setGeneratedPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
  };

  const handleSaveDraft = (post: SocialPost) => {
    savePost(post);
    setPosts(loadSavedPosts());
  };

  const handleDelete = (id: string) => {
    deletePost(id);
    setPosts(loadSavedPosts());
  };

  const handleCopy = (id: string, text: string) => {
    copyToClipboard(text)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {});
  };

  const statusIcon = (status: SocialPost['status']) => {
    if (status === 'posted') return <CheckCircle2 className="h-3.5 w-3.5 text-success-500" />;
    if (status === 'scheduled') return <Clock className="h-3.5 w-3.5 text-amber-500" />;
    return <FileText className="h-3.5 w-3.5 text-slate-400" />;
  };

  const statusLabel = (status: SocialPost['status']) => {
    if (status === 'posted') return 'Posted';
    if (status === 'scheduled') return 'Scheduled';
    return 'Draft';
  };

  return (
    <div className="mx-auto max-w-[1160px] animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          Social Media Manager
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create and publish posts across all your social platforms — Instagram, Facebook, X, LinkedIn, TikTok, and Email.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="card p-6 lg:sticky lg:top-20">
            <div className="mb-5 flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary-500" />
              <h2 className="font-display text-lg font-bold text-slate-900">Event Details</h2>
            </div>
            <EventForm details={details} onChange={setDetails} />

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Select Platforms</p>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map((p) => {
                  const opt = PLATFORM_OPTIONS.find((o) => o.id === p);
                  const selected = selectedPlatforms.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-2.5 transition-all ${
                        selected ? 'border-primary-400 bg-primary-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${selected ? platformColors[p] : 'bg-slate-100'}`}>
                        <Icon name={opt?.icon || 'share2'} className={`h-4 w-4 ${selected ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <span className={`text-[10px] font-bold ${selected ? 'text-primary-700' : 'text-slate-600'}`}>
                        {opt?.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || selectedPlatforms.length === 0}
              className="btn-primary mt-5 w-full py-3"
            >
              <Send className="h-4 w-4" />
              {generating ? 'Creating Posts...' : `Generate ${selectedPlatforms.length} Post${selectedPlatforms.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {generating && (
            <div className="card flex min-h-[300px] flex-col items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary-500" />
              <p className="mt-4 text-sm font-medium text-slate-500">Crafting posts for each platform...</p>
            </div>
          )}

          {!generating && generatedPosts.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-slate-900">Generated Posts</h2>
              {generatedPosts.map((post) => {
                const opt = PLATFORM_OPTIONS.find((o) => o.id === post.platform);
                return (
                  <div key={post.id} className="card overflow-hidden animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${platformColors[post.platform]}`}>
                          <Icon name={opt?.icon || 'share2'} className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{opt?.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {statusIcon(post.status)}
                        <span className="text-xs font-semibold text-slate-500">{statusLabel(post.status)}</span>
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto scrollbar-thin p-5">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
                        {post.content}
                      </pre>
                    </div>
                    <div className="flex items-center gap-2 border-t border-slate-200 px-5 py-3">
                      <button
                        onClick={() => handleCopy(post.id, post.content)}
                        className="btn-secondary py-2 text-xs"
                      >
                        {copiedId === post.id ? <><Check className="h-3.5 w-3.5 text-success-500" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                      </button>
                      <button
                        onClick={() => handleSaveDraft(post)}
                        className="btn-secondary py-2 text-xs"
                      >
                        <FileText className="h-3.5 w-3.5" /> Save Draft
                      </button>
                      <button
                        onClick={() => handleSchedule(post)}
                        className="btn-secondary py-2 text-xs"
                      >
                        <Calendar className="h-3.5 w-3.5" /> Schedule
                      </button>
                      <button
                        onClick={() => handlePost(post)}
                        className="btn-primary ml-auto py-2 text-xs"
                      >
                        <Send className="h-3.5 w-3.5" /> Post Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!generating && generatedPosts.length === 0 && posts.length === 0 && (
            <div className="card flex min-h-[300px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Share2 className="h-8 w-8 text-slate-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">
                Fill in your event details, select platforms, and generate posts to publish
              </p>
            </div>
          )}

          {posts.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-slate-900">Your Posts ({posts.length})</h2>
              {posts.map((post) => {
                const opt = PLATFORM_OPTIONS.find((o) => o.id === post.platform);
                return (
                  <div key={post.id} className="card flex items-start gap-4 p-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${platformColors[post.platform]}`}>
                      <Icon name={opt?.icon || 'share2'} className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">{opt?.label}</span>
                        {statusIcon(post.status)}
                        <span className="text-xs text-slate-500">{statusLabel(post.status)}</span>
                        {post.scheduledFor && <span className="text-xs text-slate-400">· {post.scheduledFor}</span>}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2">{post.content}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button onClick={() => handleCopy(post.id, post.content)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                        {copiedId === post.id ? <Check className="h-4 w-4 text-success-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="rounded-lg p-2 text-slate-400 hover:bg-error-50 hover:text-error-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
