# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ALCHM is a trauma-informed, AI-powered journaling OS built with Next.js, Firebase, and Stripe. The application provides multilingual support and includes Firebase Functions for server-side operations.

## Development Commands

**Essential Commands:**
- `npm run dev` - Start development server (runs on localhost:3000)
- `npm run build` - Build production version
- `npm start` - Start production server on port 3001
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests (currently passes with no tests)
- `npm run test:e2e` - Run Playwright end-to-end tests

**Firebase Commands:**
- `npm run firebase:emulators` - Start Firebase emulators (Firestore, Functions, Auth)
- `npm run firebase:deploy` - Deploy to Firebase (hosting, functions, firestore)

**Quality Assurance:**
- `./prepublish-audit.sh` - Comprehensive pre-deployment audit script that cleans dependencies, fixes common issues, runs type checking, and builds the project

## Architecture

**Framework Stack:**
- Next.js 15 with App Router
- React 18 with TypeScript
- Tailwind CSS for styling
- Firebase (Firestore, Auth, Functions, Hosting)
- Stripe for payments

**Key Directories:**
- `src/app/` - Next.js App Router pages and layouts
- `src/app/[locale]/` - Internationalized routes (en, es, pt, ko, hi, de)
- `src/app/api/` - API routes (save, auth, stripe, khepera AI integration)
- `src/components/` - React components
- `src/lib/` - Utility libraries and configurations
- `functions/` - Firebase Functions

**Path Aliases (tsconfig.json):**
- `@/*` maps to `src/*`, `app/*`, `components/*`, `lib/*`
- `@/lib/*` maps to `src/lib/*`, `lib/*`
- `@/components/*` maps to `components/*`

**Firebase Configuration:**
- Client-side: `src/lib/firebase.ts` (Firestore client)
- Admin SDK: `src/lib/firebaseAdmin.ts` (server-side operations)
- Functions deployment configured in `firebase.json`

**Key Integrations:**
- Stripe payment processing (`src/lib/stripe.ts`)
- Session validation (`src/lib/validateSession.ts`)
- Journal data management (`src/lib/useJournals.ts`)

## Development Guidelines

**Firebase Functions Deployment:**
- Project uses `output: 'standalone'` for Firebase Functions compatibility
- Images are unoptimized for Firebase Functions environment
- Server components externalize firebase-admin package

**Environment Variables Required:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `STRIPE_SECRET_KEY`

**Code Quality:**
- TypeScript strict mode enabled
- ESLint configured with Next.js and core web vitals rules
- Node.js version constraint: >=18 <20

**Testing:**
- Jest configured for unit tests
- Playwright configured for E2E tests
- Run `prepublish-audit.sh` before deployments for comprehensive quality checks

## Deployment

The project is configured for Firebase Hosting with Functions. The audit script handles dependency cleanup, type checking, and build verification before deployment.