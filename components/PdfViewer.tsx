'use client';

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  return (
    <div className="w-full">
      <iframe
        src={url}
        className="w-full border-0"
        style={{ height: '90vh' }}
        title="PDF Viewer"
      />
      {/* Fallback for mobile browsers that don't render PDFs inline */}
      <div className="text-center py-3 border-t border-dashed border-border">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-muted hover:text-ink uppercase tracking-[0.2em] transition-colors"
        >
          Open PDF in new tab →
        </a>
      </div>
    </div>
  );
}
