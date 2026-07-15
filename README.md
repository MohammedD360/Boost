# Boost — Assistant intelligent de candidature

Application web qui aide les candidats à piloter leur recherche d'emploi
comme un pipeline : suivi des candidatures en kanban, relances automatiques,
templates de messages personnalisés et statistiques de progression.

📄 **[Cahier des charges complet](docs/cdc.md)**

## Le problème

Les candidats gèrent leurs candidatures dans des tableurs ou de mémoire :
relances oubliées, messages génériques, aucune visibilité sur ce qui
fonctionne. Boost apporte la méthode et l'outillage.

## Fonctionnalités du MVP

- Pipeline kanban : à postuler → envoyée → relancée → entretien → offre
- Rappels de relance automatiques par email
- Templates de messages avec variables pré-remplies
- Astuces contextuelles selon l'étape de la candidature
- Statistiques : taux de réponse, conversion par canal

## Stack technique

**Backend** : NestJS · PostgreSQL · Prisma · BullMQ
**Frontend** : React · TypeScript · TanStack Query · Tailwind CSS
**Infra** : Docker · GitHub Actions

## Statut

🚧 En développement — MVP prévu pour septembre 2026

| Jalon | Statut |
|---|---|
| Cahier des charges | ✅ |
| Schéma de base de données | 🔜 |
| Socle API (auth + pipeline) | ⏳ |
| Frontend MVP | ⏳ |
| Mise en production | ⏳ |