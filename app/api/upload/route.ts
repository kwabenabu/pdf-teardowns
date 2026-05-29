import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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

  const buffer = Buffer.from(await file.arrayBuffer());
  const pdfData = buffer.toString('base64');
  const filename = file.name;

  const teardown = await createTeardown({ title, description, date, filename, pdfData });

  return NextResponse.json({ ok: true, id: teardown.id });
}
