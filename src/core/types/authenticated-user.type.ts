export interface AuthenticatedUser {
  id: string;
  sub: string;
  identifier: string;
  organizationId: string;
  schoolUnitId: string | null;
  sessionId: string;
}
