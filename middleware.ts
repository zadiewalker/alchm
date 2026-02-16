import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Static-export-safe middleware shim.
// Keeps middleware file present while avoiding missing internal dependencies.
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
