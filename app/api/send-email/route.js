import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export const runtime = 'edge'; // Optional: Use edge runtime for better performance

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, html } = body;
    
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const result = await sendEmail({ to, subject, html });
    
    if (!result.success) {
      console.warn(`Email sending failed: ${result.error}`);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    // More detailed error logging for debugging deployment issues
    console.error('Email API error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { error: 'Failed to send email', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
