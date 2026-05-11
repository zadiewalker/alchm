export function getLatestPatternAnalysis() { return { cycles: [], shifts: [], entities: [] as Array<{ name: string }> }; }
export function runPatternAnalysisIfNeeded() { return getLatestPatternAnalysis(); }
export async function runPatternAnalysisIfNeededAsync() { return getLatestPatternAnalysis(); }
export function getRelationalEntities() { return [] as Array<{ name: string }>; }
export function forgetRelationalEntity(_name: string) {}
