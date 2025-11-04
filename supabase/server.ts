import { createServerClient } from '@supabase/ssr';

const headers = new Headers();

export function createServerSupabase(request: Request) {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get('Cookie');
          if (!cookieHeader) return [];
          
          // Parse all cookies from the Cookie header
          return cookieHeader.split(';').map(cookie => {
            const [name, ...valueParts] = cookie.trim().split('=');
            return {
              name,
              value: valueParts.join('=') // Handle values with '=' in them
            };
          });
        },
        setAll(cookiesToSet) {
          // Set multiple cookies at once
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookie = serializeCookie(name, value, options ?? {});
            headers.append('Set-Cookie', cookie);
          });
        },
      },
    }
  );
}

// Helper to serialize cookies
function serializeCookie(name: string, value: string, options: any = {}): string {
  const parts = [`${name}=${value}`];
  
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.domain) parts.push(`Domain=${options.domain}`);
  if (options.secure) parts.push('Secure');
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  
  return parts.join('; ');
}

// Export the headers for use in loaders/actions
export { headers };
