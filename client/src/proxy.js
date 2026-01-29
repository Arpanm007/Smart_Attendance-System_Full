import { NextResponse } from 'next/server';

export function proxy(request) {
    // 1. Extract the token from cookies using Next.js server-side API
    // This matches the 'token' name you set using Cookies.set('token', ...) in AuthContext
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // 2. Define your route logic
    const isProtectedRoute = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/attendance') ||
        pathname.startsWith('/subjects') ||
        pathname.startsWith('/profile');

    const isAuthRoute = pathname === '/login' || pathname === '/register';

    // 3. Scenario: User is not logged in but trying to access a dashboard page
    if (isProtectedRoute && !token) {
        // Redirect to login and remember where they were trying to go
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 4. Scenario: User IS logged in but trying to access the login page
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 5. Allow the request to proceed if none of the above match
    return NextResponse.next();
}

// 6. Matcher config: Prevents middleware from running on static assets/images
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};