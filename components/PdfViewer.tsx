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
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

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
    canvas.className = 'mx-auto block';
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
    return (
      <div className="flex items-center justify-center py-24 bg-cream">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 bg-cream">
        <p className="font-mono text-[10px] text-border tracking-[0.3em] uppercase animate-pulse">
          Loading document…
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cream">
      {/* Toolbar */}
      <div className="bg-ink px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => goToPage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="font-mono text-[10px] text-cream tracking-[0.2em] uppercase hover:text-accent disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <span className="font-mono text-[10px] text-muted tracking-[0.2em] uppercase tabular-nums">
          {currentPage} / {numPages}
        </span>
        <button
          onClick={() => goToPage(Math.min(numPages, currentPage + 1))}
          disabled={currentPage >= numPages}
          className="font-mono text-[10px] text-cream tracking-[0.2em] uppercase hover:text-accent disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>

      <div ref={canvasRef} className="py-10 px-6 bg-cream min-h-96 overflow-x-auto" />
    </div>
  );
}
