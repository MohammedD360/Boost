import type { ApplicationStatus } from '@boost/shared';

/** Placeholder de la Phase 0 : React + Vite + le kanban arrivent en Phase 3. */
const LABELS: Record<ApplicationStatus, string> = {
  A_POSTULER: 'À postuler',
  ENVOYEE: 'Envoyée',
  RELANCEE: 'Relancée',
  ENTRETIEN: 'Entretien',
  OFFRE: 'Offre',
  REFUSEE: 'Refusée',
  SANS_REPONSE: 'Sans réponse',
};

export function statusLabel(status: ApplicationStatus): string {
  return LABELS[status];
}
