import { useState } from 'react';
import type { EventDetails, ContentType, GeneratedContent } from '@/types';
import { EventForm } from '@/components/EventForm';
import { generateContent } from '@/lib/generator';
import { addToHistory, copyToClipboard, saveContent, incrementStat } from '@/lib/storage';
import { Mail, Bell, CornerUpLeft, Copy, Check, Download, Bookmark, Wand2, Send, Sparkles } from 'lucide-react';

const DEFAULT_DETAILS: EventDetails = {
  eventName: '',
  category: 'birthday',
  hostName: '',
  date: '',
  location: '',
  description: '',
  audience: '',
  tone: 'exciting',
  platform: 'email',
  keywords: '',
  rsvpLink: '',
};

const EMAIL_TYPES: { id: ContentType; label: string; icon: typeof Mail; description: string; gradient: string }[] = [
  { id: 'email-invitation', label: 'Invitation Email', icon: Mail, description: 'Send a complete invitation with subject line and body', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'email-reminder', label: 'Reminder Email', icon: Bell, description: 'Remind confirmed guests before the event', gradient: 'from-amber-500 to-orange-500' },
  { id: 'email-followup', label: 'Follow-Up Email', icon: CornerUpLeft, description: 'Thank guests and recap after the event', gradient: 'from-emerald-500 to-teal-500' },
];

export function EmailGenerator() {
  const [details, setDetails] = useState<EventDetails>(DEFAULT_DETAILS);
  const [selectedType, setSelectedType] = useState<ContentType>('email-invitation');
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const result = generateContent(details, selectedType);
      setContent(result);
      addToHistory(result);
      incrementStat('textGenerated');
      incrementStat('promptsCreated');
      setGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    if (!content) return;
    copyToClipboard(content.body)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  const handleSave = () => {
    if (!content) return;
    saveContent(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content.body], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-[1160px] animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          AI Email Generator
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create professional invitation, reminder, and follow-up emails for your events.
        </p>
      </div>

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

        <div className="lg:col-span-3 space-y-6">
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary-500" />
              <h2 className="font-display text-lg font-bold text-slate-900">Choose Email Type</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {EMAIL_TYPES.map((type) => {
                const Icon = type.icon;
                const isActive = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
                      isActive ? 'border-primary-400 bg-primary-50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${type.gradient} text-white shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className={`text-sm font-bold ${isActive ? 'text-primary-700' : 'text-slate-700'}`}>{type.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{type.description}</p>
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary mt-4 w-full py-3"
            >
              {generating ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Generating...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Generate Email</>
              )}
            </button>
          </div>

          {generating && (
            <div className="card flex min-h-[300px] flex-col items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary-500" />
              <p className="mt-4 text-sm font-medium text-slate-500">Writing your email...</p>
            </div>
          )}

          {content && !generating && (
            <div className="card overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                    <Mail className="h-4 w-4 text-primary-600" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-slate-900">{content.title}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={handleCopy} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700" title="Copy">
                    {copied ? <Check className="h-4 w-4 text-success-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button onClick={handleSave} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700" title="Save">
                    {saved ? <Check className="h-4 w-4 text-success-500" /> : <Bookmark className="h-4 w-4" />}
                  </button>
                  <button onClick={handleDownload} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700" title="Download">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-[500px] overflow-y-auto scrollbar-thin p-5">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
                  {content.body}
                </pre>
              </div>
            </div>
          )}

          {!content && !generating && (
            <div className="card flex min-h-[300px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Mail className="h-8 w-8 text-slate-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">
                Fill in your event details and choose an email type to generate
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
