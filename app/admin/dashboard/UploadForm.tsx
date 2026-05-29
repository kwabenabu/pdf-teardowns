'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition';

const labelClass =
  'block text-xs font-sans font-medium text-gray-500 uppercase tracking-wide mb-2';

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
    <form onSubmit={handleSubmit} className="space-y-5">
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
          placeholder="A brief summary of what this teardown covers."
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
        <div className="border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 transition">
          <input
            id="pdf-file"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            className="w-full text-sm font-sans text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-400 font-sans">{error}</p>}
      {success && (
        <p className="text-xs text-emerald-500 font-sans">Published successfully.</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-950 text-white py-3 rounded-xl text-sm font-sans font-medium hover:bg-gray-800 transition disabled:opacity-40"
      >
        {loading ? 'Uploading…' : 'Publish Teardown'}
      </button>
    </form>
  );
}
