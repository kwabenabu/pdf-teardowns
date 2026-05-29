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
    canvas.className = 'mx-auto rounded-sm shadow-[0_2px_16px_rgba(0,0,0,0.08)]';
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
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-red-400 font-sans">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => goToPage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="px-4 py-1.5 text-xs font-sans font-medium text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Prev
        </button>
        <span className="text-xs text-gray-400 font-sans tabular-nums">
          {currentPage} / {numPages}
        </span>
        <button
          onClick={() => goToPage(Math.min(numPages, currentPage + 1))}
          disabled={currentPage >= numPages}
          className="px-4 py-1.5 text-xs font-sans font-medium text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next →
        </button>
      </div>

      <div ref={canvasRef} className="py-10 px-6 bg-gray-50 min-h-96 overflow-x-auto" />
    </div>
  );
}
