# ALCHM Split Deployment Authority

This release uses an intentional split deployment topology.

- Vercel hosts the exported Next.js web artifact.
- Firebase Functions own server-authoritative callable/API behavior, including Khepera gateway behavior and sensitive continuity transitions.
- Firestore rules own Firestore authorization.
- Firebase Hosting may redirect to the Vercel hosting authority, but it is not the runtime authority for application behavior.

Do not treat a static artifact alone as proof of server-authoritative Khepera,
privacy, export, deletion, or continuity behavior.

## 1) Deploy Next.js static artifact

```bash
export PATH="/usr/local/opt/node@22/bin:$PATH"
npm run build
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
- `OPENAI_API_KEY` (Firebase Functions/provider gateway only; never expose in client/static artifacts)

## 3) Validate the deployed server URL

```bash
curl -I https://your-app.vercel.app/
curl -I https://your-app.vercel.app/dashboard
curl -I https://your-app.vercel.app/
```

Expected:

- HTML routes return `200`
- Firebase callable Functions are validated through Firebase deployment evidence, not Vercel route existence.

## 4) Point Capacitor to the server URL

```bash
export PATH="/usr/local/opt/node@22/bin:$PATH"
npm run sync:ios
```

Then run from `ios/App/App.xcworkspace` in Xcode.
