import { NextResponse } from 'next/server';

export async function GET() {
  const isConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_ID.trim().length > 5 &&
      !process.env.GOOGLE_CLIENT_ID.includes('placeholder')
  );

  return NextResponse.json({
    configured: isConfigured,
  });
}
