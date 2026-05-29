import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTeardownById, deleteTeardown } from '@/lib/db';
import { del } from '@vercel/blob';

function isAuthenticated(): boolean {
  return cookies().get('admin_session')?.value === 'authenticated';
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const teardown = await getTeardownById(id);
  if (!teardown) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Delete from Blob storage if it's a Blob URL
  if (teardown.filename.startsWith('https://')) {
    try {
      await del(teardown.filename);
    } catch {
      // Non-fatal: delete the DB record regardless
    }
  }

  await deleteTeardown(id);
  return NextResponse.json({ ok: true });
}
