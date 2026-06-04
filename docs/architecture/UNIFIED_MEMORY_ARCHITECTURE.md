# Unified Memory Architecture

## Principle

ALCHM memory should create continuity without storing the user's words outside their journal record.

The system remembers through derived signals, not through reconstructive narratives.

## Memory Layers

### Episodic Layer

Owner: Journal.

Purpose: preserve the original user-owned event.

Stores:

- journal entry id
- timestamps
- local submission state
- user-owned raw text in the journal record

Does not store:

- interpretive conclusions
- clinical labels
- raw text in cognition memory

### Thematic Layer

Owner: Memory service, using Journal/Khepera-derived tags.

Purpose: support continuity through minimal theme and tone metadata.

Stores:

- `ThemeTag[]`
- `EmotionalTone`
- source ids
- recurrence counts

Does not store:

- entry excerpts
- narrative summaries
- embeddings of raw entries

### Developmental Layer

Owner: Mirror.

Purpose: detect movement across time.

Stores:

- derived observations
- tentative patterns
- movement records
- confidence and ambiguity values
- synthesis ids

Does not store:

- certainty claims
- diagnostic labels
- raw journal text

### Container-Specific Layer

Owner: Containers.

Purpose: remember what becomes visible inside a lens.

Stores:

- container id
- relationship state
- recurring inquiry ids
- lens-specific derived insights
- movement markers relevant to that container

Does not store:

- completion state
- missed-day records
- behind/ahead indicators
- raw entry text

### Relationship-Specific Layer

Owner: Khepera.

Purpose: make responses less repetitive and more relational.

Stores:

- response family
- response form
- question count
- length band
- challenge level
- use of memory

Does not store:

- raw journal text
- dependency-building prompts
- coaching plans

## Duplication Risks

### Pattern Duplication

Mirror patterns, Khepera longitudinal patterns, and Container memory all model recurrence.

Resolution: Mirror owns durable patterns. Khepera receives ephemeral pattern candidates for response planning. Containers own lens-specific views of those patterns.

### Theme Vocabulary Drift

Mirror uses product-facing reflective themes. Journal/Khepera use `ThemeTag`.

Resolution: the cognition adapter maps Mirror and Container themes into safe `ThemeTag` values.

### Container Memory vs Mirror Memory

Container memory should not become a second Mirror.

Resolution: Container memory records what a specific lens is helping the user notice. Mirror records longitudinal movement across all experience.

## Retrieval Ownership

Khepera decides whether memory is emotionally appropriate in the moment.

Mirror ranks longitudinal relevance.

Containers bias what matters under the current lens.

Journal never performs interpretation.

## Privacy Rules

- Raw entry text remains journal-owned.
- Provider generation may receive raw entry text only for immediate reflection.
- Memory stores only derived signals.
- No raw entry embeddings are allowed.
- No user-identifying emotional narratives should be stored as memory.

## Implemented Fix

`UnifiedCognitiveContext` now provides a single handoff object with explicit raw-text and derived-memory policy.
