/**
 * Code partagé entre l'API et le front (source de vérité unique).
 * La machine à états complète (transitions valides) arrivera en Phase 1 —
 * ici on n'amorce que la liste des statuts pour ancrer le paquet partagé.
 */

export const APPLICATION_STATUSES = [
  'A_POSTULER',
  'ENVOYEE',
  'RELANCEE',
  'ENTRETIEN',
  'OFFRE',
  'REFUSEE',
  'SANS_REPONSE',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return (APPLICATION_STATUSES as readonly string[]).includes(value);
}
