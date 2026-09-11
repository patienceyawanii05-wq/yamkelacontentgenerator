import { useState } from 'react';
import { PROMPT_LIBRARY, EVENT_CATEGORIES } from '@/data';
import type { EventCategory, ContentType } from '@/types';
import { Icon } from '@/components/Icon';
import { Search, Copy, Check, ArrowRight } from 'lucide-react';
import { copyToClipboard } from '@/lib/storage';

interface PromptLibraryProps {
  onUsePrompt: (prompt: string) => void;
}

export function PromptLibrary({ onUsePrompt }: PromptLibraryProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = PROMPT_LIBRARY.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesType = typeFilter === 'all' || item.contentType === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleCopy = (id: string, prompt: string) => {
    copyToClipboard(prompt)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {});
  };

  return (
    <div className="mx-auto max-w-[1160px] animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          Prompt Library
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Curated, proven prompt templates for every event type and content format.
        </p>
      </div>

        {/* Search + filters */}
        <div className="card mb-6 p-5">
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts by title, description, or tags..."
              className="input-field pl-11"
            />
          </div>

          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Event Type</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`chip border ${categoryFilter === 'all' ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  All Types
                </button>
                {EVENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`chip border ${categoryFilter === cat.id ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Icon name={cat.icon} className="h-3.5 w-3.5" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-slate-500">No prompts match your search. Try different keywords or filters.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const cat = EVENT_CATEGORIES.find((c) => c.id === item.category);
              return (
                <div key={item.id} className="card flex flex-col p-5 transition-all hover:shadow-md">
                  <div className="mb-3 flex items-center gap-2">
                    {cat && (
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${cat.gradient}`}>
                        <Icon name={cat.icon} className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-500">
                      {cat?.label}
                    </span>
                  </div>

                  <h3 className="mb-1.5 font-display text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mb-3 text-sm leading-relaxed text-slate-600">{item.description}</p>

                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="chip bg-slate-100 text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto rounded-xl bg-slate-50 p-3">
                    <p className="text-xs leading-relaxed text-slate-600 line-clamp-3">{item.prompt}</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleCopy(item.id, item.prompt)}
                      className="btn-secondary flex-1 py-2 text-xs"
                    >
                      {copiedId === item.id ? (
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
                      onClick={() => onUsePrompt(item.prompt)}
                      className="btn-primary flex-1 py-2 text-xs"
                    >
                      Use Prompt
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
