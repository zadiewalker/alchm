export async function generateArcReflection(
  _userId: string,
  _userContainerId: string,
  containerName: string,
  _currentDay: number,
): Promise<string> {
  return `Your space in "${containerName}" is here when you want it. There is no need to catch up or resolve anything today.`;
}

export async function generateCompletionAcknowledgment(
  containerName: string,
): Promise<string> {
  return `"${containerName}" can rest here. The words you placed here remain yours.`;
}

export async function generateClosingSeed(containerName: string): Promise<string> {
  return `What, if anything, would you like to carry from "${containerName}"?`;
}
