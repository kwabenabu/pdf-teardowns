import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile } from 'fs/promises';
import path from 'path';
import { createTeardown } from '@/lib/db';

function isAuthenticated(): boolean {
  return cookies().get('admin_session')?.value === 'authenticated';
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const title = form.get('title') as string;
  const description = form.get('description') as string;
  const date = form.get('date') as string;
  const file = form.get('file') as File;

  if (!title || !description || !date || !file) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are accepted.' }, { status: 400 });
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${timestamp}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let storedUrl: string;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob');
    const blob = await put(filename, buffer, { access: 'public' });
    storedUrl = blob.url;
  } else {
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(uploadPath, buffer);
    storedUrl = `/uploads/${filename}`;
  }

  const teardown = await createTeardown({ title, description, date, filename: storedUrl });

  return NextResponse.json({ ok: true, id: teardown.id });
}
