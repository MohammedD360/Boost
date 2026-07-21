import { describe, expect, it } from 'vitest';
import { APPLICATION_STATUSES, isApplicationStatus } from './index.js';

describe('shared/statuses', () => {
  it('expose les 7 statuts du pipeline', () => {
    expect(APPLICATION_STATUSES).toHaveLength(7);
    expect(APPLICATION_STATUSES).toContain('ENVOYEE');
  });

  it('reconnaît un statut valide et rejette le reste', () => {
    expect(isApplicationStatus('ENTRETIEN')).toBe(true);
    expect(isApplicationStatus('PAS_UN_STATUT')).toBe(false);
  });
});
