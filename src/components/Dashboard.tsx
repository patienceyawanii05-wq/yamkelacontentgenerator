import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  Code2,
  FileText,
  Grid2X2,
  Heart,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useState, useEffect, type ReactNode } from 'react';
import { loadStats, loadActivity, type GenerationStats, type SocialActivity } from '@/lib/storage';

interface DashboardProps {
  currentView: string;
  onNavigate: (view: string) => void;
  children?: ReactNode;
}

const tools = [
  { id: 'text', label: 'AI Text Generator', icon: FileText },
  { id: 'image', label: 'AI Image Generator', icon: ImageIcon },
  { id: 'code', label: 'AI Code Generator', icon: Code2 },
  { id: 'email', label: 'AI Email Generator', icon: Mail },
];

const manage = [
  { id: 'saved', label: 'Saved Content', icon: BookOpen },
  { id: 'library', label: 'Prompt Library', icon: BarChart3 },
  { id: 'social', label: 'Social Media Manager', icon: Share2 },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const allNavItems = [
  { id: 'dashboard', label: 'Dashboard' },
  ...tools.map((t) => ({ id: t.id, label: t.label })),
  ...manage.map((m) => ({ id: m.id, label: m.label })),
];

export function Dashboard({ currentView, onNavigate, children }: DashboardProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [stats, setStats] = useState<GenerationStats | null>(null);
  const [activities, setActivities] = useState<SocialActivity[]>([]);

  useEffect(() => {
    if (currentView === 'dashboard') {
      setStats(loadStats());
      setActivities(loadActivity());
    }
  }, [currentView]);

  const go = (view: string) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  const searchResults = searchQuery
    ? allNavItems.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearchNavigate = (id: string) => {
    go(id);
    setSearchQuery('');
    setSearchFocused(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-800">
      <aside className={`fixed inset-y-0 left-0 z-40 w-[248px] border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex h-[72px] items-center gap-3 border-b border-slate-100 px-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-display text-[16px] font-extrabold leading-none text-slate-900">EVENTIFY</p>
              <p className="mt-1 text-[10px] font-semibold tracking-wide text-primary-500">EVENT CONTENT STUDIO</p>
            </div>
          </div>

          <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-6">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Overview</p>
            <SidebarItem active={currentView === 'dashboard'} icon={LayoutDashboard} label="Dashboard" onClick={() => go('dashboard')} />

            <p className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">AI Tools</p>
            {tools.map((item) => <SidebarItem key={item.id} active={currentView === item.id} icon={item.icon} label={item.label} onClick={() => go(item.id)} />)}

            <p className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Manage</p>
            {manage.map((item) => <SidebarItem key={item.id} active={currentView === item.id} icon={item.icon} label={item.label} onClick={() => go(item.id)} />)}
          </nav>

          <div className="m-3 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-bold text-white">AI</div>
              <div><p className="text-xs font-bold text-slate-700">Pro Plan</p><p className="text-[10px] text-slate-500">Unlimited generations</p></div>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden" />}

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"><Menu className="h-5 w-5" /></button>
            <div><h1 className="font-display text-[22px] font-bold leading-tight text-slate-900">{currentView === 'dashboard' ? 'Dashboard' : viewLabel(currentView)}</h1><p className="hidden text-xs text-slate-500 sm:block">Your content creation overview</p></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 shadow-sm md:flex">
                <Search className="h-4 w-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  placeholder="Search pages..."
                  className="w-32 border-none bg-transparent p-0 text-xs text-slate-700 placeholder-slate-400 focus:outline-none md:w-40"
                />
              </div>
              {searchFocused && searchResults.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSearchNavigate(result.id)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <Search className="h-3.5 w-3.5 text-slate-400" />
                      {result.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 sm:block"><Moon className="h-4 w-4" /></button>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 text-sm font-bold text-white shadow-md shadow-primary-500/20">U</button>
          </div>
        </header>

        <main className="p-4 sm:p-7">{children || <DashboardContent onNavigate={onNavigate} stats={stats} activities={activities} />}</main>
      </div>
    </div>
  );
}

function SidebarItem({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof LayoutDashboard; label: string; onClick: () => void }) {
  return <button onClick={onClick} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-all ${active ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'}`}><Icon className="h-[17px] w-[17px]" />{label}</button>;
}

function DashboardContent({ onNavigate, stats, activities }: { onNavigate: (view: string) => void; stats: GenerationStats | null; activities: SocialActivity[] }) {
  const s = stats || { promptsCreated: 0, imagesGenerated: 0, codeGenerated: 0, textGenerated: 0, socialPosts: 0 };
  const platformColors: Record<string, string> = {
    instagram: 'from-pink-500 to-purple-500',
    facebook: 'from-blue-500 to-blue-600',
    twitter: 'from-slate-700 to-slate-900',
    linkedin: 'from-blue-600 to-blue-700',
    tiktok: 'from-slate-800 to-black',
    email: 'from-emerald-500 to-emerald-600',
  };
  const formatTimeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };
  return <div className="mx-auto max-w-[1160px] space-y-6 animate-fade-in">
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 px-7 py-7 text-white shadow-xl shadow-primary-500/15 sm:px-8 sm:py-8">
      <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-accent-300/20 blur-2xl" /><div className="absolute bottom-[-80px] left-1/3 h-48 w-48 rounded-full bg-secondary-300/20 blur-2xl" />
      <div className="relative max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm"><Sparkles className="h-3.5 w-3.5" /> AI-Powered Workspace</span><h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-[32px]">Create content at the speed of thought</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-50 sm:text-[15px]">Generate text, images, and event campaigns — all in one intelligent studio built for modern creators.</p></div>
      <button onClick={() => onNavigate('text')} className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary-700 shadow-lg transition-transform hover:scale-[1.02] sm:absolute sm:bottom-8 sm:right-8 sm:mt-0"><Sparkles className="h-4 w-4" /> Start Creating</button>
    </section>

    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      <StatCard value={String(s.promptsCreated)} label="Prompts Created" icon={BarChart3} tone="violet" /><StatCard value={String(s.imagesGenerated)} label="Images Generated" icon={ImageIcon} tone="emerald" /><StatCard value={String(s.codeGenerated)} label="Code Generated" icon={Code2} tone="amber" /><StatCard value={String(s.textGenerated)} label="Text Generated" icon={FileText} tone="pink" /><StatCard value={String(s.socialPosts)} label="Social Posts" icon={Share2} tone="violet" />
    </section>

    <section className="grid gap-6 xl:grid-cols-[350px_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><SectionHeading icon={User} title="Your Profile" /><div className="flex flex-col items-center text-center"><div className="mt-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 text-3xl font-bold text-white shadow-lg shadow-primary-500/25">Y</div><h3 className="mt-4 font-display text-lg font-bold text-slate-900">Yamkela Ntsewula</h3><p className="mt-1 text-xs text-slate-500">yamkellayawani06@gmail.com</p><p className="mt-4 text-sm italic leading-relaxed text-slate-500">"Got an idea? We'll make it memorable. From concept to celebration, we create events people don't forget."</p><button className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Settings className="h-3.5 w-3.5" /> Edit Profile</button></div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><SectionHeading icon={Sparkles} title="Quick Actions" subtitle="Jump into a generator" /><div className="mt-5 grid gap-3 sm:grid-cols-2"><ActionCard icon={FileText} color="pink" title="Generate Text" subtitle="Captions, invites & stories" onClick={() => onNavigate('text')} /><ActionCard icon={ImageIcon} color="emerald" title="Generate Image" subtitle="Event visuals & posters" onClick={() => onNavigate('image')} /><ActionCard icon={Code2} color="amber" title="Generate Code" subtitle="8 languages" onClick={() => onNavigate('code')} /><ActionCard icon={Mail} color="violet" title="Generate Email" subtitle="Invitations, reminders & follow-ups" onClick={() => onNavigate('email')} /><ActionCard icon={BarChart3} color="violet" title="Manage Prompts" subtitle="Reuse & organize" onClick={() => onNavigate('library')} /></div></div>
    </section>

    {activities.length > 0 && (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-600"><Share2 className="h-4.5 w-4.5" /></div>
            <div><h2 className="font-display text-[16px] font-bold text-slate-900">Recent Activity</h2><p className="text-xs text-slate-500">Latest posts from Eventify's social accounts</p></div>
          </div>
          <button onClick={() => onNavigate('social')} className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700">View all <ArrowRight className="h-3.5 w-3.5" /></button>
        </div>
        <div className="space-y-3">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 transition-all hover:border-slate-200 hover:bg-slate-50">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${platformColors[act.platform] || platformColors.instagram} text-base`}>{act.botAvatar}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">{act.botHandle}</span>
                  <span className="text-xs text-slate-400">{formatTimeAgo(act.postedAt)}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">{act.content}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {act.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {act.comments}</span>
                  <span className="flex items-center gap-1"><Share2 className="h-3 w-3" /> {act.shares}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}
  </div>;
}

function StatCard({ value, label, icon: Icon, tone }: { value: string; label: string; icon: typeof BarChart3; tone: string }) { const tones: Record<string, string> = { violet: 'bg-primary-100 text-primary-600', emerald: 'bg-emerald-100 text-emerald-600', amber: 'bg-amber-100 text-amber-600', pink: 'bg-pink-100 text-pink-600' }; return <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></div><p className="mt-4 font-display text-3xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p><div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-slate-50" /></div> }
function SectionHeading({ icon: Icon, title, subtitle }: { icon: typeof User; title: string; subtitle?: string }) { return <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-600"><Icon className="h-4.5 w-4.5" /></div><div><h2 className="font-display text-[16px] font-bold text-slate-900">{title}</h2>{subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}</div></div> }
function ActionCard({ icon: Icon, color, title, subtitle, onClick }: { icon: typeof FileText; color: string; title: string; subtitle: string; onClick: () => void }) { const colors: Record<string, string> = { pink: 'bg-pink-100 text-pink-600', emerald: 'bg-emerald-100 text-emerald-600', amber: 'bg-amber-100 text-amber-600', violet: 'bg-primary-100 text-primary-600' }; return <button onClick={onClick} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition-all hover:border-primary-200 hover:bg-primary-50/40"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-700">{title}</p><p className="mt-0.5 truncate text-xs text-slate-500">{subtitle}</p></div><ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary-500" /></button> }
function viewLabel(view: string) { const labels: Record<string, string> = { text: 'AI Text Generator', image: 'AI Image Generator', code: 'AI Code Generator', email: 'AI Email Generator', library: 'Prompt Library', saved: 'Saved Content', social: 'Social Media Manager', history: 'History', settings: 'Settings' }; return labels[view] || 'Dashboard'; }
