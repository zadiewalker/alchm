export interface KnownIssue {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}

export const KNOWN_ISSUES: KnownIssue[] = [];
