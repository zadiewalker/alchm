# ALCHM Gamification System v2.0 - Specification

*Trauma-informed engagement mechanics aligned with SAMHSA 4Rs and "Reclaim your resilience" positioning*

## North Star Metrics

- **Primary**: Weekly Reflection Completions per DAU (WRC/DAU) ↑ 
- **Retention**: D7 ≥ 70%
- **Monetization**: Premium conversion ≥ 20%

## Design Principles

### Non-Negotiables
- **Private by default**: All sharing is opt-in
- **No streak shaming**: Grace days and pause options always available
- **Transparent AI**: Users understand how insights are generated
- **Cultural fluency**: Inclusive language and diverse perspectives
- **Grace over perfection**: "You're still here. That's the win."

### Tone & Voice
- **Badass, affirming, never clinical**
- Examples: "Still Here", "Chaos → Clarity", "Soft but Strong"
- Celebration messages: "You showed up for yourself. That takes courage."

## Core Mechanics

### 1. Grace-Based Streaks ✅ IMPLEMENTED

**Concept**: Streaks with compassionate flexibility
- Streaks accrue once/day for journaling or voice notes
- 2 "grace tokens" per week - breaks don't reset streak if tokens available
- Missed days without grace tokens become "Recovery Multipliers" (1.5x XP for next 2 entries)

**Copy Examples**:
- First entry: "You showed up. That's the win."
- Grace day used: "Grace day used. You're still here."
- Return after break: "Welcome back. Survival counts. Your next entries get bonus XP."

**Implementation Status**: ✅ Complete
- Cloud Function: `updateGraceStreak` triggers on journal entry
- React Hook: `useStreaks()` manages state and messaging
- Component: `StreakDisplay` with pause/resume options

### 2. Reflection Quests (5-minute runs) ✅ IMPLEMENTED

**Concept**: Guided 3-step micro-reflections
- Rotating themes: "Name It → Feel It → Reframe It"
- Never prescriptive; reflective mirroring only
- Always includes "I need a pause" button

**Quest Themes**:
1. **Name → Feel → Reframe**: Transform difficult experiences
2. **Past → Present → Future**: Connect timeline with wisdom
3. **Fear → Courage → Action**: Transform fear into fuel

**Implementation Status**: ✅ Complete
- Cloud Functions: `completeQuestStep`, `pauseQuest`
- Component: `QuestRunner` with full 3-step flow
- Rewards: 75 XP + micro-badges for completion

### 3. Badge Trees & Seasons ✅ IMPLEMENTED

**Concept**: Evolving badge families with seasonal themes
- Core badge trees: Presence, Insight, Resilience
- Each tree has 3 levels (I, II, III)
- Clear, non-pressuring copy focused on growth

**Badge Trees**:

#### Presence Tree
- **Still Here I**: "You showed up. That's the win." (1 entry)
- **Still Here II**: "Three days of showing up for yourself." (3-day streak)  
- **Still Here III**: "A week of presence. Consistency is your superpower." (7-day streak)

#### Insight Tree  
- **Chaos → Clarity I**: "Found signal in the noise." (5 quests completed)
- **Chaos → Clarity II**: "Patterns emerging from the storm." (15 quests completed)
- **Chaos → Clarity III**: "Master of making sense from chaos." (50 quests completed)

#### Resilience Tree
- **Soft but Strong I**: "Vulnerability as strength discovered." (Emotional breakthrough detected)
- **Soft but Strong II**: "Compassion for self, boundaries with others." (Self-care patterns identified)
- **Soft but Strong III**: "Embodying gentle power." (30-day streak achievement)

**Implementation Status**: ✅ Complete
- Component: `BadgeTree` with visual progress tracking
- Cloud Functions: `awardGraceBadge` with trauma-informed messaging
- Firebase Rules: Secure badge storage

### 4. Community Challenges (Anonymized) 🚧 PARTIAL

**Concept**: Weekly themes with privacy-first participation
- Anonymous aliases (User✶1234)
- Macro trends only, never personal journals
- Rewards are titles/frames, not personal data

**Example Challenges**:
- "Gratitude Week": Log daily gratitudes
- "Boundaries SZN": Practice boundary-setting
- "Inner Voice Week": Trust your instincts

**Implementation Status**: 🚧 Backend complete, UI pending
- Cloud Functions: `joinChallenge` with alias generation
- Firebase Rules: Public challenge data, private participation
- **TODO**: Create `ChallengeBoard.tsx` component

### 5. Purpose Résumé Progression 🚧 PARTIAL

**Concept**: Every badge contributes to exportable growth portfolio
- Milestones auto-compose achievement bullet points
- Example: "Practiced boundary setting 4× this week"
- Exportable for job applications, therapy, personal use

**Implementation Status**: 🚧 Backend complete, UI pending
- Cloud Functions: `updateGrowthPortfolio` builds résumé
- **TODO**: Create portfolio export and display UI

### 6. Ritual Packs (Limited Drops) ❌ NOT IMPLEMENTED

**Concept**: Time-boxed prompt collections
- Examples: "IKIGAI Explorer", "Future Vision", "Alchemy of Depression"
- Completing pack yields collectible frame
- Creates urgency without FOMO panic

**Implementation Status**: ❌ Not started
- **TODO**: Design pack structure and completion tracking
- **TODO**: Create limited-time availability system

### 7. Referral Trials + Golden Tickets 🚧 PARTIAL

**Concept**: Social sharing with premium trials
- Invite 3 friends → 7-day Tier 2 trial
- 500-seat beta cap with live counter
- Never creates panic, always allows opt-out

**Implementation Status**: 🚧 Legacy system exists, needs v2.0 update
- Existing: Basic referral tracking in `gamification.ts`
- **TODO**: Update to new grace-based reward system
- **TODO**: Beta cap banner component

### 8. Khepera Archetypes ❌ NOT IMPLEMENTED

**Concept**: Choose reflective AI personality
- Options: Sage, Coach, Poet
- Only changes tone of mirroring, not outcomes
- Never creates pressure or judgment

**Implementation Status**: ❌ Not started
- **TODO**: Design archetype selection system
- **TODO**: Integrate with AI response generation

### 9. Shareable Reflection Receipts 🚧 PARTIAL

**Concept**: Privacy-safe social sharing
- No journal text content, only vibes + badges
- Example: "Soft but Strong ✺ day 3"
- Default OFF, always opt-in

**Implementation Status**: 🚧 Data structure exists, UI pending
- TypeScript: `ReflectionReceipt` interface defined
- **TODO**: Create `ShareCard.tsx` component
- **TODO**: Social media integration

### 10. Kindness Breaks & "Pause the Ritual" ✅ IMPLEMENTED

**Concept**: Always offer escape with grace
- "I need a pause" button in every interaction
- Streak preservation during breaks
- "Still Here" badge awarded on return

**Implementation Status**: ✅ Complete
- Cloud Functions: `requestKindnessBreak`, `returnFromKindnessBreak`
- UI: Integrated into `StreakDisplay` and `QuestRunner`
- Anti-shame messaging throughout

## Technical Architecture

### Data Models (TypeScript)
- **Complete**: `/src/types/gamification.ts` with full type definitions
- **Firestore Collections**: Properly structured with privacy controls
- **Security Rules**: Updated in `firestore.rules`

### Cloud Functions (Firebase)
```javascript
// Core gamification functions
- updateGraceStreak: Grace-based streak logic
- awardGraceBadge: Trauma-informed badge awards  
- completeQuestStep: Quest progression tracking
- pauseQuest: Kindness break for quests
- requestKindnessBreak: Pause streak with grace
- returnFromKindnessBreak: Resume with bonus XP
- joinChallenge: Anonymous challenge participation
```

### React Components
- ✅ `StreakDisplay`: Grace-based streak with pause options
- ✅ `QuestRunner`: 5-minute guided reflections
- ✅ `BadgeTree`: Visual badge progression
- 🚧 `ChallengeBoard`: Anonymous leaderboards (pending)
- ❌ `ShareCard`: Reflection receipts (not started)
- ❌ `BetaBanner`: Scarcity without pressure (not started)

### React Hooks
- ✅ `useStreaks()`: Streak management and messaging
- 🚧 `useChallenges()`: Challenge participation (partial)
- ❌ `useReferrals()`: Referral tracking (not started)

## Analytics & Experiments

### Key Events Tracked
```javascript
// Gamification v2.0 events
'streak_started', 'streak_incremented', 'grace_used', 
'recovery_multiplier_applied', 'quest_started', 'quest_completed',
'quest_paused', 'badge_earned', 'challenge_joined', 
'pause_requested', 'pause_ended', 'level_up'
```

### Success Metrics
- **Engagement**: WRC/DAU +20% week-over-week
- **Retention**: D1/D7 retention rates  
- **Badge Velocity**: Time to first badge unlock
- **Grace Usage**: Grace token utilization patterns
- **Quest Completion**: 5-minute quest finish rates

### A/B Tests
- **A vs B**: Strict streaks vs Grace-based streaks
- **A vs B**: Generic AI vs Archetype-specific tone
- **Success Criteria**: WRC/DAU↑ with no drop in self-reported safety

## Privacy & Safety

### Privacy Controls
- All sharing is **opt-in only**
- Challenge participation uses anonymous aliases
- No personal journal content in shareable items
- Users control their data export and deletion

### Safety Features
- "Pause" button in every flow
- Grace days prevent streak shame
- Crisis detection integration maintains safety
- Trauma-informed language throughout

### Compliance
- **GDPR**: Right to export, delete, and opt-out
- **COPPA**: Age-appropriate design
- **SAMHSA 4Rs**: Realizes trauma impact, recognizes symptoms, responds with trauma-informed practices, resists re-traumatization

## Copy Standards

### Empty States
- "Your reflection is the ritual. One small note is enough."
- "You're building something real."

### Return After Break
- "Welcome back. Survival counts."
- "Taking a pause is self-care. We'll be here when you're ready."

### Season CTAs
- "Two weeks to practice one skill. No rush. No score."
- "Join when it feels right. Leave when you need to."

### Badge Celebrations
- "You showed up for yourself. That takes courage."
- "Three days of showing up for yourself. You're building something real."
- "You found patterns in the chaos. That's wisdom."

## Implementation Status Summary

### ✅ Complete (Shippable)
1. Grace-based streaks with recovery multipliers
2. 5-minute reflection quests with pause options
3. Badge trees with trauma-informed messaging
4. Kindness breaks and pause ritual
5. Firebase security rules and data models

### 🚧 Partial (Needs UI)
1. Community challenges (backend complete)
2. Purpose résumé progression (data model complete)
3. Shareable reflection receipts (types defined)

### ❌ Not Started (v2.1 Features)
1. Ritual packs (limited drops)
2. Khepera archetypes
3. Beta cap banner
4. Enhanced referral system

## Risk Mitigation

### Technical Risks
- **Load**: Optimized Firestore queries with proper indexing
- **Security**: Comprehensive rules prevent data leaks
- **Performance**: Lazy-loaded components and efficient hooks

### Product Risks
- **Engagement Fatigue**: Grace days and pause options prevent burnout
- **Privacy Concerns**: Default-private design with clear controls
- **Trauma Triggers**: Consistent trauma-informed language and escape hatches

### Business Risks
- **Monetization**: Premium features clearly differentiated
- **Competition**: Unique trauma-informed positioning
- **Retention**: Grace-based design prevents abandonment

## Success Definition

### Launch Criteria (72h)
- ✅ Grace-based streaks functional
- ✅ Quest system operational  
- ✅ Badge trees displaying correctly
- ✅ Pause/resume flows working
- ✅ No security vulnerabilities
- 🚧 Performance under load tested

### Definition of Done
- **Engagement**: WRC/DAU +20% week-over-week
- **Retention**: D7 ≥ 70% 
- **Safety**: Zero streak-shame reports
- **Conversion**: ≥3 badges/user median by day 7
- **Privacy**: All mechanics private-safe & opt-in

*"Reclaim your resilience. One gentle reflection at a time."*