import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'generator', label: 'Generator' },
    { id: 'library', label: 'Prompt Library' },
    { id: 'saved', label: 'Saved' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
            EVENTIFY
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                currentView === item.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <button onClick={() => onNavigate('generator')} className="btn-primary py-2.5 text-sm">
            <Sparkles className="h-4 w-4" />
            Create Content
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                className={`rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-all ${
                  currentView === item.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('generator');
                setMobileOpen(false);
              }}
              className="btn-primary mt-2 py-2.5 text-sm"
            >
              <Sparkles className="h-4 w-4" />
              Create Content
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
