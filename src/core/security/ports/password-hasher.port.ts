export const PASSWORD_HASHER = 'PASSWORD_HASHER';

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hashed: string): Promise<boolean>;
}
