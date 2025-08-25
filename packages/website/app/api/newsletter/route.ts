import { NextRequest, NextResponse } from 'next/server'

// Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL

/**
 * POST /api/newsletter
 * Adds an email address to the Google Sheets newsletter list
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check if Google Apps Script is configured
    if (!GOOGLE_APPS_SCRIPT_URL) {
      return NextResponse.json(
        { error: 'Newsletter service is not configured. Please try again later.' },
        { status: 503 }
      )
    }

    const timestamp = new Date().toISOString()

    // Send to Google Apps Script
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          timestamp: timestamp,
          source: 'Website Signup'
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Google Apps Script error:', response.status, errorText)
        return NextResponse.json(
          { error: 'Failed to subscribe to newsletter. Please try again.' },
          { status: 500 }
        )
      }

      console.log('Successfully added email to Google Sheets:', email)

      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to newsletter',
        timestamp: timestamp
      })

    } catch (error) {
      console.error('Error calling Google Apps Script:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Newsletter API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/newsletter
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'CACI Newsletter API',
    configured: !!GOOGLE_APPS_SCRIPT_URL,
    message: GOOGLE_APPS_SCRIPT_URL 
      ? 'Google Sheets integration ready' 
      : 'Google Apps Script URL not configured'
  })
}