import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('session-token')?.value;

    if (pathname === '/login' && token) {
        if (await verifyJWT(token)) {
            return NextResponse.redirect(new URL('/dashboard/clients', request.url));
        }
    }

    if (pathname.startsWith('/dashboard')) {
        if (!token || !(await verifyJWT(token))) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
