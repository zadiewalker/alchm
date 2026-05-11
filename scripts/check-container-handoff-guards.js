#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const todayClientSource = read('src/app/containers/[id]/today/DailyThresholdClient.tsx');
const newJournalPageSource = read('src/app/journal/new/page.tsx');
const journalFlowSource = read('src/components/journal/JournalFlow.tsx');
const containerDefinitionsSource = read('src/config/containerDefinitions.ts');
const containerCatalogCardSource = read('src/components/containers/ContainerCatalogCard.tsx');
const containerPageSource = read('src/app/containers/page.tsx');
const containerTodaySource = read('src/app/containers/[id]/today/DailyThresholdClient.tsx');
const containerThresholdSource = read('src/app/containers/[id]/threshold/DailyThresholdClient.tsx');
const containerOpeningSource = read('src/app/containers/[id]/opening/OpeningRitualClient.tsx');
const containerRitualSource = read('src/app/containers/[id]/ritual/OpeningRitualClient.tsx');
const containerCeremonySource = read('src/app/containers/[id]/ceremony/CompletionCeremonyClient.tsx');
const legacyCompletionCeremonySource = read('src/components/containers/ContainerCompletionCeremony.tsx');

function collectStringLiterals(source) {
  const literals = [];
  const stringLiteralPattern = /(['"`])((?:\\.|(?!\1)[\s\S])*)\1/g;
  let match;
  while ((match = stringLiteralPattern.exec(source)) !== null) {
    literals.push(match[2]);
  }
  return literals;
}

function assertNoContainerPressureLanguage(label, source) {
  const ignoredLiterals = new Set(['completed']);
  const forbidden = /\b(complete|completion|finish|finished|progress|challenge|program|streak|goal|unlock|level|journey|healing)\b/i;
  const badLiteral = collectStringLiterals(source).find((literal) => {
    if (ignoredLiterals.has(literal)) return false;
    return forbidden.test(literal);
  });

  assert(!badLiteral, `${label} must avoid completion/progress/challenge framing: "${badLiteral}"`);
}

[
  { id: 'grief', totalDays: 21 },
  { id: 'rupture', totalDays: 14 },
  { id: 'identity', totalDays: 21 },
  { id: 'burnout', totalDays: 14 },
  { id: 'forgiveness', totalDays: 14 },
].forEach(({ id, totalDays }) => {
  assert(
    containerDefinitionsSource.includes(`id: '${id}'`),
    `selected emotional container definition must exist: ${id}`
  );
  const definitionStart = containerDefinitionsSource.indexOf(`id: '${id}'`);
  const definitionEnd = containerDefinitionsSource.indexOf("\n  {\n    id:", definitionStart + 1);
  const definitionSource = containerDefinitionsSource.slice(
    definitionStart,
    definitionEnd === -1 ? containerDefinitionsSource.indexOf('\n];', definitionStart) : definitionEnd,
  );
  assert(
    definitionSource.includes(`totalDays: ${totalDays}`),
    `${id} must keep the clinically selected ${totalDays}-day length`
  );
});

[
  ['container definitions', containerDefinitionsSource],
  ['container catalog card', containerCatalogCardSource],
  ['containers page', containerPageSource],
  ['container today screen', containerTodaySource],
  ['container threshold screen', containerThresholdSource],
  ['container opening screen', containerOpeningSource],
  ['container ritual screen', containerRitualSource],
  ['container ceremony screen', containerCeremonySource],
  ['legacy container ceremony component', legacyCompletionCeremonySource],
].forEach(([label, source]) => assertNoContainerPressureLanguage(label, source));

assert(
  todayClientSource.includes("onClick={() => router.push(`/journal/new?container=${containerId}&day=${currentDay}`)}"),
  'active container today CTA must route to /journal/new with container/day params'
);
assert(
  newJournalPageSource.includes("const containerId = searchParams?.get('container') || '';"),
  'journal/new must read container id from search params'
);
assert(
  newJournalPageSource.includes("const dayParam = searchParams?.get('day');"),
  'journal/new must read day from search params'
);
assert(
  newJournalPageSource.includes('const containerOriginContext = useMemo(() => {'),
  'journal/new must derive soft container-origin context'
);
assert(
  newJournalPageSource.includes('containerOriginContext={containerOriginContext}'),
  'journal/new must pass container-origin context into JournalFlow'
);
assert(
  journalFlowSource.includes('This entry can stay close to what is here today. It will stand as its own writing.'),
  'JournalFlow must render the container-origin contextual card'
);
assert(
  journalFlowSource.includes('containerId: activeContainer?.definition.id'),
  'JournalFlow must pass semantic container definition id as containerId'
);
assert(
  journalFlowSource.includes('userContainerId: activeContainer?.userContainerId'),
  'JournalFlow must keep Firestore container instance id separate as userContainerId'
);
assert(
  journalFlowSource.includes('containerContext: containerContext ?? undefined'),
  'JournalFlow must pass canonical ContainerContext into submission'
);

console.log('Container handoff regression guards passed.');
