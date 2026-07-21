import { describe, expect, it } from 'vitest';
import { health } from './health.js';

describe('api/health', () => {
  it('répond ok', () => {
    expect(health()).toEqual({ status: 'ok' });
  });
});
