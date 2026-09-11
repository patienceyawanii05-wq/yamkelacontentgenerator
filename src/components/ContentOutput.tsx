import type { ContentType, GeneratedContent } from '@/types';
import { CONTENT_TYPE_OPTIONS } from '@/data';
import { Icon } from '@/components/Icon';
import { Check, Copy, Bookmark, RefreshCw, Download, Share2, EyeOff, Eye, X } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard, saveContent, addActivity } from '@/lib/storage';

interface ContentOutputProps {
  content: GeneratedContent | null;
  onRegenerate: () => void;
  onSave: (content: GeneratedContent) => void;
}

export function ContentOutput({ content, onRegenerate, onSave }: ContentOutputProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [sharedPlatform, setSharedPlatform] = useState<string | null>(null);

  if (!content) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <Icon name="sparkles" className="h-8 w-8 text-slate-400" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-500">
          Fill in your event details and pick a content type to generate
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    copyToClipboard(content.body)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  const handleSave = () => {
    saveContent(content);
    setSaved(true);
    onSave(content);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content.body], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = (platform: string) => {
    addActivity(platform as any, content.body, content.hashtags);
    setSharedPlatform(platform);
    setTimeout(() => {
      setSharedPlatform(null);
      setShowShare(false);
    }, 2000);
  };

  const sharePlatforms = [
    { id: 'instagram', label: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-500' },
    { id: 'facebook', label: 'Facebook', icon: '👍', color: 'from-blue-500 to-blue-600' },
    { id: 'twitter', label: 'X', icon: '🐦', color: 'from-slate-700 to-slate-900' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-700' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵', color: 'from-slate-800 to-black' },
  ];

  return (
    <div className="flex h-full flex-col animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
            <Icon name={CONTENT_TYPE_OPTIONS.find((c) => c.id === content.type)?.icon || 'sparkles'} className="h-4 w-4 text-primary-600" />
          </div>
          <h3 className="font-display text-sm font-bold text-slate-900">{content.title}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-4 w-4 text-success-500" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            title="Save for later"
          >
            {saved ? <Check className="h-4 w-4 text-success-500" /> : <Bookmark className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setShowShare(!showShare)}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-primary-50 hover:text-primary-600"
            title="Share to social media"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            title="Download as file"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={onRegenerate}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            title="Regenerate"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showShare && (
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 animate-fade-in">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Share to Eventify's social accounts</p>
            <button onClick={() => setShowShare(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sharePlatforms.map((p) => (
              <button
                key={p.id}
                onClick={() => handleShare(p.id)}
                className={`flex items-center gap-2 rounded-xl bg-gradient-to-br ${p.color} px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105 ${sharedPlatform === p.id ? 'ring-2 ring-success-400 ring-offset-2' : ''}`}
              >
                <span className="text-base">{p.icon}</span>
                {sharedPlatform === p.id ? 'Shared!' : p.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">Posts to Eventify's bot accounts — not your personal accounts.</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
          {content.body}
        </pre>

        {content.hashtags.length > 0 && content.type !== 'hashtag-set' && content.type !== 'image-prompt' && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Suggested Hashtags</p>
            <div className="flex flex-wrap gap-1.5">
              {content.hashtags.map((tag, i) => (
                <span key={i} className="chip bg-secondary-50 text-secondary-700">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        )}

        {content.type !== 'image-prompt' && (
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">AI Image Prompt</p>
            <p className="text-xs leading-relaxed text-slate-600">{content.imagePrompt}</p>
          </div>
        )}
      </div>
    </div>
  );
}
