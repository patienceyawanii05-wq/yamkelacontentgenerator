import { useState, useRef, useMemo } from 'react';
import { Copy, Download, Image as ImageIcon, Search, Sparkles, Wand2, Loader2, X, Check } from 'lucide-react';
import { copyToClipboard, incrementStat } from '@/lib/storage';
import { IMAGE_LIBRARY, type LibraryImage } from '@/lib/imageLibrary';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'with', 'and', 'for', 'of', 'to', 'in', 'on', 'at', 'is', 'are', 'be',
  'beautiful', 'warm', 'modern', 'vibrant', 'lighting', 'high', 'resolution', 'quality',
  'style', 'mood', 'scene', 'should', 'feature', 'palette', 'no', 'text', 'overlays',
  'watermarks', 'photorealistic', 'cinematic', 'premium', 'editorial', 'photography',
  'composition', 'shallow', 'depth', 'field', 'high-saturation', 'dynamic', 'wide-angle',
  'energetic', 'clean', 'professional', 'balanced', 'natural', 'create', 'original',
  'event', 'visual', 'inspired', 'by', 'image', 'picture', 'photo', 'generate',
  'matching', 'that', 'this', 'want', 'need', 'like', 'have', 'has', 'was', 'were',
  'will', 'would', 'could', 'should', 'about', 'into', 'from', 'your', 'you',
]);

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return words;
}

function scoreImage(image: LibraryImage, keywords: string[]): number {
  let score = 0;
  for (const kw of keywords) {
    for (const tag of image.tags) {
      if (tag === kw) score += 3;
      else if (tag.includes(kw) || kw.includes(tag)) score += 1;
    }
    if (image.title.toLowerCase().includes(kw)) score += 1;
  }
  return score;
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('A vibrant, modern birthday celebration with colorful balloons, a beautiful cake, warm lighting, and joyful guests');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<LibraryImage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!search) return IMAGE_LIBRARY.slice(0, 12);
    const kw = search.toLowerCase();
    return IMAGE_LIBRARY.filter((item) =>
      item.title.toLowerCase().includes(kw) ||
      item.tags.some((t) => t.includes(kw))
    );
  }, [search]);

  const handleGenerate = () => {
    setGenerating(true);
    setGenError(null);
    setGeneratedImages([]);

    setTimeout(() => {
      const keywords = extractKeywords(prompt);

      if (keywords.length === 0) {
        setGenError('Please provide a more descriptive prompt with specific keywords.');
        setGenerating(false);
        return;
      }

      const scored = IMAGE_LIBRARY
        .map((img) => ({ img, score: scoreImage(img, keywords) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map((item) => item.img);

      if (scored.length === 0) {
        setGenError('No images found matching your prompt. Try keywords like "birthday", "wedding", "conference", "party", "gala", or "festival".');
        setGenerating(false);
        return;
      }

      setGeneratedImages(scored);
      incrementStat('imagesGenerated', scored.length);
      setGenerating(false);
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 800);
  };

  const useImage = (url: string, title: string) => {
    setSelected(url);
    setPrompt(`Create an original event visual inspired by ${title.toLowerCase()}: ${prompt}`);
  };

  const copyPrompt = () => {
    void copyToClipboard(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadPrompt = () => {
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'event-image-prompt.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadImage = (url: string, title: string) => {
    fetch(url)
      .then((r) => r.blob())
      .then((blob) => {
        const objUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objUrl;
        link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
        link.click();
        URL.revokeObjectURL(objUrl);
      })
      .catch(() => {});
  };

  return (
    <div className="mx-auto max-w-[1160px] space-y-6 animate-fade-in">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">AI Image Generator</h2>
            <p className="text-sm text-slate-500">Describe the image you want and we'll find real, matching photos for you.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Describe the image you want</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="input-field resize-none leading-relaxed"
              placeholder="Describe your event image..."
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setPrompt((current) => `${current}, cinematic editorial photography, premium composition`)}
                className="chip bg-violet-50 text-violet-700"
              >
                <Sparkles className="h-3.5 w-3.5" /> Add cinematic style
              </button>
              <button
                onClick={() => setPrompt((current) => `${current}, square social media composition, no text overlays`)}
                className="chip bg-emerald-50 text-emerald-700"
              >
                Social-ready format
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-primary"
              >
                {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Wand2 className="h-4 w-4" /> Generate Image</>}
              </button>
              <button onClick={copyPrompt} className="btn-secondary">
                {copied ? <><Check className="h-4 w-4 text-success-500" /> Copied</> : <><Copy className="h-4 w-4" /> Copy prompt</>}
              </button>
              <button onClick={downloadPrompt} className="btn-secondary">
                <Download className="h-4 w-4" /> Save prompt
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600">Prompt preview</p>
            <div className="mt-4 max-h-[200px] overflow-y-auto scrollbar-thin rounded-xl border border-violet-200 bg-white/70 p-4">
              <p className="text-xs leading-relaxed text-slate-600">{prompt}</p>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              We extract keywords from your description and match them against a curated library of real event photos.
            </p>
          </div>
        </div>
      </div>

      {generating && (
        <div className="card flex min-h-[300px] flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary-500" />
          <p className="mt-4 text-sm font-medium text-slate-500">Finding images that match your prompt...</p>
        </div>
      )}

      {genError && !generating && (
        <div className="card flex flex-col items-center justify-center p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-error-50">
            <X className="h-6 w-6 text-error-500" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">{genError}</p>
        </div>
      )}

      {generatedImages.length > 0 && !generating && (
        <div ref={resultsSectionRef} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">Generated Images</h2>
              <p className="mt-1 text-sm text-slate-500">Real photos matching your prompt. Click "Use" to refine or download.</p>
            </div>
            <span className="chip bg-emerald-50 text-emerald-700">{generatedImages.length} results</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {generatedImages.map((img, i) => (
              <div key={`${img.url}-${i}`} className={`group relative overflow-hidden rounded-xl ${selected === img.url ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}>
                <img
                  src={img.url}
                  alt={img.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex w-full items-center justify-between p-3">
                    <button
                      onClick={() => useImage(img.url, img.title)}
                      className="rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-white"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => downloadImage(img.url, img.title)}
                      className="rounded-lg bg-white/90 p-1.5 text-slate-700 transition-colors hover:bg-white"
                      title="Download"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-2 pt-6 opacity-100 transition-opacity group-hover:opacity-0">
                  <p className="truncate text-xs font-semibold text-white">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">Browse visual inspiration</h2>
            <p className="mt-1 text-sm text-slate-500">Search through our curated library of real event imagery.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
              placeholder="Search birthday, wedding..."
            />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item, i) => (
            <button
              key={`${item.url}-${i}`}
              onClick={() => useImage(item.url, item.title)}
              className={`group relative overflow-hidden rounded-xl text-left ${selected === item.url ? 'ring-2 ring-violet-500 ring-offset-2' : ''}`}
            >
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3 pt-8">
                <p className="text-xs font-semibold text-white">{item.title}</p>
              </div>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-500">No inspiration found. Try "wedding", "party", "conference", "gala", or "festival".</p>
        )}
      </div>
    </div>
  );
}
