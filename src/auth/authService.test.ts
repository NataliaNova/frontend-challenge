import { describe, it, expect } from '@jest/globals';
import { generateCodeChallenge } from './authService';

describe('generateCodeChallenge', () => {
  it('genera un código válido', async () => {
    const codeVerifier = 'testverifier1234567890';
    const challenge = await generateCodeChallenge(codeVerifier);

    expect(typeof challenge).toBe('string');
    expect(challenge.length).toBeGreaterThan(0);
  });
});