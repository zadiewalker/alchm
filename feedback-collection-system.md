# ALCHM TestFlight Feedback Collection System

## 📋 Google Forms Setup (Ready to Create)

### Form 1: Internal Testing Feedback (Phase 1)

**Form Title:** ALCHM Internal Testing - Build #3 Feedback
**Form URL:** [Create at forms.google.com]

**Questions:**

1. **Your Information**
   - Name: [Short answer]
   - Device: [Multiple choice: iPhone 13, iPhone 14, iPhone 15, iPad Air, iPad Pro, Other]
   - iOS Version: [Short answer]

2. **Build #3 Specific Testing**
   - Do the dashboard cards display with subtle white borders? [Yes/No/Didn't notice]
   - How do the dashboard cards look? [Scale 1-5 + comment box]
   - Do the analytics show real data (not fake percentages)? [Yes/No/Unclear]
   - Does the Past Entries page load quickly? [Yes/No/Still slow]
   - Does the Pathways page load quickly? [Yes/No/Still slow]
   - Is the Premium Features page simpler than before? [Yes/No/Same/Don't know]

3. **Core Functionality**
   - Did the app launch successfully? [Yes/No]
   - Were you able to create a journal entry? [Yes/No/Had issues]
   - Did Khepera respond appropriately? [Yes/No/No response/Inappropriate]
   - Rate overall app stability [1-5 scale]

4. **Critical Issues** 
   - Did you experience any crashes? [Yes/No + description box]
   - Any data loss or corruption? [Yes/No + description]
   - Any safety concerns? [Yes/No + description]
   - Performance issues? [Text box]

5. **Priority Assessment**
   - Most critical issue to fix: [Text box]
   - Ready for friends & family testing? [Yes/No/With fixes]
   - Overall Build #3 rating: [1-5 scale]

---

### Form 2: Friends & Family Beta Feedback (Phase 2)

**Form Title:** ALCHM Beta Testing Feedback - Your Safety Matters
**Form URL:** [Create at forms.google.com]

**Introduction Text:**
```
Thank you for testing ALCHM! Your feedback helps make the app safer for trauma survivors.

Important: If you experienced any emotional distress while testing, please contact:
• Crisis Text Line: Text HOME to 741741
• National Suicide Prevention Lifeline: 988
• Or reach out to zadie@alchm.app

Your responses are confidential. Only Zadie will see them.
```

**Questions:**

1. **Your Background (Optional)**
   - First name: [Short answer]
   - How did you hear about ALCHM? [Multiple choice]
   - Background: [Mental health professional, Trauma survivor, General user, Other]

2. **First Impressions**
   - How easy was it to get started? [1-5 scale]
   - Did you feel safe using the app? [Yes/No + explanation]
   - What was your first impression of the design? [Text box]
   - How would you describe ALCHM to a friend? [Text box]

3. **Khepera AI Experience**
   - Did you interact with Khepera? [Yes/No]
   - If yes, how did Khepera's responses feel? [1-5 scale + text]
   - Did any responses feel inappropriate or triggering? [Yes/No + details]
   - Would you trust Khepera for ongoing support? [Yes/No/Maybe + why]

4. **Emotional Safety Assessment**
   - Did anything in the app feel triggering? [Yes/No + details]
   - Did you feel in control of your experience? [Yes/No + explanation] 
   - Would you feel safe using this during a difficult time? [Yes/No + why]
   - Would you recommend this to someone processing trauma? [Yes/No + why]

5. **Feature Feedback**
   - Which features did you try? [Checkboxes: Journal, Dashboard, Pathways, Past Entries, Premium Features, Crisis Resources]
   - Most valuable feature: [Text box]
   - Most confusing feature: [Text box]
   - Missing features you expected: [Text box]

6. **Technical Experience**
   - Device used: [iPhone model + iOS version]
   - Any crashes or freezing? [Yes/No + details]
   - App performance: [Very fast/Fast/Slow/Very slow]
   - Any bugs or glitches? [Text box]

7. **Overall Assessment**
   - Overall rating: [1-5 stars]
   - Best thing about ALCHM: [Text box]
   - Biggest improvement needed: [Text box]
   - Would you continue using ALCHM? [Yes/No/Maybe + why]

8. **Beta Testing Experience**
   - How was this testing experience? [1-5 scale]
   - Would you test future versions? [Yes/No]
   - Can we contact you for follow-up questions? [Yes/No + preferred method]

---

### Form 3: External Beta Feedback (Phase 3)

**Form Title:** ALCHM External Beta - Help Shape Trauma-Informed Technology
**Form URL:** [Create at forms.google.com]

**Questions:** [Condensed version of Form 2 + additional questions]

9. **Professional Perspective (If Applicable)**
   - Are you a mental health professional? [Yes/No]
   - If yes, would you consider recommending ALCHM to clients? [Yes/No/Maybe + conditions]
   - How does ALCHM compare to other mental health apps? [Text box]
   - What concerns would you have about client usage? [Text box]

10. **Community Impact**
    - How could ALCHM better serve your community? [Text box]
    - What cultural considerations should we prioritize? [Text box]
    - Suggestions for inclusive features: [Text box]

---

## 📊 Feedback Analysis System

### Daily Feedback Dashboard

**Create a Google Sheets dashboard tracking:**

**Sheet 1: Response Overview**
```
Date | Phase | Responses | Avg Rating | P0 Issues | P1 Issues | Ready for Next Phase?
12/2 | Internal | 3/5 | 4.2/5 | 0 | 2 | Not yet
12/3 | Internal | 5/5 | 4.4/5 | 0 | 1 | Yes
12/4 | F&F | 2/15 | 4.0/5 | 0 | 0 | Continue
```

**Sheet 2: Issue Tracker**
```
Issue ID | Severity | Description | Reporter | Device | Status | Fix Version
001 | P1 | Dashboard borders not visible on iPhone 13 | John | iPhone 13 | Open | TBD
002 | P2 | Khepera response slightly slow | Sarah | iPhone 15 | Open | Later
003 | P0 | App crash on journal save | Mike | iPad Pro | Fixed | 1.0.1
```

**Sheet 3: Feature Feedback**
```
Feature | Positive Comments | Concerns | Usage Rate | Priority Score
Dashboard | "Love the clean design" | "Borders too subtle" | 95% | High
Khepera | "Felt supportive" | "Sometimes slow" | 80% | High
Pathways | "Great concept" | "Need more content" | 60% | Medium
```

### Automated Feedback Processing

**Set up Google Forms → Sheets → Slack integration:**

1. **High Severity Alert (P0/P1 issues):**
   ```
   🚨 CRITICAL FEEDBACK ALERT 🚨
   
   Issue: App crash reported
   Reporter: [Name]
   Device: iPhone 13 Pro, iOS 17.1
   Details: [Description]
   
   Action Required: Investigate immediately
   Form Response: [Link to full response]
   ```

2. **Safety Concern Alert:**
   ```
   ⚠️ SAFETY CONCERN REPORTED ⚠️
   
   Type: Triggering content / Inappropriate AI response
   Reporter: [Anonymous ID]
   Details: [Sanitized description]
   
   Action Required: Review within 2 hours
   ```

3. **Positive Feedback Summary (Daily):**
   ```
   ✨ Daily Feedback Summary ✨
   
   Total Responses: 12
   Average Rating: 4.3/5
   Top Positive: "Feels genuinely safe to use"
   Ready for Next Phase: 85% say yes
   ```

## 🎯 Feedback Quality Assurance

### Response Quality Checklist

**For each response, verify:**
- [ ] Emotional safety assessment completed
- [ ] Technical issues clearly described
- [ ] Feature usage documented
- [ ] Overall experience captured
- [ ] Follow-up consent recorded

### Tester Follow-up Strategy

**Automatic Follow-ups:**
- **24 hours after testing:** "Thank you for testing! Any additional thoughts?"
- **1 week later:** "How has your impression of ALCHM evolved?"
- **Before App Store launch:** "Would you like early access to the published version?"

**Personal Follow-ups for:**
- Safety concerns reported
- Professional perspectives (therapists, etc.)
- Detailed technical feedback
- Requests for deeper conversation

## 📈 Success Metrics by Phase

### Phase 1 (Internal) - Success Criteria:
- [ ] 100% team participation
- [ ] 0 P0 issues (critical bugs)
- [ ] ≤2 P1 issues (high priority)
- [ ] 4+ average rating
- [ ] All Build #3 features working

### Phase 2 (Friends & Family) - Success Criteria:
- [ ] 70%+ response rate
- [ ] 4+ average emotional safety rating
- [ ] 0 safety concerns reported
- [ ] 80%+ would recommend to others
- [ ] Ready for external beta

### Phase 3 (External) - Success Criteria:
- [ ] 30%+ response rate from invitations
- [ ] 4.5+ average overall rating
- [ ] Professional validation (if applicable)
- [ ] Cultural feedback incorporated
- [ ] Ready for App Store submission

---

## 🚀 Implementation Checklist

### Immediate Setup (Today):
- [ ] Create Google Form #1 (Internal Testing)
- [ ] Set up Google Sheets feedback dashboard
- [ ] Configure Slack alerting for P0 issues
- [ ] Prepare internal tester invitation emails

### This Week:
- [ ] Send internal testing invitations
- [ ] Monitor Build #3 processing in App Store Connect
- [ ] Create Google Form #2 (Friends & Family)
- [ ] Prepare F&F tester invitation list

### Next Week:
- [ ] Analyze internal feedback and fix P1 issues
- [ ] Send Friends & Family invitations
- [ ] Create Google Form #3 (External Beta)
- [ ] Begin external tester recruitment

**All forms and systems are ready to implement immediately!**