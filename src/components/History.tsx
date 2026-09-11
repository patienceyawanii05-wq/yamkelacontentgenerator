import { useState, useEffect } from 'react';
import type { GeneratedContent, ContentType } from '@/types';
import { CONTENT_TYPE_OPTIONS, EVENT_CATEGORIES } from '@/data';
import { Icon } from '@/components/Icon';
import { loadHistory, deleteHistoryItem, clearHistory, copyToClipboard, toggleHidden } from '@/lib/storage';
import { History as HistoryIcon, Search, Copy, Check, Trash2, Eraser, FileText, EyeOff, Eye } from 'lucide-react';

export function History() {
  const [items, setItems] = useState<GeneratedContent[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  const filtered = items.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.body.toLowerCase().includes(search.toLowerCase()) ||
      item.eventDetails.eventName.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesHidden = showHidden || !item.hidden;
    return matchesSearch && matchesType && matchesHidden;
  });

  const hiddenCount = items.filter((i) => i.hidden).length;

  const handleCopy = (id: string, text: string) => {
    copyToClipboard(text)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {});
  };

  const handleDelete = (id: string) => {
    setItems(deleteHistoryItem(id));
  };

  const handleToggleHidden = (id: string) => {
    setItems(items.map((item) => item.id === id ? { ...item, hidden: !item.hidden } : item));
    toggleHidden(id);
  };

  const handleClearAll = () => {
    clearHistory();
    setItems([]);
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const groupedByDate: Record<string, GeneratedContent[]> = {};
  filtered.forEach((item) => {
    const dateKey = new Date(item.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(item);
  });

  return (
    <div className="mx-auto max-w-[1160px] animate-fade-in">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
            History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Every piece of content you've generated, organized by date.
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            {hiddenCount > 0 && (
              <button
                onClick={() => setShowHidden(!showHidden)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50"
              >
                {showHidden ? <><Eye className="h-3.5 w-3.5" /> Show Visible Only</> : <><EyeOff className="h-3.5 w-3.5" /> Hidden ({hiddenCount})</>}
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:border-error-200 hover:bg-error-50 hover:text-error-600"
            >
              <Eraser className="h-3.5 w-3.5" />
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="card mb-6 p-5">
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event name, content title, or body text..."
            className="input-field pl-11"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTypeFilter('all')}
            className={`chip border ${typeFilter === 'all' ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            All Types
          </button>
          {CONTENT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTypeFilter(opt.id as ContentType)}
              className={`chip border ${typeFilter === opt.id ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              <Icon name={opt.icon} className="h-3.5 w-3.5" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <HistoryIcon className="h-8 w-8 text-slate-400" />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-700">
            {items.length === 0 ? 'No history yet' : 'No results found'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {items.length === 0
              ? 'Generate content and it will automatically appear here.'
              : 'Try a different search term or filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, dateItems]) => (
            <div key={date}>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{date}</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dateItems.map((content) => {
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

                      <div className="mt-auto flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <FileText className="h-3 w-3" />
                          {formatDate(content.createdAt)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(content.id, content.body)}
                            className="btn-secondary py-2 text-xs"
                          >
                            {copiedId === content.id ? (
                              <><Check className="h-3.5 w-3.5 text-success-500" /> Copied</>
                            ) : (
                              <><Copy className="h-3.5 w-3.5" /> Copy</>
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
