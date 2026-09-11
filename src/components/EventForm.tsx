import type { EventDetails, EventCategory, Tone, Platform } from '@/types';
import { EVENT_CATEGORIES, TONE_OPTIONS, PLATFORM_OPTIONS } from '@/data';
import { Icon } from '@/components/Icon';

interface EventFormProps {
  details: EventDetails;
  onChange: (details: EventDetails) => void;
}

export function EventForm({ details, onChange }: EventFormProps) {
  const update = <K extends keyof EventDetails>(key: K, value: EventDetails[K]) => {
    onChange({ ...details, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="label-text">Event Type</span>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => update('category', cat.id as EventCategory)}
              className={`flex items-center gap-2.5 rounded-xl border-2 px-3 py-3 text-left transition-all ${
                details.category === cat.id
                  ? 'border-primary-400 bg-primary-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${cat.gradient} shadow-sm`}
              >
                <Icon name={cat.icon} className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-bold ${details.category === cat.id ? 'text-primary-700' : 'text-slate-700'}`}>
                  {cat.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-text" htmlFor="eventName">Event Name</label>
          <input
            id="eventName"
            type="text"
            value={details.eventName}
            onChange={(e) => update('eventName', e.target.value)}
            placeholder="e.g. Sarah's 30th Birthday Bash"
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text" htmlFor="hostName">Host / Organizer</label>
          <input
            id="hostName"
            type="text"
            value={details.hostName}
            onChange={(e) => update('hostName', e.target.value)}
            placeholder="e.g. The Smith Family"
            className="input-field"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-text" htmlFor="date">Event Date</label>
          <input
            id="date"
            type="date"
            value={details.date}
            onChange={(e) => update('date', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text" htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={details.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="e.g. Grand Ballroom, NYC"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label-text" htmlFor="description">Event Description</label>
        <textarea
          id="description"
          value={details.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Tell us about your event — theme, activities, special details..."
          rows={3}
          className="input-field resize-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-text" htmlFor="audience">Target Audience</label>
          <input
            id="audience"
            type="text"
            value={details.audience}
            onChange={(e) => update('audience', e.target.value)}
            placeholder="e.g. Friends, family, colleagues"
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text" htmlFor="keywords">Keywords (comma-separated)</label>
          <input
            id="keywords"
            type="text"
            value={details.keywords}
            onChange={(e) => update('keywords', e.target.value)}
            placeholder="e.g. retro, neon, 80s"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <span className="label-text">Tone</span>
        <div className="flex flex-wrap gap-2">
          {TONE_OPTIONS.map((tone) => (
            <button
              key={tone.id}
              onClick={() => update('tone', tone.id as Tone)}
              className={`chip border ${
                details.tone === tone.id
                  ? 'border-primary-400 bg-primary-50 text-primary-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon name={tone.icon} className="h-3.5 w-3.5" />
              {tone.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="label-text">Primary Platform</span>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_OPTIONS.map((plat) => (
            <button
              key={plat.id}
              onClick={() => update('platform', plat.id as Platform)}
              className={`chip border ${
                details.platform === plat.id
                  ? 'border-secondary-400 bg-secondary-50 text-secondary-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon name={plat.icon} className="h-3.5 w-3.5" />
              {plat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-text" htmlFor="rsvpLink">RSVP / Booking Link (optional)</label>
        <input
          id="rsvpLink"
          type="text"
          value={details.rsvpLink}
          onChange={(e) => update('rsvpLink', e.target.value)}
          placeholder="e.g. https://your-rsvp-link.com"
          className="input-field"
        />
      </div>
    </div>
  );
}
