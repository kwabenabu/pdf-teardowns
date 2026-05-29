'use client';

import { useEffect, useRef, useState } from 'react';

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const pdf = await pdfjsLib.getDocument(url).promise;
        if (cancelled) return;

        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        setLoading(false);
        renderPage(pdf, 1);
      } catch {
        if (!cancelled) setError('Failed to load PDF.');
      }
    }

    loadPdf();
    return () => { cancelled = true; };
  }, [url]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function renderPage(pdf: any, pageNum: number) {
    if (!canvasRef.current) return;

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    canvasRef.current.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.className = 'mx-auto shadow-md';
    canvasRef.current.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport }).promise;
  }

  async function goToPage(pageNum: number) {
    if (!pdfRef.current) return;
    setCurrentPage(pageNum);
    await renderPage(pdfRef.current, pageNum);
    canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">{error}</p>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-pulse text-gray-400">Loading PDF…</div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => goToPage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {numPages}
        </span>
        <button
          onClick={() => goToPage(Math.min(numPages, currentPage + 1))}
          disabled={currentPage >= numPages}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>

      <div ref={canvasRef} className="py-8 px-4 bg-gray-50 min-h-96" />
    </div>
  );
}
