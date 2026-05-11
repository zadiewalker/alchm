export type BodyLocation = 'head' | 'throat' | 'chest' | 'stomach' | 'jaw' | 'shoulders_left' | 'shoulders_right' | 'whole_body' | 'nowhere_specific';
export function getBodyHeatmap(_days: number) { return { head: 0, throat: 0, chest: 0, stomach: 0, shoulders: 0, whole: 0 }; }
export function getSomaticTimeline(_days: number) { return [] as Array<{ date: string; points: Array<{ location: string; sensation: string }> }>; }
