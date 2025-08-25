/**
 * Google Apps Script for CACI Newsletter
 * 
 * This script receives email submissions and adds them to a Google Sheet.
 * 
 * Setup Instructions:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this code
 * 4. Update the SHEET_ID below with your sheet ID
 * 5. Save and deploy as a web app
 * 6. Set permissions to "Anyone" and "Execute as: Me"
 * 7. Copy the web app URL to your .env.local as GOOGLE_APPS_SCRIPT_URL
 */

// Your Google Sheet ID from the URL
const SHEET_ID = '1WOsnDCdyZhj4wL2MeD-IbM-UiSBJfo1MNSHNUoDtsLo'
const SHEET_NAME = 'Sheet1' // Change this if your sheet has a different name

/**
 * Handle POST requests from the CACI website
 */
function doPost(e) {
  try {
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents)
    const email = data.email
    const timestamp = data.timestamp
    const source = data.source || 'Website Signup'
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Invalid email address'
        }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    
    // Open the spreadsheet and get the sheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID)
    const sheet = spreadsheet.getSheetByName(SHEET_NAME)
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      const newSheet = spreadsheet.insertSheet(SHEET_NAME)
      // Add headers
      newSheet.getRange(1, 1, 1, 3).setValues([['Email', 'Timestamp', 'Source']])
      sheet = newSheet
    }
    
    // Add the email to the sheet
    sheet.appendRow([email, timestamp, source])
    
    // Log the success
    console.log('Successfully added email to sheet:', email)
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Email added successfully',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON)
      
  } catch (error) {
    console.error('Error processing email signup:', error)
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      service: 'CACI Newsletter Google Apps Script',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
}

/**
 * Simple email validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Test function (you can run this manually to test)
 */
function testEmailAdd() {
  const testData = {
    email: 'test@example.com',
    timestamp: new Date().toISOString(),
    source: 'Manual Test'
  }
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  }
  
  const result = doPost(mockEvent)
  console.log(result.getContent())
}