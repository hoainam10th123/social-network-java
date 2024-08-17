import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });
    const allowRoles = ['admin', 'giangvien']

    // if (request.nextUrl.pathname.startsWith('/quantri')) {
    //     if (!token?.user.roles.some((r: string) => allowRoles.includes(r)))
    //         return NextResponse.rewrite(new URL('/errors/forbidden', request.url))
    // }
}