# Verifier Admission Execution

Candidate SHA: `a8d89db0606fa326af97f36962a90f59db8bb9c6`

## Fingerprint Collection

1. Obtain the production verifier public key PEM from the verifier operator.
2. Save the public key in the release evidence packet.
3. Compute fingerprint:

```bash
openssl pkey -pubin -in verifier-public.pem -outform DER | shasum -a 256
```

4. Confirm the fingerprint matches the verifier admission record.

## Operator Metadata

- Verifier ID
- Operator name
- Operator contact
- Custody boundary
- Key rotation owner
- Revocation owner
- Authority scope: `runtime-continuity-attestation`

## Approval Evidence

- Approver name
- Approval timestamp
- Candidate SHA
- Deployment environment: `production`
- Non-self-attested trust-root reference
- Verifier lineage reference

## Expiry

- Expiration timestamp is required.
- Expired verifier records must not issue production receipts.
- Test verifier records must not authorize production.

## Revocation Path

1. Mark verifier record revoked.
2. Record revocation timestamp and owner.
3. Invalidate unexpired receipts from the revoked verifier.
4. Run `npm run check:runtime-attestation`.
