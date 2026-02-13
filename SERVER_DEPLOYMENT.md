# ALCHM Server/API Deployment (Vercel)

This app now runs in **server/API mode**. Do not deploy static `out/` for iOS runtime.

## 1) Deploy Next.js server

```bash
export PATH="/usr/local/opt/node@22/bin:$PATH"
npx vercel login
npx vercel --prod
```

Use the resulting production URL (for example `https://your-app.vercel.app`).

## 2) Required environment variables (Vercel Project Settings)

Set these before production deploy:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_GROWTH_MONTHLY_PRICE_ID` (if pricing flow is used)
- `STRIPE_TRANSFORMATION_MONTHLY_PRICE_ID` (if pricing flow is used)

Optional:

- `FIREBASE_FUNCTIONS_URL` (defaults to `https://us-central1-alchm-digital-sanctuary.cloudfunctions.net`)
- `OPENAI_API_KEY` (only needed where AI analysis endpoint is enabled)

## 3) Validate the deployed server URL

```bash
curl -I https://your-app.vercel.app/
curl -I https://your-app.vercel.app/dashboard
curl -I https://your-app.vercel.app/api/community/create-story
```

Expected:

- HTML routes return `200`
- API routes return non-`404` status (often `405` for wrong method on `HEAD`, which is still valid existence)

## 4) Point Capacitor to the server URL

```bash
export PATH="/usr/local/opt/node@22/bin:$PATH"
export CAPACITOR_SERVER_URL="https://your-app.vercel.app"
npm run sync:ios:server
```

Then run from `ios/App/App.xcworkspace` in Xcode.

