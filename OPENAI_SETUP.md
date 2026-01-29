# OpenAI API Setup for ALCHM AI Analysis

## Prerequisites

1. OpenAI API Account: Sign up at https://platform.openai.com/
2. API Key: Generate an API key from your OpenAI dashboard
3. Billing: Ensure you have billing set up for API usage

## Configuration Steps

### 1. Set Environment Variable

Replace `YOUR_OPENAI_API_KEY_HERE` in the functions/.env file with your actual OpenAI API key:

```bash
cd functions
echo "OPENAI_API_KEY=REDACTED_API_KEY" > .env
```

**Important:** The functions have been deployed but will return fallback responses until a valid OpenAI API key is configured.

### 2. Deploy Firebase Functions

```bash
# Install dependencies and build
cd functions
npm install
npm run build

# Deploy to Firebase
cd ..
firebase deploy --only functions
```

### 3. Verify Deployment

**✅ Functions Successfully Deployed:**
- `aiAnalysis` - https://us-central1-alchm-digital-sanctuary.cloudfunctions.net/aiAnalysis
- `crisisDetection` - https://us-central1-alchm-digital-sanctuary.cloudfunctions.net/crisisDetection  
- `healthCheck` - https://us-central1-alchm-digital-sanctuary.cloudfunctions.net/healthCheck

Test health endpoint: `curl "https://us-central1-alchm-digital-sanctuary.cloudfunctions.net/healthCheck/health"`

### 4. Test the Integration

1. Start the development server: `npm run dev`
2. Navigate to the journal page
3. Create a journal entry
4. Verify AI analysis appears after saving

## API Endpoints

The deployed functions provide these endpoints:

- **Health Check**: `GET /health`
- **AI Analysis**: `POST /analyze` 
- **Crisis Detection**: `POST /crisis-detection`
- **User Analytics**: `GET /analytics/{userId}`

## Security Features

- Firebase Authentication required for all endpoints
- Rate limiting (10 AI requests per minute per user)
- User data isolation (users can only access their own data)
- Crisis event logging for monitoring
- Automatic fallback responses if API fails

## Monitoring

- Crisis events are logged to Firestore `crisisEvents` collection
- API usage is tracked in `rateLimits` collection
- Function logs are available in Firebase Console

## Troubleshooting

**"OpenAI API key not configured" error:**
- Verify the API key is set correctly in functions/.env
- Ensure the functions have been rebuilt and redeployed after setting the key

**"Authentication required" error:**
- Check that the user is logged in
- Verify Firebase Auth token is being sent with requests

**API timeouts:**
- Check your OpenAI account billing and usage limits
- Verify the API key has sufficient permissions

## Cost Considerations

- GPT-4o usage: ~$0.005-0.01 per journal analysis
- Budget for your expected usage volume
- Monitor costs in OpenAI dashboard

For technical support, check the Firebase Functions logs in the Firebase Console.