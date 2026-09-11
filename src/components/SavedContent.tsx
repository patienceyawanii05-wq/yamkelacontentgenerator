import { useState, useEffect } from 'react';
import type { GeneratedContent } from '@/types';
import { CONTENT_TYPE_OPTIONS, EVENT_CATEGORIES } from '@/data';
import { Icon } from '@/components/Icon';
import { loadSavedContent, deleteContent, copyToClipboard, toggleHidden } from '@/lib/storage';
import { Trash2, Copy, Check, Bookmark, EyeOff, Eye } from 'lucide-react';

export function SavedContent() {
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    setContents(loadSavedContent());
  }, []);

  const handleDelete = (id: string) => {
    setContents(deleteContent(id));
  };

  const handleCopy = (id: string, text: string) => {
    copyToClipboard(text)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {});
  };

  const handleToggleHidden = (id: string) => {
    setContents(toggleHidden(id));
  };

  const visibleContents = contents.filter((c) => showHidden || !c.hidden);
  const hiddenCount = contents.filter((c) => c.hidden).length;

  if (contents.length === 0) {
    return (
      <div className="mx-auto max-w-[1160px] animate-fade-in">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
            Saved Content
          </h1>
          <p className="mt-1 text-sm text-slate-500">Your generated content, saved for quick access.</p>
        </div>
        <div className="card flex flex-col items-center justify-center p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Bookmark className="h-8 w-8 text-slate-400" />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-700">No saved content yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Generate content in the Generator and click the bookmark icon to save it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1160px] animate-fade-in">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
            Saved Content
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {visibleContents.length} {visibleContents.length === 1 ? 'item' : 'items'} saved.
          </p>
        </div>
        {hiddenCount > 0 && (
          <button
            onClick={() => setShowHidden(!showHidden)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50"
          >
            {showHidden ? <><Eye className="h-3.5 w-3.5" /> Show Visible Only</> : <><EyeOff className="h-3.5 w-3.5" /> Show Hidden ({hiddenCount})</>}
          </button>
        )}
      </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleContents.map((content) => {
            const cat = EVENT_CATEGORIES.find((c) => c.id === content.eventDetails.category);
            const typeOpt = CONTENT_TYPE_OPTIONS.find((c) => c.id === content.type);
            return (
              <div key={content.id} className={`card flex flex-col p-5 transition-all hover:shadow-md ${content.hidden ? 'opacity-50' : ''}`}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {cat && (
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${cat.gradient}`}>
                        <Icon name={cat.icon} className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-500">
                      {content.eventDetails.eventName || cat?.label || 'Event'}
                    </span>
                  </div>
                  <span className="chip bg-primary-50 text-primary-600">
                    <Icon name={typeOpt?.icon || 'sparkles'} className="h-3 w-3" />
                    {content.title}
                  </span>
                </div>

                <div className="mb-4 max-h-32 overflow-y-auto scrollbar-thin rounded-xl bg-slate-50 p-3">
                  <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-wrap line-clamp-5">
                    {content.hidden ? 'Content hidden' : content.body}
                  </p>
                </div>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => handleCopy(content.id, content.body)}
                    className="btn-secondary flex-1 py-2 text-xs"
                  >
                    {copiedId === content.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-success-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleToggleHidden(content.id)}
                    className="rounded-xl bg-slate-100 p-2.5 text-slate-500 transition-colors hover:bg-slate-200"
                    title={content.hidden ? 'Unhide' : 'Hide'}
                  >
                    {content.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(content.id)}
                    className="rounded-xl bg-error-50 p-2.5 text-error-500 transition-colors hover:bg-error-100"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {new Date(content.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            );
          })}
        </div>
    </div>
  );
}
