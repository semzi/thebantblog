import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://blog.tikianaly.com';
  
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /signin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

