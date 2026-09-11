import type { EventDetails, ContentType, GeneratedContent, EventCategory, Tone, Platform, CodeLanguage } from '@/types';

const TONE_VOICE: Record<Tone, string> = {
  exciting: 'high-energy, enthusiastic, and vibrant',
  elegant: 'sophisticated, graceful, and refined',
  professional: 'polished, authoritative, and clear',
  playful: 'fun, lighthearted, and witty',
  luxurious: 'opulent, exclusive, and premium',
  casual: 'relaxed, friendly, and conversational',
  inspirational: 'uplifting, motivating, and heartfelt',
};

const CATEGORY_LABELS: Record<EventCategory, string> = {
  birthday: 'birthday celebration',
  wedding: 'wedding',
  'business-launch': 'business launch',
  conference: 'conference',
  party: 'party',
  charity: 'charity gala',
  custom: 'special event',
};

const PLATFORM_EMOJI: Record<Platform, string> = {
  instagram: '📸',
  facebook: '👍',
  twitter: '🐦',
  linkedin: '💼',
  tiktok: '🎵',
  email: '✉️',
};

function formatDate(dateStr: string): string {
  if (!dateStr) return 'the big day';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateHashtags(details: EventDetails): string[] {
  const tags: string[] = [];
  const categoryTagMap: Record<EventCategory, string[]> = {
    birthday: ['BirthdayBash', 'HappyBirthday', 'BirthdayParty', 'CelebrateLife', 'MilestoneBirthday'],
    wedding: ['WeddingDay', 'TieTheKnot', 'WeddingCelebration', 'ForeverAndAlways', 'I SaidYes'],
    'business-launch': ['ProductLaunch', 'BusinessLaunch', 'Innovation', 'GrandOpening', 'NewBeginnings'],
    conference: ['Conference2026', 'IndustryLeaders', 'NetworkingEvent', 'KnowledgeSharing', 'ProfessionalGrowth'],
    party: ['PartyTime', 'WeekendVibes', 'GoodTimes', 'PartyNight', 'LetsCelebrate'],
    charity: ['GiveBack', 'CharityGala', 'ForACause', 'MakingADifference', 'CommunityFirst'],
    custom: ['SpecialEvent', 'CelebrateTogether', 'MemorableMoments', 'EventOfTheYear', 'JoinUs'],
  };

  tags.push(...(categoryTagMap[details.category] || []));

  if (details.eventName) {
    const branded = details.eventName
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');
    if (branded) tags.push(`#${branded}`);
  }

  if (details.location) {
    const locTag = details.location.split(',')[0].trim().replace(/\s+/g, '');
    if (locTag) tags.push(`#${locTag}Events`);
  }

  if (details.keywords) {
    details.keywords.split(',').forEach((k) => {
      const tag = k.trim().replace(/\s+/g, '');
      if (tag && tag.length > 2) tags.push(`#${tag}`);
    });
  }

  return Array.from(new Set(tags)).slice(0, 15);
}

function generateSocialCaption(d: EventDetails): string {
  const tone = TONE_VOICE[d.tone];
  const date = formatDate(d.date);
  const hooks: Record<EventCategory, string[]> = {
    birthday: [
      `It's time to celebrate ${d.eventName || 'a special birthday'}! 🎂🎉`,
      `The countdown is ON for ${d.eventName || 'the ultimate birthday bash'}! 🎈✨`,
      `Get ready to party — ${d.eventName || 'a birthday celebration'} like no other! 🥳`,
    ],
    wedding: [
      `Two hearts, one love, one unforgettable day. 💍 ${d.eventName || 'Our Wedding'}`,
      `Join us as we say "I do" at ${d.eventName || 'our wedding'}! 🕊️`,
      `The day we've been dreaming of is almost here. ✨ ${d.eventName || 'Wedding Celebration'}`,
    ],
    'business-launch': [
      `Something big is here. ${d.eventName || 'Our new launch'} is officially live! 🚀`,
      `The wait is over — join us for ${d.eventName || 'our product launch'}! 💡`,
      `Innovation meets celebration at ${d.eventName || 'our business launch'}. 🎯`,
    ],
    conference: [
      `Ready to level up? ${d.eventName || 'Our conference'} brings you the best in the industry. 🎤`,
      `Knowledge. Networking. Growth. ${d.eventName || 'This conference'} has it all. 📈`,
      `Join the conversation at ${d.eventName || 'our upcoming seminar'}. 🧠`,
    ],
    party: [
      `The weekend is calling and ${d.eventName || 'this party'} is the answer! 🎶🔥`,
      `Good vibes only at ${d.eventName || 'the hottest party in town'}. 🪩`,
      `Grab your crew — ${d.eventName || 'the party of the year'} is here! 🎉`,
    ],
    charity: [
      `Make a difference with us at ${d.eventName || 'our charity gala'}. 🤝`,
      `Together we can create change. Join ${d.eventName || 'our fundraiser'}. 💚`,
      `An evening of elegance and purpose — ${d.eventName || 'our charity event'}. 🌟`,
    ],
    custom: [
      `You're invited to ${d.eventName || 'something special'}! 🎊`,
      `Don't miss out on ${d.eventName || 'this exciting event'}! ✨`,
      `Mark your calendars for ${d.eventName || 'an unforgettable experience'}. 📅`,
    ],
  };

  let caption = pick(hooks[d.category] || hooks.custom);
  caption += '\n\n';

  if (d.description) {
    caption += `${d.description}\n\n`;
  } else {
    caption += `Join ${d.hostName || 'us'} for an unforgettable ${CATEGORY_LABELS[d.category]} filled with great moments, amazing company, and memories to last a lifetime.\n\n`;
  }

  caption += `📅 When: ${date}\n`;
  if (d.location) caption += `📍 Where: ${d.location}\n`;
  if (d.audience) caption += `👥 Who: ${d.audience}\n`;

  caption += '\n';
  if (d.rsvpLink) {
    caption += `Reserve your spot now: ${d.rsvpLink} ${PLATFORM_EMOJI[d.platform]}\n`;
  } else {
    caption += `DM us to RSVP — spaces are limited! ${PLATFORM_EMOJI[d.platform]}\n`;
  }

  caption += `\nTone: ${tone}.`;

  return caption;
}

function generateEventDescription(d: EventDetails): string {
  const date = formatDate(d.date);
  const tone = TONE_VOICE[d.tone];

  let text = `${d.eventName || 'An Unforgettable Event'}\n\n`;

  text += `${d.hostName ? `Hosted by ${d.hostName}, ` : ''}this ${CATEGORY_LABELS[d.category]} promises to be a remarkable experience. `;
  text += `Scheduled for ${date}${d.location ? ` at ${d.location}` : ''}, the event brings together ${d.audience || 'a diverse audience'} for a day of connection, celebration, and inspiration.\n\n`;

  if (d.description) {
    text += `About This Event\n${d.description}\n\n`;
  } else {
    text += `About This Event\nThis event is designed to create lasting memories and meaningful connections. Whether you're joining us for the first time or returning for another great experience, you're in for something special.\n\n`;
  }

  text += `What to Expect\n`;
  text += `- A ${tone} atmosphere tailored for ${d.audience || 'all attendees'}\n`;
  text += `- Opportunities to connect and engage\n`;
  text += `- Unforgettable moments and experiences\n\n`;

  if (d.keywords) {
    text += `Highlights: ${d.keywords}\n\n`;
  }

  text += `Date & Time\n${date}\n\n`;
  if (d.location) text += `Location\n${d.location}\n\n`;
  if (d.rsvpLink) text += `Reserve Your Spot\n${d.rsvpLink}\n\n`;
  text += `Don't miss out — we can't wait to see you there!`;

  return text;
}

function generateInvitationText(d: EventDetails): string {
  const date = formatDate(d.date);
  const tone = TONE_VOICE[d.tone];

  let text = '';

  if (d.tone === 'elegant' || d.tone === 'luxurious') {
    text += `You are cordially invited to\n\n`;
    text += `${d.eventName || 'a celebration in your honor'}\n\n`;
  } else {
    text += `You're invited to ${d.eventName || 'a special celebration'}!\n\n`;
  }

  if (d.category === 'wedding') {
    text += `${d.hostName || 'We'} request the pleasure of your company as we celebrate our union.\n\n`;
  } else if (d.category === 'birthday') {
    text += `${d.hostName ? `${d.hostName} invites you to celebrate` : 'Come celebrate'} with us!\n\n`;
  } else {
    text += `${d.hostName ? `${d.hostName} warmly invites you to join us.` : 'We would love for you to join us.'}\n\n`;
  }

  if (d.description) {
    text += `${d.description}\n\n`;
  }

  text += `Date: ${date}\n`;
  if (d.location) text += `Venue: ${d.location}\n`;
  if (d.audience) text += `Dress Code: ${d.audience}\n`;

  text += `\n`;
  if (d.rsvpLink) {
    text += `Kindly RSVP by visiting: ${d.rsvpLink}\n`;
  } else {
    text += `Please RSVP to confirm your attendance.\n`;
  }

  text += `\nWe look forward to celebrating with you in a ${tone} setting.`;

  return text;
}

function generateEmailSubject(d: EventDetails): string {
  const subjects: string[] = [];
  const name = d.eventName || 'Our Upcoming Event';

  subjects.push(`You're Invited: ${name} — Save the Date!`);
  subjects.push(`${d.hostName ? d.hostName + ' Presents: ' : ''}${name}`);
  subjects.push(`Don't Miss ${name} — ${d.date ? formatDate(d.date) : 'Coming Soon'}`);
  subjects.push(`Exclusive Invite: ${name}`);
  subjects.push(`Last Chance to RSVP for ${name}!`);

  if (d.category === 'business-launch') {
    subjects.push(`Be First to Experience ${name}`);
    subjects.push(`The Wait is Over — ${name} is Here`);
  } else if (d.category === 'charity') {
    subjects.push(`Join Us in Making a Difference — ${name}`);
    subjects.push(`Your Invitation to ${name} — For a Cause`);
  }

  return subjects.join('\n');
}

function generateEmailBody(d: EventDetails): string {
  const date = formatDate(d.date);
  const tone = TONE_VOICE[d.tone];
  const subject = `You're Invited: ${d.eventName || 'Our Upcoming Event'}`;

  let body = `Subject: ${subject}\n\n`;
  body += `Dear ${d.audience || 'Friend'},\n\n`;

  body += `${d.hostName ? `${d.hostName} invites you` : 'We invite you'} to ${d.eventName || 'a special event'} — a ${tone} ${CATEGORY_LABELS[d.category]} that you won't want to miss.\n\n`;

  if (d.description) {
    body += `${d.description}\n\n`;
  } else {
    body += `This ${CATEGORY_LABELS[d.category]} is designed to create lasting memories and meaningful connections. Whether you're joining us for the first time or returning for another great experience, you're in for something special.\n\n`;
  }

  body += `Event Details\n`;
  body += `• Date: ${date}\n`;
  if (d.location) body += `• Location: ${d.location}\n`;
  if (d.audience) body += `• Who: ${d.audience}\n`;
  body += `\n`;

  if (d.rsvpLink) {
    body += `Reserve your spot now: ${d.rsvpLink}\n\n`;
  } else {
    body += `Please reply to this email to confirm your attendance — spaces are limited!\n\n`;
  }

  body += `We can't wait to celebrate with you!\n\n`;
  body += `Warm regards,\n`;
  body += `${d.hostName || 'The Event Team'}\n`;
  if (d.keywords) body += `\nKeywords: ${d.keywords}`;

  return body;
}

function generateEmailInvitation(d: EventDetails): string {
  const date = formatDate(d.date);
  const tone = TONE_VOICE[d.tone];
  const name = d.eventName || 'Our Upcoming Event';
  const host = d.hostName || 'The Event Team';

  const subjects = [
    `You're Invited: ${name} — Save the Date!`,
    `Exclusive Invitation: ${name}`,
    `${host} invites you to ${name}`,
  ];
  const subject = pick(subjects);

  let body = `Subject: ${subject}\n\n`;
  body += `Dear ${d.audience || 'Friend'},\n\n`;

  if (d.tone === 'elegant' || d.tone === 'luxurious') {
    body += `It is with great pleasure that ${host} cordially invites you to ${name}, a ${tone} ${CATEGORY_LABELS[d.category]}.\n\n`;
  } else {
    body += `${host} is thrilled to invite you to ${name} — a ${tone} ${CATEGORY_LABELS[d.category]} you won't want to miss!\n\n`;
  }

  if (d.description) {
    body += `${d.description}\n\n`;
  } else {
    body += `This ${CATEGORY_LABELS[d.category]} is designed to create lasting memories and meaningful connections. Whether you're joining us for the first time or returning for another great experience, you're in for something special.\n\n`;
  }

  body += `Event Details\n`;
  body += `• Date: ${date}\n`;
  if (d.location) body += `• Location: ${d.location}\n`;
  if (d.audience) body += `• Who: ${d.audience}\n`;
  body += `\n`;

  if (d.rsvpLink) {
    body += `Reserve your spot now: ${d.rsvpLink}\n\n`;
  } else {
    body += `Please reply to this email to confirm your attendance — spaces are limited!\n\n`;
  }

  body += `We can't wait to celebrate with you!\n\n`;
  body += `Warm regards,\n`;
  body += `${host}\n`;
  if (d.keywords) body += `\nKeywords: ${d.keywords}`;

  return body;
}

function generateEmailReminder(d: EventDetails): string {
  const date = formatDate(d.date);
  const tone = TONE_VOICE[d.tone];
  const name = d.eventName || 'Our Upcoming Event';
  const host = d.hostName || 'The Event Team';

  const subjects = [
    `Reminder: ${name} is almost here!`,
    `Don't Forget: ${name} — ${d.date ? formatDate(d.date) : 'Coming Soon'}`,
    `Last Reminder: ${name} is just days away!`,
  ];
  const subject = pick(subjects);

  let body = `Subject: ${subject}\n\n`;
  body += `Dear ${d.audience || 'Friend'},\n\n`;

  body += `This is a friendly reminder that ${name} is coming up on ${date}${d.location ? ` at ${d.location}` : ''}. We're so excited to see you there!\n\n`;

  if (d.description) {
    body += `Quick recap: ${d.description}\n\n`;
  }

  body += `Event Details\n`;
  body += `• Date: ${date}\n`;
  if (d.location) body += `• Location: ${d.location}\n`;
  if (d.audience) body += `• Who: ${d.audience}\n`;
  body += `\n`;

  body += `What to bring / prepare:\n`;
  body += `• Your confirmation (if you have an RSVP link, keep it handy)\n`;
  body += `• Any plus-ones you registered\n`;
  body += `• A great attitude — it's going to be a ${tone} event!\n\n`;

  if (d.rsvpLink) {
    body += `Need to update your RSVP? You can do so here: ${d.rsvpLink}\n\n`;
  } else {
    body += `If your plans have changed, please reply to this email so we can adjust.\n\n`;
  }

  body += `See you soon!\n\n`;
  body += `${host}\n`;

  return body;
}

function generateEmailFollowUp(d: EventDetails): string {
  const date = formatDate(d.date);
  const tone = TONE_VOICE[d.tone];
  const name = d.eventName || 'Our Recent Event';
  const host = d.hostName || 'The Event Team';

  const subjects = [
    `Thank You for Joining Us at ${name}!`,
    `A Special Thank You from ${host}`,
    `Recap: ${name} — What a Day!`,
  ];
  const subject = pick(subjects);

  let body = `Subject: ${subject}\n\n`;
  body += `Dear ${d.audience || 'Friend'},\n\n`;

  body += `Thank you so much for being part of ${name} on ${date}. Your presence made the event truly special, and we hope you had a wonderful time.\n\n`;

  if (d.description) {
    body += `Event recap: ${d.description}\n\n`;
  } else {
    body += `From the moments we shared to the connections we made, it was a ${tone} experience we won't soon forget. We're already looking forward to the next one!\n\n`;
  }

  body += `Highlights from the event:\n`;
  body += `• Amazing turnout and great energy from everyone who attended\n`;
  body += `• Memorable moments and meaningful conversations\n`;
  body += `• A ${tone} atmosphere that made the day unforgettable\n\n`;

  if (d.rsvpLink) {
    body += `Event photos & resources: ${d.rsvpLink}\n\n`;
  }

  body += `Stay Connected\n`;
  body += `We'd love to keep in touch! Follow us on social media for updates on future events, and don't hesitate to reach out if you have any feedback or questions.\n\n`;

  body += `Thank you once again for being part of ${name}. We can't wait to see you at the next one!\n\n`;
  body += `Warm regards,\n`;
  body += `${host}\n`;

  return body;
}

function generateImagePrompt(d: EventDetails): string {
  const tone = TONE_VOICE[d.tone];
  const categoryVisual: Record<EventCategory, string> = {
    birthday: 'festive birthday scene with colorful balloons, a beautifully decorated cake with lit candles, streamers, and a warm celebratory atmosphere',
    wedding: 'elegant wedding venue with white floral arrangements, soft candlelight, draped fabric, romantic ambiance, and a beautifully set reception table',
    'business-launch': 'modern product launch stage with dramatic spotlights, sleek display podiums, a tech-forward audience, and a large LED screen showing the brand logo',
    conference: 'professional conference hall with a speaker on stage, audience seated in rows, modern lighting, presentation slides, and an engaged crowd',
    party: 'vibrant nightclub party scene with colorful LED lights, a crowd dancing, confetti falling, DJ booth, and energetic atmosphere',
    charity: 'elegant charity gala venue with round tables, fine dining settings, warm golden lighting, a stage with a podium, and a sophisticated black-tie crowd',
    custom: 'a beautifully designed event space with tasteful decorations, warm lighting, and an inviting atmosphere',
  };

  let prompt = `A ${tone} ${categoryVisual[d.category] || categoryVisual.custom}. `;

  prompt += `The scene should feature ${d.location ? `a setting reminiscent of ${d.location}` : 'a versatile event space'}. `;
  prompt += `Color palette: ${d.keywords || 'rich, complementary tones that match the event theme'}. `;

  if (d.tone === 'luxurious' || d.tone === 'elegant') {
    prompt += `Style: photorealistic, cinematic lighting, shallow depth of field, premium editorial photography. `;
  } else if (d.tone === 'exciting' || d.tone === 'playful') {
    prompt += `Style: vibrant, high-saturation, dynamic composition, wide-angle, energetic. `;
  } else {
    prompt += `Style: clean, professional photography, balanced composition, natural lighting. `;
  }

  prompt += `Mood: ${tone}. `;
  prompt += `No text overlays, no watermarks. High resolution, 4K quality.`;

  return prompt;
}

export function generateContent(details: EventDetails, type: ContentType): GeneratedContent {
  let body = '';
  let title = '';
  const hashtags = generateHashtags(details);

  switch (type) {
    case 'social-caption':
      title = 'Social Media Caption';
      body = generateSocialCaption(details);
      break;
    case 'event-description':
      title = 'Event Description';
      body = generateEventDescription(details);
      break;
    case 'invitation-text':
      title = 'Invitation Text';
      body = generateInvitationText(details);
      break;
    case 'hashtag-set':
      title = 'Hashtag Set';
      body = `Branded Hashtags\n${hashtags.filter((_, i) => i < 5).join(' ')}\n\nEvent Type Hashtags\n${hashtags.filter((_, i) => i >= 5 && i < 10).join(' ')}\n\nLocation & Community\n${hashtags.filter((_, i) => i >= 10).join(' ')}`;
      break;
    case 'email-subject':
      title = 'Email Subject Lines';
      body = generateEmailSubject(details);
      break;
    case 'email-body':
      title = 'Email Body';
      body = generateEmailBody(details);
      break;
    case 'email-invitation':
      title = 'Email Invitation';
      body = generateEmailInvitation(details);
      break;
    case 'email-reminder':
      title = 'Email Reminder';
      body = generateEmailReminder(details);
      break;
    case 'email-followup':
      title = 'Email Follow-Up';
      body = generateEmailFollowUp(details);
      break;
    case 'image-prompt':
      title = 'AI Image Prompt';
      body = generateImagePrompt(details);
      break;
  }

  return {
    id: `content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title,
    body,
    hashtags,
    imagePrompt: generateImagePrompt(details),
    createdAt: Date.now(),
    eventDetails: { ...details },
  };
}

export function generateAllContent(details: EventDetails): GeneratedContent[] {
  const types: ContentType[] = ['social-caption', 'event-description', 'invitation-text', 'hashtag-set', 'email-subject', 'email-body', 'email-invitation', 'email-reminder', 'email-followup', 'image-prompt'];
  return types.map((t) => generateContent(details, t));
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function generateCodeSnippet(details: EventDetails, language: CodeLanguage): { title: string; description: string; code: string } {
  const name = details.eventName || 'Our Event';
  const date = formatDate(details.date);
  const location = details.location || 'TBA';
  const host = details.hostName || 'Event Team';
  const rsvp = details.rsvpLink || '#';
  const desc = details.description || `Join us for ${name}!`;

  switch (language) {
    case 'html':
      return {
        title: 'Event RSVP Page (HTML)',
        description: 'A standalone HTML page with an RSVP form for your event.',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(name)} — RSVP</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f8f9fc; margin: 0; padding: 2rem; }
    .card { max-width: 500px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .meta { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; }
    label { display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem; }
    input, textarea { width: 100%; padding: 0.625rem; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 1rem; font-size: 0.875rem; }
    button { width: 100%; padding: 0.75rem; background: #6366f1; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    button:hover { background: #4f46e5; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${esc(name)}</h1>
    <p class="meta">${esc(date)} · ${esc(location)} · Hosted by ${esc(host)}</p>
    <p>${esc(desc)}</p>
    <form action="${esc(rsvp)}" method="POST">
      <label for="name">Full Name</label>
      <input type="text" id="name" name="name" required>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>
      <label for="guests">Number of Guests</label>
      <input type="number" id="guests" name="guests" min="1" value="1">
      <label for="message">Message (optional)</label>
      <textarea id="message" name="message" rows="3"></textarea>
      <button type="submit">Confirm RSVP</button>
    </form>
  </div>
</body>
</html>`,
      };

    case 'react':
      return {
        title: 'Event RSVP Component (React)',
        description: 'A reusable React component with form state and validation for RSVPs.',
        code: `import { useState } from 'react';

interface RSVPFormProps {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  hostName: string;
  rsvpLink: string;
}

export function RSVPForm({ eventName, eventDate, eventLocation, hostName, rsvpLink }: RSVPFormProps) {
  const [form, setForm] = useState({ name: '', email: '', guests: 1, message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Thank you, {form.name}! Your RSVP for ${esc(name)} is confirmed.</h2>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto' }}>
      <h1>${esc(name)}</h1>
      <p>{eventDate} · {eventLocation} · Hosted by ${esc(host)}</p>
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" required />
      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
      <input type="number" min={1} value={form.guests} onChange={(e) => setForm({ ...form, guests: +e.target.value })} />
      <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message (optional)" />
      <button type="submit">Confirm RSVP</button>
    </form>
  );
}`,
      };

    case 'vue':
      return {
        title: 'Event RSVP Component (Vue 3)',
        description: 'A Vue 3 single-file component for an event RSVP form.',
        code: `<template>
  <div v-if="!submitted" class="rsvp-form">
    <h1>${esc(name)}</h1>
    <p>{{ eventDate }} · {{ eventLocation }} · Hosted by ${esc(host)}</p>
    <form @submit.prevent="handleSubmit">
      <input v-model="form.name" placeholder="Full Name" required />
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input v-model.number="form.guests" type="number" min="1" />
      <textarea v-model="form.message" placeholder="Message (optional)" />
      <button type="submit">Confirm RSVP</button>
    </form>
  </div>
  <div v-else class="confirmation">
    <h2>Thank you, {{ form.name }}! Your RSVP is confirmed.</h2>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const form = ref({ name: '', email: '', guests: 1, message: '' });
const submitted = ref(false);

const handleSubmit = () => { submitted.value = true; };
</script>`,
      };

    case 'python':
      return {
        title: 'Event Reminder Script (Python)',
        description: 'A Python script that sends event reminder emails via SMTP.',
        code: `import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta

EVENT = {
    "name": "${esc(name)}",
    "date": "${esc(details.date)}",
    "location": "${esc(location)}",
    "host": "${esc(host)}",
    "rsvp_link": "${esc(rsvp)}",
}

def send_reminder(recipient: str, sender: str, smtp_host: str = "smtp.gmail.com", smtp_port: int = 587):
    """Send an event reminder email to a recipient."""
    subject = f"Reminder: {EVENT['name']} is coming up!"
    body = (
        f"Hi!\\n\\n"
        f"This is a reminder for {EVENT['name']}.\\n"
        f"Date: {EVENT['date']}\\n"
        f"Location: {EVENT['location']}\\n"
        f"Host: {EVENT['host']}\\n\\n"
        f"RSVP here: {EVENT['rsvp_link']}\\n\\n"
        f"We can't wait to see you!"
    )
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = recipient

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(sender, "your-password")
        server.send_message(msg)
    print(f"Reminder sent to {recipient}")

if __name__ == "__main__":
    send_reminder("guest@example.com", "events@yourdomain.com")`,
      };

    case 'javascript':
      return {
        title: 'Event Countdown Widget (JavaScript)',
        description: 'A vanilla JS countdown timer you can embed on any event page.',
        code: `// Event Countdown Widget
// Embed in any page: <div id="countdown"></div>
const EVENT_DATE = new Date("${esc(details.date)}").getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = EVENT_DATE - now;

  if (diff <= 0) {
    document.getElementById("countdown").innerHTML = "<h2>The event is live!</h2>";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerHTML =
    \`<div style="display:flex;gap:1rem;text-align:center;font-family:system-ui">
      <div><div style="font-size:2rem;font-weight:bold">\${days}</div><div>Days</div></div>
      <div><div style="font-size:2rem;font-weight:bold">\${hours}</div><div>Hours</div></div>
      <div><div style="font-size:2rem;font-weight:bold">\${mins}</div><div>Minutes</div></div>
      <div><div style="font-size:2rem;font-weight:bold">\${secs}</div><div>Seconds</div></div>
    </div>\`;
}

setInterval(updateCountdown, 1000);
updateCountdown();`,
      };

    case 'css':
      return {
        title: 'Event Card Styles (CSS)',
        description: 'Premium CSS styles for an event invitation card.',
        code: `.event-card {
  max-width: 480px;
  margin: 2rem auto;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  box-shadow: 0 20px 60px rgba(99, 102, 241, 0.25);
  font-family: system-ui, sans-serif;
}

.event-card__header {
  padding: 2rem 2rem 1rem;
  text-align: center;
}

.event-card__title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
}

.event-card__meta {
  font-size: 0.875rem;
  opacity: 0.85;
  margin-top: 0.5rem;
}

.event-card__body {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem 2rem;
  backdrop-filter: blur(10px);
}

.event-card__button {
  display: block;
  width: 100%;
  padding: 0.875rem;
  background: #fff;
  color: #6366f1;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.event-card__button:hover {
  transform: scale(1.03);
}`,
      };

    case 'json':
      return {
        title: 'Event Data (JSON)',
        description: 'Structured JSON data for your event, ready for APIs and integrations.',
        code: `{
  "event": {
    "name": "${esc(name)}",
    "category": "${esc(details.category)}",
    "host": "${esc(host)}",
    "date": "${esc(details.date)}",
    "location": "${esc(location)}",
    "description": "${esc(desc)}",
    "audience": "${esc(details.audience)}",
    "tone": "${esc(details.tone)}",
    "rsvpLink": "${esc(rsvp)}",
    "keywords": ${JSON.stringify(details.keywords.split(',').map((k) => k.trim()).filter(Boolean))}
  },
  "metadata": {
    "createdAt": "${new Date().toISOString()}",
    "version": "1.0"
  }
}`,
      };
  }
}

export function generateSocialPost(details: EventDetails, platform: Platform): string {
  const caption = generateSocialCaption(details);
  const hashtags = generateHashtags(details);

  const platformPrefix: Record<Platform, string> = {
    instagram: '📸 Instagram Post',
    facebook: '👍 Facebook Post',
    twitter: '🐦 Twitter/X Post',
    linkedin: '💼 LinkedIn Post',
    tiktok: '🎵 TikTok Caption',
    email: '✉️ Email Newsletter',
  };

  let post = `${platformPrefix[platform]}\n\n${caption}\n\n`;
  post += hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ');

  return post;
}

interface ChatMessageLike {
  role: 'user' | 'assistant';
  text: string;
}

export function generateChatResponse(input: string, details: EventDetails, history: ChatMessageLike[]): string {
  const lower = input.toLowerCase();
  const tone = TONE_VOICE[details.tone];
  const date = formatDate(details.date);
  const name = details.eventName || 'your event';

  if (lower.includes('hashtag') || lower.includes('tag')) {
    const tags = generateHashtags(details);
    return `Here are some strategic hashtags for ${name}:\n\n${tags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}\n\nWould you like me to adjust the tone or add location-specific tags?`;
  }

  if (lower.includes('caption') || lower.includes('instagram') || lower.includes('post')) {
    return `Here's a ${tone} caption for ${name}:\n\n${generateSocialCaption(details)}\n\nWant me to make it shorter, more exciting, or adjust it for a different platform?`;
  }

  if (lower.includes('invit')) {
    return `Here's your invitation text:\n\n${generateInvitationText(details)}\n\nI can make it more formal, casual, or add specific details — just ask!`;
  }

  if (lower.includes('email')) {
    return `Here's a complete email for ${name}:\n\n${generateEmailBody(details)}\n\nWant me to adjust the subject line or tone?`;
  }

  if (lower.includes('description') || lower.includes('about')) {
    return `Here's a description for ${name}:\n\n${generateEventDescription(details)}\n\nI can make it shorter, more detailed, or change the tone.`;
  }

  if (lower.includes('image') || lower.includes('visual') || lower.includes('picture')) {
    return `Here's an AI image prompt for ${name}:\n\n${generateImagePrompt(details)}\n\nCopy this into the Image Generator tab to find matching visuals!`;
  }

  if (lower.includes('exciting') || lower.includes('energetic') || lower.includes('fun')) {
    const updated = { ...details, tone: 'exciting' as Tone };
    return `Here's a more exciting version:\n\n${generateSocialCaption(updated)}\n\nWant me to apply this tone to other content types too?`;
  }

  if (lower.includes('elegant') || lower.includes('formal') || lower.includes('sophisticated')) {
    const updated = { ...details, tone: 'elegant' as Tone };
    return `Here's a more elegant version:\n\n${generateSocialCaption(updated)}\n\nWant me to apply this tone to other content types too?`;
  }

  if (lower.includes('shorter') || lower.includes('short') || lower.includes('brief')) {
    const caption = generateSocialCaption(details);
    const short = caption.split('\n').slice(0, 4).join('\n');
    return `Here's a shorter version:\n\n${short}\n\nWant me to make it even more concise?`;
  }

  if (lower.includes('longer') || lower.includes('more detail') || lower.includes('elaborate')) {
    return `Here's a more detailed version:\n\n${generateEventDescription(details)}\n\nWant me to add specific sections or adjust the tone?`;
  }

  if (lower.includes('hello') || lower.includes('hi ') || lower === 'hi' || lower.includes('hey')) {
    return `Hello! I'm your AI content assistant. I can help you write captions, invitations, emails, descriptions, hashtags, and image prompts for ${name}. What would you like me to create?`;
  }

  if (lower.includes('thank')) {
    return `You're welcome! I'm here whenever you need more content for ${name}. Just ask me to write, adjust, or brainstorm anything event-related.`;
  }

  if (lower.includes('idea') || lower.includes('suggest') || lower.includes('brainstorm')) {
    const ideas = [
      `Create a countdown series — post daily updates building excitement for ${date}`,
      `Design a "behind the scenes" story showing preparations for ${name}`,
      `Run a giveaway post: "Tag a friend you'd bring to ${name}!"`,
      `Share a teaser video with event highlights and key details`,
      `Create a poll: "What are you most excited about at ${name}?"`,
    ];
    return `Here are 5 content ideas for ${name}:\n\n${ideas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}\n\nWant me to write any of these out for you?`;
  }

  return `I can help you with content for ${name}. Try asking me to:\n\n- "Write a caption for Instagram"\n- "Suggest hashtags"\n- "Create an invitation"\n- "Write an email"\n- "Make it more exciting"\n- "Give me content ideas"\n\nWhat would you like me to do?`;
}
