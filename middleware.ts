import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define your secret (make sure to set this in your environment variables)
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
    // Get token from the request
    const token = await getToken({ req, secret });

    const { pathname } = req.nextUrl;

    // Redirect if the user is not authenticated and trying to access restricted pages
    if ((pathname.startsWith('/Account') || pathname.startsWith('/Leaderboard') || pathname.startsWith('/Store') || pathname.startsWith('/Cart') || pathname.startsWith('/OrderHistory')) && !token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/Account', '/Leaderboard', '/Store', '/Cart', '/OrderHistory', '/api/:path*'],
};