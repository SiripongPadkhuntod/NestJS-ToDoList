export const TOKEN_GENERATOR = 'TOKEN_GENERATOR';

export interface ITokenGenerator {
  generateToken(payload: Record<string, any>): string;
}
