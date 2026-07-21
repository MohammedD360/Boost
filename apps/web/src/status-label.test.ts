import { describe, expect, it } from 'vitest';
import { statusLabel } from './status-label.js';

describe('web/statusLabel', () => {
  it('traduit un statut en libellé français', () => {
    expect(statusLabel('ENVOYEE')).toBe('Envoyée');
    expect(statusLabel('SANS_REPONSE')).toBe('Sans réponse');
  });
});
