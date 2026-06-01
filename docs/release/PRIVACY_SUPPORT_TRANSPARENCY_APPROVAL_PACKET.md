# Privacy, Support, and Transparency Approval Packet

## Status

`PENDING HUMAN APPROVAL`

This packet records the release-surface claims inspected for privacy, support,
and transparency approval. It does not certify the release and does not change
the machine-readable checklist.

## Inspected Surfaces

| Surface | Source |
| --- | --- |
| Privacy policy | `src/app/privacy-policy/page.tsx` |
| Terms | `src/app/terms/page.tsx` |
| Support | `src/app/support/page.tsx`, `src/components/support/*`, `src/services/support/supportService.ts` |
| Transparency | `src/app/transparency/page.tsx` |
| Data rights map | `DATA_RIGHTS_MAP.md` |
| Release checklist | `docs/release/release-certification-checklist.json` |

## Privacy Claims

### Deployed Product Claims

- Journal entries may be held in a local device queue.
- Signed-in submitted sessions may be stored in ALCHM cloud storage with
  Khepera reflection and timing metadata.
- Khepera memory is limited to theme tags and emotional tone.
- AI processing is routed through an authenticated server-controlled gateway
  only when deployed and configured.
- Crisis detection runs before reflection generation.
- Settings reset clears local preferences only and does not delete journal or
  account data.
- In-app completed export/deletion is not promised.
- Automatic inactivity deletion is disabled.
- Privacy requests go to `privacy@alchm.app` and require approved backend
  verification and processing.

### Backend and Runtime Support

- Canonical sessions and legacy journal paths are mapped for privacy work.
- Continuity container and active container state are identified as user-owned
  data.
- Continuity/provenance export coverage is not implemented.
- Secure export delivery is disabled.
- Verified account deletion request delivery and processing are disabled.
- Device-local offline data cannot be cleared by server-side deletion.
- Runtime attestation is accepted for the current evidence-tail candidate, but
  release certification remains blocked by deployment lineage, continuity
  lifecycle, native, and human approval gates.

### Approval Decision Needed

`privacyClaimsMatchDeployment` can be approved only if the release authority
accepts that the live claims accurately describe unavailable export/deletion,
disabled retention automation, local-device limitations, and gateway-dependent
AI processing.

Required approval language:

```text
I approve the privacy and terms surfaces for this release scope. The live
claims match the deployed/unavailable behavior: no completed export/deletion is
promised, automatic deletion is disabled, device-local limitations are stated,
and AI processing is represented as gateway-dependent.
```

## Support Claims

### Deployed Product Claims

- Support covers product, account, billing, privacy, export, and technical
  issues.
- Support does not respond to journal content.
- Emotional-boundary requests route to safety resources instead of the support
  form.
- The support form prepares a `mailto:` message to support.
- Diagnostics are opt-in and limited to app build, platform, and language.
- No journal text is included in diagnostics.

### Backend and Runtime Support

- Support submission uses `mailto:` only.
- No Firestore support ticket delivery path is approved as deployed support.
- `DATA_RIGHTS_MAP.md` records that no persisted support delivery claim is
  approved.

### Approval Decision Needed

`supportSurfaceApproved` can be approved only if the release authority accepts
email-preparation support as the only live support mechanism and confirms no
persisted support-ticket delivery is claimed.

Required approval language:

```text
I approve the support surface for this release scope. Support is limited to
email preparation, diagnostics are opt-in and exclude journal text, emotional
support is redirected to safety resources, and no persisted support-ticket
delivery is claimed.
```

## Transparency Claims

### Deployed Product Claims

- No verified transparency report is published in this build.
- Reporting will appear only after the underlying data, review process, and
  audit trail are established.

### Backend and Runtime Support

- No reviewed transparency data source, reporting method, or audit trail is
  recorded as approved for this release.
- The transparency surface is fail-closed: it publishes no metrics.

### Approval Decision Needed

`transparencySurfaceApproved` can be approved only if the release authority
accepts the no-report transparency state as the release-approved surface.

Required approval language:

```text
I approve the transparency surface for this release scope. The product
publishes no transparency metrics or report, and the page accurately states
that verified reporting is not available in this build.
```

## Continuity Export and Deletion Limitation

Continuity records and active container state are user-owned data, but
continuity/provenance export coverage is not implemented and verified deletion
processing remains unavailable. This packet does not close
`continuityExportDeletionVerified`.

## Checklist Impact

The following checklist items remain pending until explicit human approval is
recorded:

- `privacyClaimsMatchDeployment`
- `supportSurfaceApproved`
- `transparencySurfaceApproved`

The following related checklist item remains implementation-blocked:

- `continuityExportDeletionVerified`
