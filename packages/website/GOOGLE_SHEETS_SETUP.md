# Google Sheets Newsletter Setup

This guide explains how to set up the Google Sheets integration for the newsletter signup feature using Google Apps Script.

## Quick Setup (Recommended)

### 1. Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Click **+ New project**
3. Replace the default code with the code from `google-apps-script.js` file
4. Update the `SHEET_ID` in the script with your sheet ID: `1WOsnDCdyZhj4wL2MeD-IbM-UiSBJfo1MNSHNUoDtsLo`
5. Save the project (Ctrl/Cmd + S) and give it a name like "CACI Newsletter"

### 2. Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Type" and select **Web app**
3. Set the following:
   - **Description**: "CACI Newsletter API"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click **Deploy**
5. **Important**: Copy the Web app URL (it looks like `https://script.google.com/macros/s/...../exec`)

### 3. Set Environment Variable

Add this to your `.env.local` file:
```bash
GOOGLE_APPS_SCRIPT_URL=your_web_app_url_from_step_2
```

## Your Google Sheet Setup
1. Open your Google Sheet: [CACI Newsletter List](https://docs.google.com/spreadsheets/d/1WOsnDCdyZhj4wL2MeD-IbM-UiSBJfo1MNSHNUoDtsLo/edit?usp=sharing)
2. Make sure the first sheet is named "Sheet1" (or update the `SHEET_NAME` in the API code)
3. Optionally, add headers in row 1:
   - A1: "Email"
   - B1: "Timestamp" 
   - C1: "Source"

### Share Settings
The spreadsheet must be publicly readable for the API to work:
1. Click the **Share** button in your Google Sheet
2. Change access to "Anyone with the link can view"
3. Make sure the link sharing is set to "Viewer"

## 3. Environment Variables

Create a `.env.local` file in the website root with:

```bash
GOOGLE_SHEETS_API_KEY=your_api_key_from_step_1
```

## 4. Testing

### Test the API Endpoint
1. Start the development server: `npm run dev`
2. Check the health endpoint: `http://localhost:3000/api/newsletter`
3. You should see: `{"status":"ok","service":"CACI Newsletter API","configured":true}`

### Test the Newsletter Signup
1. Go to the website footer
2. Enter an email address in the newsletter signup form
3. Click "Get Updates"
4. Check your Google Sheet - a new row should appear with the email, timestamp, and source

## 5. Data Structure

Emails are stored in the following format:
- **Column A**: Email address
- **Column B**: ISO timestamp (when submitted)
- **Column C**: Source ("Website Signup")

## 6. Troubleshooting

### Common Issues

**API Error 403 (Forbidden)**
- Check that the Google Sheets API is enabled in your project
- Verify the API key is correct and has proper restrictions
- Ensure the sheet is publicly readable

**API Error 404 (Not Found)**
- Verify the Sheet ID in the URL is correct
- Check that the sheet name matches `SHEET_NAME` in the code

**"Newsletter service temporarily unavailable"**
- The `GOOGLE_SHEETS_API_KEY` environment variable is not set
- Check your `.env.local` file

### Debug Information

Check the server logs for detailed error messages when testing the newsletter signup.

## 7. Security Notes

- The API key is restricted to Google Sheets API only
- The sheet is read-only for the public (API can append data)
- Email addresses are stored securely in your private Google account
- No sensitive data is transmitted beyond email addresses