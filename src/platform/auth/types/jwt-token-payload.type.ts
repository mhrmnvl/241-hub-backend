export interface JwtTokenPayload {
  sub: string;
  sessionId: string;
  identifier: string;
  organizationId: string;
  schoolUnitId: string | null;
  type: 'access' | 'refresh';
}
