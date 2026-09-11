import { Sparkles, ArrowRight, Zap, Image, FileText, Hash } from 'lucide-react';
import { EVENT_CATEGORIES } from '@/data';
import { Icon } from '@/components/Icon';

interface HeroProps {
  onStart: () => void;
  onExplore: () => void;
}

export function Hero({ onStart, onExplore }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-white" />
      <div
        className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-secondary-200/30 to-primary-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute left-0 top-40 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-accent-200/20 to-primary-200/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary-500" />
            AI-powered content for every event
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-slate-900 text-balance animate-fade-in-up sm:text-5xl lg:text-6xl">
            Create stunning event content
            <span className="block bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              in seconds, not hours
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 animate-fade-in-up">
            From birthdays to business launches, EVENTIFY generates professional social media
            captions, event descriptions, invitations, hashtags, and AI image prompts — all tailored
            to your event and audience.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 animate-fade-in-up sm:flex-row">
            <button onClick={onStart} className="btn-primary w-full sm:w-auto">
              <Sparkles className="h-5 w-5" />
              Start Creating
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onExplore} className="btn-secondary w-full sm:w-auto">
              Explore Prompt Library
            </button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 animate-fade-in-up">
          {EVENT_CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={onStart}
              className="group relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-lg hover:ring-slate-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={cat.sampleImage}
                  alt={cat.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-1.5">
                  <Icon name={cat.icon} className="h-4 w-4 text-white" />
                  <span className="text-sm font-bold text-white">{cat.label}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeatureSection() {
  const features = [
    {
      icon: FileText,
      title: 'AI Text Generation',
      description: 'Generate captions, descriptions, invitations, and email content with a single click. Each piece is tailored to your event type, tone, and platform.',
    },
    {
      icon: Image,
      title: 'AI Image Prompts',
      description: 'Get detailed, ready-to-use prompts for AI image generators. Each prompt is crafted with lighting, composition, and mood direction.',
    },
    {
      icon: Hash,
      title: 'Smart Hashtag Sets',
      description: 'Automatically generate strategic hashtags grouped by branded, event-type, location, and trending categories for maximum reach.',
    },
    {
      icon: Zap,
      title: 'Prompt Library',
      description: 'Browse a curated library of proven prompt templates for every event type and content format. Use them as-is or customize.',
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to promote your event
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Powerful AI tools designed for young adults, small businesses, event planners, and organizations.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card p-6 transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/20">
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-slate-900">
              EVENTIFY
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Quick, creative, professional content for every event.
          </p>
        </div>
      </div>
    </footer>
  );
}
