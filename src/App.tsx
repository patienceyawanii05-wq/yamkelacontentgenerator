import { useState, type ReactNode } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { Generator } from '@/components/Generator';
import { ImageGenerator } from '@/components/ImageGenerator';
import { CodeGenerator } from '@/components/CodeGenerator';
import { EmailGenerator } from '@/components/EmailGenerator';
import { SocialMediaManager } from '@/components/SocialMediaManager';
import { PromptLibrary } from '@/components/PromptLibrary';
import { SavedContent } from '@/components/SavedContent';
import { History } from '@/components/History';
import { Sparkles } from 'lucide-react';

function App() {
  const [view, setView] = useState('dashboard');
  const navigate = (nextView: string) => { setView(nextView); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  let content: ReactNode = null;

  if (view === 'dashboard') content = null;
  else if (view === 'text') content = <Generator />;
  else if (view === 'image') content = <ImageGenerator />;
  else if (view === 'code') content = <CodeGenerator />;
  else if (view === 'email') content = <EmailGenerator />;
  else if (view === 'social') content = <SocialMediaManager />;
  else if (view === 'library') content = <PromptLibrary onUsePrompt={() => navigate('text')} />;
  else if (view === 'saved') content = <SavedContent />;
  else if (view === 'history') content = <History />;
  else if (view === 'settings') content = <Placeholder title="Settings" description="Manage your studio preferences and creative profile." />;

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Dashboard currentView={view} onNavigate={navigate}>
        {content}
      </Dashboard>
    </div>
  );
}

function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-[1160px] animate-fade-in">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100">
          <Sparkles className="h-8 w-8 text-primary-500" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">{description}</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold text-primary-600">Coming soon</span>
      </div>
    </div>
  );
}

export default App;
