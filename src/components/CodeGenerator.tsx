import { useState } from 'react';
import type { EventDetails, CodeLanguage } from '@/types';
import { EventForm } from '@/components/EventForm';
import { generateCodeSnippet } from '@/lib/generator';
import { Code2, Copy, Check, Download, Wand2, Terminal } from 'lucide-react';
import { copyToClipboard, saveContent, incrementStat } from '@/lib/storage';

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

const LANGUAGES: { id: CodeLanguage; label: string; icon: string }[] = [
  { id: 'html', label: 'HTML', icon: '🌐' },
  { id: 'react', label: 'React', icon: '⚛️' },
  { id: 'vue', label: 'Vue', icon: '💚' },
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'javascript', label: 'JavaScript', icon: '📜' },
  { id: 'css', label: 'CSS', icon: '🎨' },
  { id: 'json', label: 'JSON', icon: '📦' },
];

export function CodeGenerator() {
  const [details, setDetails] = useState<EventDetails>(DEFAULT_DETAILS);
  const [language, setLanguage] = useState<CodeLanguage>('html');
  const [snippet, setSnippet] = useState<{ title: string; description: string; code: string } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const result = generateCodeSnippet(details, language);
      setSnippet(result);
      incrementStat('codeGenerated');
      incrementStat('promptsCreated');
      setGenerating(false);
    }, 500);
  };

  const handleCopy = () => {
    if (!snippet) return;
    copyToClipboard(snippet.code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  const handleDownload = () => {
    if (!snippet) return;
    const ext: Record<CodeLanguage, string> = {
      html: 'html', react: 'tsx', vue: 'vue', python: 'py', javascript: 'js', css: 'css', json: 'json',
    };
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-${language}.${ext[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!snippet) return;
    saveContent({
      id: `code-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: 'code-snippet',
      title: snippet.title,
      body: snippet.code,
      hashtags: [],
      imagePrompt: '',
      createdAt: Date.now(),
      eventDetails: { ...details },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-[1160px] animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          AI Code Generator
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Generate event RSVP pages, countdown timers, reminder scripts, and more — in 7 languages.
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

        <div className="lg:col-span-3">
          <div className="card mb-6 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary-500" />
              <h2 className="font-display text-lg font-bold text-slate-900">Choose a Language</h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                    language === lang.id
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{lang.icon}</span>
                  <span className={`text-xs font-bold ${language === lang.id ? 'text-primary-700' : 'text-slate-700'}`}>
                    {lang.label}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary mt-4 w-full py-3"
            >
              <Code2 className="h-4 w-4" />
              {generating ? 'Generating...' : 'Generate Code'}
            </button>
          </div>

          {snippet && !generating && (
            <div className="card overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-900">{snippet.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">{snippet.description}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={handleCopy} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="Copy code">
                    {copied ? <Check className="h-4 w-4 text-success-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button onClick={handleSave} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="Save">
                    {saved ? <Check className="h-4 w-4 text-success-500" /> : <Download className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="max-h-[500px] overflow-y-auto scrollbar-thin bg-slate-900 p-5">
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-100">
                  {snippet.code}
                </pre>
              </div>
            </div>
          )}

          {generating && (
            <div className="card flex min-h-[300px] flex-col items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary-500" />
              <p className="mt-4 text-sm font-medium text-slate-500">Writing your code...</p>
            </div>
          )}

          {!snippet && !generating && (
            <div className="card flex min-h-[300px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Code2 className="h-8 w-8 text-slate-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">
                Fill in your event details and pick a language to generate code
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
