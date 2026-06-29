export interface JwtTokenPayload {
  sub: string;
  sessionId: string;
  identifier: string;
  organizationId: string | null;
  schoolUnitId: string | null;
  type: 'access' | 'refresh';
}
