import { NextRequest, NextResponse } from 'next/server';
import { getPdfData } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return new NextResponse('Not found', { status: 404 });

  const base64 = await getPdfData(id);
  if (!base64) return new NextResponse('Not found', { status: 404 });

  const buffer = Buffer.from(base64, 'base64');

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
