// Deterministic container copy only. Khepera reflection generation belongs to
// the canonical journal submission pipeline, not container milestones.

export async function generateArcReflection(
  _userId: string,
  _userContainerId: string,
  _containerName: string,
  currentDay: number
): Promise<string> {
  return getFallbackArcReflection(currentDay);
}

export async function generateCompletionAcknowledgment(
  containerName: string,
  _totalDays: number,
  _dominantTone: string,
  _recurringThemes: string[]
): Promise<string> {
  return getFallbackCompletion(containerName);
}

export async function generateClosingSeed(
  _containerName: string
): Promise<string> {
  return 'What still feels worth carrying gently?';
}

function getFallbackArcReflection(day: number): string {
  const reflections = [
    'Something keeps returning here, though not in exactly the same way each time.',
    'There is a patient quality in these entries. That remains part of what has been here.',
  ];
  return reflections[day % reflections.length];
}

function getFallbackCompletion(containerName: string): string {
  return `This container can rest here. What you brought to "${containerName}" does not need to be made into a lesson.`;
}
