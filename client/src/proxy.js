import { NextResponse } from 'next/server';

export function proxy(request) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isProtectedRoute = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/attendance') ||
        pathname.startsWith('/subjects') ||
        pathname.startsWith('/profile');

    const isAuthRoute = pathname === '/login' || pathname === '/register';

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};