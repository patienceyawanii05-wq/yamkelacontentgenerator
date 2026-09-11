import { useState, useRef, useEffect, useMemo } from 'react';
import type { EventDetails, ContentType, GeneratedContent } from '@/types';
import { CONTENT_TYPE_OPTIONS, EVENT_CATEGORIES } from '@/data';
import { EventForm } from '@/components/EventForm';
import { ContentOutput } from '@/components/ContentOutput';
import { Icon } from '@/components/Icon';
import { generateContent, generateAllContent, generateChatResponse } from '@/lib/generator';
import { addToHistory, loadHistory, copyToClipboard, incrementStat } from '@/lib/storage';
import { Sparkles, Wand2, Layers, MessageSquare, Send, X, Search, Copy, Check, Clock } from 'lucide-react';

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

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export function Generator() {
  const [details, setDetails] = useState<EventDetails>(DEFAULT_DETAILS);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [generating, setGenerating] = useState(false);
  const [allContents, setAllContents] = useState<GeneratedContent[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [historyItems, setHistoryItems] = useState<GeneratedContent[]>([]);
  const [copiedHistId, setCopiedHistId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGenerate = (type: ContentType) => {
    setGenerating(true);
    setSelectedType(type);
    setShowAll(false);
    setTimeout(() => {
      const result = generateContent(details, type);
      setContent(result);
      addToHistory(result);
      incrementStat('textGenerated');
      incrementStat('promptsCreated');
      setGenerating(false);
    }, 600);
  };

  const handleGenerateAll = () => {
    setGenerating(true);
    setShowAll(true);
    setTimeout(() => {
      const results = generateAllContent(details);
      setAllContents(results);
      setContent(results[0]);
      setSelectedType(results[0].type);
      results.forEach((r) => addToHistory(r));
      incrementStat('textGenerated', results.length);
      incrementStat('promptsCreated', results.length);
      setGenerating(false);
    }, 800);
  };

  const handleRegenerate = () => {
    if (selectedType) handleGenerate(selectedType);
  };

  const handleSave = () => {
    setSavedCount((c) => c + 1);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: chatInput,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const response = generateChatResponse(chatInput, details, messages);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        text: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      const result = generateContent(details, 'social-caption');
      addToHistory(result);
      incrementStat('textGenerated');
      incrementStat('promptsCreated');
    }, 500);
  };

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return historyItems.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.body.toLowerCase().includes(q) ||
      item.eventDetails.eventName.toLowerCase().includes(q) ||
      item.eventDetails.description.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery, historyItems]);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) setHistoryItems(loadHistory());
    if (showSearch) setSearchQuery('');
  };

  const handleCopyHistory = (id: string, text: string) => {
    copyToClipboard(text).then(() => {
      setCopiedHistId(id);
      setTimeout(() => setCopiedHistId(null), 2000);
    }).catch(() => {});
  };

  const selectedCategory = EVENT_CATEGORIES.find((c) => c.id === details.category);

  return (
    <div className="mx-auto max-w-[1160px] animate-fade-in">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
            AI Text Generator
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the event details, choose a content type, and let AI craft professional content for you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSearch}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              showSearch
                ? 'bg-primary-50 text-primary-700 border border-primary-200'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {showSearch ? <><X className="h-3.5 w-3.5" /> Close Search</> : <><Search className="h-3.5 w-3.5" /> Search</>}
          </button>
          <button
            onClick={() => setChatMode(!chatMode)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              chatMode
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/20'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {chatMode ? <><X className="h-3.5 w-3.5" /> Exit Chat</> : <><MessageSquare className="h-3.5 w-3.5" /> Chat Mode</>}
          </button>
        </div>
      </div>

      {chatMode ? (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="card p-6 lg:sticky lg:top-20">
              <div className="mb-5 flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary-500" />
                <h2 className="font-display text-lg font-bold text-slate-900">Event Details</h2>
              </div>
              <EventForm details={details} onChange={setDetails} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="card flex h-[600px] flex-col overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-900">AI Assistant</h3>
                  <p className="text-xs text-slate-500">Ask me to write, tweak, or brainstorm content</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
                {messages.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                      <Sparkles className="h-8 w-8 text-primary-400" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-600">Start a conversation</p>
                    <p className="mt-1 max-w-xs text-xs text-slate-500">
                      Ask me to "write a caption for Instagram", "make it more exciting", "suggest a hashtag", or anything else about your event.
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {['Write a caption', 'Suggest hashtags', 'Make an invitation', 'Write an email'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setChatInput(s)}
                          className="chip border border-slate-200 bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="border-t border-slate-200 p-4">
                <div className="flex items-end gap-2">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={1}
                    placeholder="Ask AI to write or adjust content..."
                    className="input-field resize-none flex-1"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="btn-primary shrink-0 py-2.5"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="card p-6 lg:sticky lg:top-20">
              <div className="mb-5 flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary-500" />
                <h2 className="font-display text-lg font-bold text-slate-900">Event Details</h2>
              </div>
              <EventForm details={details} onChange={setDetails} />
            </div>
          </div>

          <div className="lg:col-span-3">
            {showSearch && (
              <div className="card mb-6 p-5 animate-fade-in">
                <div className="mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary-500" />
                  <h2 className="font-display text-lg font-bold text-slate-900">Search Content</h2>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your past generated content..."
                    className="input-field pl-11"
                    autoFocus
                  />
                </div>
                {searchQuery && searchResults.length === 0 && (
                  <p className="py-6 text-center text-sm text-slate-500">No results found. Try a different search term.</p>
                )}
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    {searchResults.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 transition-all hover:border-primary-200 hover:bg-primary-50/40">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                          <Clock className="h-4 w-4 text-primary-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-slate-700">{item.title}</p>
                            <span className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{item.body}</p>
                        </div>
                        <button
                          onClick={() => handleCopyHistory(item.id, item.body)}
                          className="shrink-0 rounded-lg bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-primary-100 hover:text-primary-600"
                          title="Copy"
                        >
                          {copiedHistId === item.id ? <Check className="h-3.5 w-3.5 text-success-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {!searchQuery && historyItems.length > 0 && (
                  <p className="text-xs text-slate-500">Start typing to search through {historyItems.length} saved items in your history.</p>
                )}
                {!searchQuery && historyItems.length === 0 && (
                  <p className="text-xs text-slate-500">No history yet. Generate some content first, then search through it here.</p>
                )}
              </div>
            )}

            <div className="card mb-6 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary-500" />
                  <h2 className="font-display text-lg font-bold text-slate-900">Content Types</h2>
                </div>
                <button
                  onClick={handleGenerateAll}
                  disabled={generating}
                  className="btn-primary py-2 text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {CONTENT_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleGenerate(opt.id as ContentType)}
                    disabled={generating}
                    className={`flex flex-col items-start gap-1.5 rounded-xl border-2 p-3 text-left transition-all disabled:opacity-50 ${
                      selectedType === opt.id
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${selectedType === opt.id ? 'bg-primary-100' : 'bg-slate-100'}`}>
                      <Icon name={opt.icon} className={`h-4 w-4 ${selectedType === opt.id ? 'text-primary-600' : 'text-slate-500'}`} />
                    </div>
                    <span className={`text-xs font-bold ${selectedType === opt.id ? 'text-primary-700' : 'text-slate-700'}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card overflow-hidden" style={{ minHeight: '400px' }}>
              {generating ? (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center">
                  <div className="relative">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary-500" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-500">Crafting your content...</p>
                </div>
              ) : showAll && allContents.length > 0 ? (
                <div className="flex flex-col">
                  <div className="flex gap-1 overflow-x-auto scrollbar-thin border-b border-slate-200 px-3 py-2">
                    {allContents.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setContent(c);
                          setSelectedType(c.type);
                        }}
                        className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          content?.id === c.id
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {c.title}
                      </button>
                    ))}
                  </div>
                  <ContentOutput content={content} onRegenerate={handleRegenerate} onSave={handleSave} />
                </div>
              ) : (
                <ContentOutput content={content} onRegenerate={handleRegenerate} onSave={handleSave} />
              )}
            </div>

            {selectedCategory && (
              <div className="card mt-6 p-5">
                <h3 className="mb-3 font-display text-sm font-bold text-slate-900">
                  {selectedCategory.label} — Image Inspiration
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {selectedCategory.gallery.map((img, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-xl">
                      <img
                        src={img}
                        alt={`${selectedCategory.label} inspiration ${i + 1}`}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Use these as visual references alongside your AI image prompt.
                </p>
              </div>
            )}

            {savedCount > 0 && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-success-50 px-4 py-2.5 text-sm font-medium text-success-700 animate-fade-in">
                <Sparkles className="h-4 w-4" />
                {savedCount} {savedCount === 1 ? 'piece of content' : 'pieces of content'} saved! View them in the Saved tab.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
