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

assert(
  todayClientSource.includes("onClick={() => router.push(`/journal/new?container=${containerId}&day=${currentDay}`)}"),
  'active container today primary CTA must still route to /journal/new with container/day params'
);
assert(
  todayClientSource.includes('This place will still be here when you return. What is here today can remain here without being resolved.'),
  'active container today screen must include supportive later-context copy above the secondary action'
);

console.log('Container today polish regression guards passed.');
