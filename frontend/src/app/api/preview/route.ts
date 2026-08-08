import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'exit') {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('preview_mode');
    return response;
  }

  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set('preview_mode', 'true', { path: '/' });
  return response;
}
