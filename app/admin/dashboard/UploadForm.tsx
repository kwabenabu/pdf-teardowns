'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="e.g. Apple 2023 Annual Report"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          placeholder="A brief summary of what this teardown covers."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
        <input
          id="pdf-file"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Teardown published successfully.</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
      >
        {loading ? 'Uploading…' : 'Publish Teardown'}
      </button>
    </form>
  );
}
