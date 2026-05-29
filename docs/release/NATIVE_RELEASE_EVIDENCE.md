# Native Release Evidence

Candidate SHA: `a8d89db0606fa326af97f36962a90f59db8bb9c6`

## Bundle ID Proof

Collect:

```bash
grep -n "appId" capacitor.config.ts
grep -n "appId" ios/App/App/capacitor.config.json
```

Expected bundle ID:

```text
com.alchm.sanctuary
```

## Archive Proof

Collect:

```bash
npm run build
npx cap sync ios
xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Release -archivePath /tmp/alchm-a8d89db.xcarchive archive
xcodebuild -exportArchive -archivePath /tmp/alchm-a8d89db.xcarchive -exportPath /tmp/alchm-a8d89db-export -exportOptionsPlist ios/exportOptions.plist
```

Expected artifact:

```text
/tmp/alchm-a8d89db.xcarchive
```

## RevenueCat Proof

Collect:

- RevenueCat project/app identifier
- Entitlement identifier: `transformation`
- Product identifier: `alchm_transformation_monthly`
- Dashboard screenshot with values visible and secret values hidden
- Test purchase or sandbox entitlement result for the archived build

## Same-SHA Linkage Proof

Collect:

```bash
git rev-parse HEAD
git diff --stat
shasum -a 256 /tmp/alchm-a8d89db-export/*
```

Required:

- HEAD equals `a8d89db0606fa326af97f36962a90f59db8bb9c6`
- Worktree clean before archive
- Archive timestamp recorded
- Archive actor recorded
- RevenueCat entitlement evidence tied to the archived build
