import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const isLogout = req.nextUrl.searchParams.get('logout') === '1';

  if (isLogout) {
    const res = NextResponse.redirect(new URL('/admin', req.url));
    res.cookies.delete('admin_session');
    return res;
  }

  const body = await req.json();
  const password = body?.password ?? '';

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_session', 'authenticated', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  });
  return res;
}
