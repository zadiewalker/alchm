# Firestore Emulator Evidence Runbook

## Status

`PARTIAL - LOCAL JAVA RUNTIME AVAILABLE, CLEAN CANDIDATE REQUIRED`

The local environment can run Firebase emulators with Homebrew OpenJDK. A dirty
checkout emulator pass is useful diagnostic evidence only; certification still
requires the suite to pass from a clean fixed candidate SHA.

## Required Runtime

- Node dependencies installed from the candidate lockfile.
- Firebase CLI available.
- Java runtime available on `PATH`, `JAVA_HOME`, or a supported Homebrew OpenJDK
  path.
- Clean candidate SHA.

## Command

```bash
npm run check:firestore-emulator-evidence
```

## Expected Evidence

The command writes `docs/release/firestore-emulator-evidence.latest.json`. The
artifact must bind:

- candidate SHA
- Firestore rules file digest
- emulator command
- pass/fail summary
- timestamp
- Java/Firebase runtime metadata
- authorization cases for sessions, memory, delayed reflections, containers,
  ownership mutation, and cross-user denial

If the worktree is dirty, the artifact is diagnostic only and the command must
fail as a certification gate.

No static rule scan may replace emulator evidence for certification.
