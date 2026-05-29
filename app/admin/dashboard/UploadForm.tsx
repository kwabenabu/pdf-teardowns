'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const inputClass =
  'w-full border border-border bg-cream text-ink font-sans text-sm px-4 py-3 focus:outline-none focus:border-ink transition-colors placeholder-border';

const labelClass =
  'font-mono text-[10px] text-muted uppercase tracking-[0.2em] block mb-2';

export default function UploadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('date', date);
    form.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: form });

    if (res.ok) {
      setSuccess(true);
      setTitle('');
      setDescription('');
      setDate('');
      setFile(null);
      (document.getElementById('pdf-file') as HTMLInputElement).value = '';
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Upload failed.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputClass}
          placeholder="e.g. Apple 2023 Annual Report"
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="What does this teardown cover?"
        />
      </div>

      <div>
        <label className={labelClass}>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>PDF File</label>
        <div className="border border-border p-3 hover:border-ink transition-colors">
          <input
            id="pdf-file"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            className="w-full font-mono text-xs text-muted file:mr-4 file:py-1.5 file:px-4 file:border file:border-ink file:bg-cream file:text-ink file:font-mono file:text-xs file:uppercase file:tracking-wide file:cursor-pointer hover:file:bg-ink hover:file:text-cream file:transition-colors cursor-pointer"
          />
        </div>
      </div>

      {error && <p className="font-mono text-[10px] text-red-500 uppercase tracking-widest">{error}</p>}
      {success && <p className="font-mono text-[10px] text-green-600 uppercase tracking-widest">✦ Published successfully</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ink text-cream font-mono text-xs py-4 uppercase tracking-[0.2em] hover:bg-accent hover:text-ink transition-colors disabled:opacity-40"
      >
        {loading ? 'Uploading…' : 'Publish Teardown →'}
      </button>
    </form>
  );
}
