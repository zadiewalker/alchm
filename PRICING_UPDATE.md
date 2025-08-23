# ALCHM Pricing Update Summary

**Date**: August 21, 2025  
**Change**: Subscription tier pricing adjustment

## 💰 New Pricing Structure

### Updated Tiers
- **Free Tier**: $0/month *(unchanged)*
  - 30-day entry storage
  - Basic AI insights
  - Mood tracking
  - Crisis resources

- **Deep Cut Tier**: ~~$9.99~~ → **$4.99/month** 📉
  - Unlimited cloud storage
  - Advanced pattern analysis
  - Auto-save functionality
  - Export capabilities
  - Trend analytics

- **Oracle Tier**: ~~$29.99~~ → **$9.99/month** 📉
  - Unlimited premium storage
  - AI mentor conversations
  - Priority AI processing
  - Executive coaching features
  - Inner circle sharing

## 🎯 Strategic Benefits

### Accessibility Improvement
- **50% price reduction** makes premium features more accessible
- **Lower barrier to entry** for users seeking mental health support
- **Competitive positioning** in the digital wellness market

### Market Alignment
- **Deep Cut ($4.99)**: Aligns with popular subscription apps
- **Oracle ($9.99)**: Premium tier at accessible price point
- **Better conversion funnel** from free to paid tiers

## 📊 Technical Implementation

### Updated in Technical Documentation
- ✅ `TECHNICAL_OVERVIEW.md` - Architecture documentation
- ✅ Stripe integration examples updated
- ✅ TypeScript interfaces reflect new amounts

### Stripe Configuration Required
```typescript
// Update Stripe price objects
deepCut: {
  priceId: 'price_deep_cut_monthly',
  amount: 499, // $4.99 USD (was 999)
}

oracle: {
  priceId: 'price_oracle_monthly', 
  amount: 999, // $9.99 USD (was 2999)
}
```

### Environment Variables
```bash
# .env.local (no changes needed - price IDs remain the same)
STRIPE_DEEP_CUT_PRICE_ID=price_deep_cut_monthly
STRIPE_ORACLE_PRICE_ID=price_oracle_monthly
```

## 🚀 Firebase Studio Impact

### Enhanced Value Proposition
- **More accessible pricing** improves user acquisition potential
- **Higher conversion rates** expected with lower price barriers
- **Competitive advantage** in mental health app market

### Implementation Status
- ✅ **Technical Documentation Updated**
- ✅ **Code References Updated** 
- ✅ **Architecture Documentation Current**
- ⏳ **Stripe Dashboard Update Required** (create new price objects)
- ⏳ **UI Components Update Required** (display new pricing)

## 📋 Next Steps

1. **Create New Stripe Prices**: Generate new price objects in Stripe Dashboard
2. **Update UI Components**: Modify pricing display components
3. **Test Payment Flow**: Verify subscription creation with new prices
4. **Update Marketing Materials**: Reflect new pricing in promotional content
5. **Deploy Changes**: Push updates through Firebase Studio

---

**ALCHM's new accessible pricing structure maintains premium value while opening mental health support to a broader audience.**