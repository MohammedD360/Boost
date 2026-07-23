# Cahier des charges — « Boost » (nom de travail)

### Assistant intelligent de candidature

|                 |                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------ |
| **Version**     | 1.1                                                                                        |
| **Auteur**      | [Ton nom]                                                                                  |
| **Statut**      | Validé — MVP en cours (décisions D1–D6 verrouillées le 2026-07-21)                         |
| **Emplacement** | `/docs/cahier-des-charges.md` dans le repo (document vivant, mis à jour à chaque décision) |

---

## 0. Décisions structurantes verrouillées (D1–D6)

Décisions coûteuses à défaire, prises avant d'écrire du code et **non rediscutées avant la V2**. Le détail d'exécution vit dans `docs/roadmap.md`.

| #      | Décision         | Choix verrouillé                                                                                                                         |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **D1** | Multi-tenant     | Tables `Establishment` et `Cohort` posées dès la 1re migration, **aucun écran école au MVP** (voir §7)                                   |
| **D2** | Jobs / rappels   | **Cron quotidien + table `Reminder`** comme garde-fou. BullMQ/Redis écartés au MVP (voir §8)                                             |
| **D3** | Visibilité école | L'école voit des **volumes et alertes**, jamais le contenu des messages ni le détail des refus (fonctionnalité V2)                       |
| **D4** | RGPD suppression | Suppression de compte = **suppression effective en cascade** sur `Application`, `StatusHistory` et `Reminder` (voir §9)                  |
| **D5** | Statistiques     | **Indicateurs d'effort** (envoyées cette semaine, relances faites, en attente de relance). Pas de taux de conversion au MVP (voir §4 F6) |
| **D6** | Dates des jalons | Jalons datés (voir §11), ancrés sur le calendrier de `docs/roadmap.md` (S1 = semaine du 2026-07-21)                                      |

---

## 1. Contexte & problème

Les candidats en recherche d'emploi gèrent leurs candidatures avec des outils inadaptés (tableurs, notes, mémoire). Les conséquences observées :

- **Perte de suivi** : on ne sait plus qui relancer, quand, ni où en est chaque candidature.
- **Relances oubliées** : or une relance à J+7 augmente significativement le taux de réponse.
- **Communication générique** : mails de motivation et de relance copiés-collés, peu efficaces.
- **Aucun apprentissage** : sans données, impossible de savoir quel canal ou quelle approche fonctionne.

Le problème n'est pas la compétence des candidats, c'est **l'absence de méthode outillée**.

## 2. Objectifs & indicateurs de succès

**Objectif produit :** permettre à un candidat de piloter sa recherche d'emploi comme un pipeline commercial : suivi rigoureux, relances systématiques, communication personnalisée, décisions basées sur les données.

**Indicateurs de succès (mesurables) :**

- Un utilisateur peut créer une candidature et la faire avancer dans le pipeline en < 1 minute
- 0 relance oubliée : toute candidature sans réponse depuis N jours déclenche un rappel
- 10 utilisateurs réels actifs à 3 mois (amis, camarades de promo)

**Objectif personnel (assumé dans ce document) :** projet portfolio démontrant la maîtrise d'un cycle projet complet — conception, développement, tests, CI/CD, production — en vue d'un CDI de développeur full stack.

## 3. Utilisateurs cibles

| Persona                         | Description                                                                     | Besoin principal                                          |
| ------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **Le candidat** (cœur de cible) | Étudiant ou jeune diplômé en recherche active, 5 à 30 candidatures en parallèle | Ne rien laisser filer, relancer au bon moment, progresser |
| **L'administrateur**            | Gestionnaire du contenu (moi)                                                   | Gérer la bibliothèque d'astuces et de templates           |

> Décision : pas de persona « recruteur » ni « coach ». L'application est un outil personnel du candidat. (Voir §5, Hors périmètre.)

## 4. Périmètre du MVP

### F1 — Authentification & comptes

- Inscription / connexion par email + mot de passe
- Rôles : `USER` et `ADMIN`

### F2 — Pipeline de candidatures (cœur du produit)

- CRUD des candidatures : entreprise, poste, canal, lien de l'offre, notes, contact
- Workflow d'états : `À postuler → Envoyée → Relancée → Entretien → Offre / Refusée / Sans réponse`
- Vue kanban avec glisser-déposer entre colonnes
- Historique horodaté des changements d'état

### F3 — Relances automatiques

- Règle : candidature en `Envoyée` sans changement depuis 7 jours → email de rappel à l'utilisateur
- Délai configurable par l'utilisateur (3 à 14 jours)
- Journalisation des rappels envoyés (pas de double envoi)

### F4 — Templates de messages

- Bibliothèque de templates : relance, remerciement post-entretien, demande de feedback après refus
- Variables dynamiques : `{prénom_contact}`, `{entreprise}`, `{poste}`, `{date_candidature}`
- Génération du message pré-rempli depuis une candidature + copie en un clic

### F5 — Astuces contextuelles

- Conseils affichés selon l'état de la candidature (ex. état `Entretien` → checklist de préparation)
- Contenu géré par l'`ADMIN` (CRUD des astuces, association à un état)

### F6 — Indicateurs d'effort (D5)

- Candidatures **envoyées cette semaine**
- **Relances faites** (rappels traités par l'utilisateur)
- Candidatures **en attente de relance**
- Décision : **pas de taux de conversion ni d'analyse par canal au MVP**. Mesurer l'effort motive et se calcule sans historique long ; le résultat (taux de réponse, conversion) demande des volumes qu'on n'aura pas avant plusieurs mois — reporté en V2.

## 5. Hors périmètre (décisions explicites)

Ces exclusions sont volontaires. Elles protègent le calendrier et pourront être réévaluées en V2.

| Exclu du MVP                                   | Pourquoi                                                                         |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| Génération IA de lettres de motivation         | V2. Le socle (auth, données, workflow) doit exister d'abord                      |
| Scraping / import automatique d'offres         | Complexité juridique et technique disproportionnée pour le MVP                   |
| Envoi d'emails **aux recruteurs** depuis l'app | Risques (spam, délivrabilité) ; l'app prépare le message, l'utilisateur l'envoie |
| Application mobile native                      | Le web responsive couvre le besoin                                               |
| OAuth (Google, LinkedIn)                       | Confort, pas essentiel ; ajout simple plus tard                                  |
| Multi-langue                                   | Français uniquement au lancement                                                 |

## 6. User stories & critères d'acceptation (extrait)

> Format : les critères d'acceptation sont **testables** — ils deviennent les tests d'intégration.

**US-01 — Créer une candidature**
_En tant que candidat, je veux enregistrer une nouvelle candidature afin de la suivre dans mon pipeline._

- ✅ Étant connecté, quand je soumets le formulaire avec entreprise + poste (champs obligatoires), la candidature apparaît dans la colonne « À postuler »
- ✅ Si l'entreprise est vide, le formulaire affiche une erreur et rien n'est créé
- ✅ Un utilisateur ne voit jamais les candidatures d'un autre utilisateur

**US-02 — Faire avancer une candidature**
_En tant que candidat, je veux déplacer une candidature d'une étape à l'autre afin de refléter sa progression._

- ✅ Le glisser-déposer d'une carte vers une autre colonne persiste le nouvel état (visible après rechargement)
- ✅ Chaque changement d'état crée une entrée horodatée dans l'historique
- ✅ Les transitions invalides (ex. `Refusée → Entretien`) sont rejetées par l'API avec une erreur 422

**US-03 — Être rappelé de relancer**
_En tant que candidat, je veux recevoir un rappel quand une candidature reste sans réponse afin de ne jamais oublier de relancer._

- ✅ Une candidature en `Envoyée` depuis plus de N jours déclenche un email de rappel
- ✅ Le même rappel n'est jamais envoyé deux fois pour la même candidature
- ✅ Le changement d'état de la candidature annule le rappel programmé

**US-04 — Générer un message de relance**
_En tant que candidat, je veux générer un message de relance pré-rempli afin de gagner du temps tout en restant personnalisé._

- ✅ Depuis une candidature, choisir un template génère le message avec les variables remplacées par les vraies valeurs
- ✅ Une variable sans valeur (ex. contact inconnu) est signalée visuellement, pas remplacée par du vide

_(Les user stories complètes sont maintenues dans le backlog GitHub Projects — ce document ne liste que les structurantes.)_

## 7. Modèle de données (haut niveau)

```
Establishment (id, name)                       — D1, aucun écran au MVP
  └─ 1:N ─ Cohort (id, name, establishmentId)   — D1, aucun écran au MVP

User (id, email, passwordHash, role, reminderDelayDays, cohortId?)
  └─ 1:N ─ Application (id, company, position, channel, offerUrl, contactName,
                        contactEmail, notes, status, createdAt)
              ├─ 1:N ─ StatusHistory (id, fromStatus, toStatus, changedAt)
              └─ 1:N ─ Reminder (id, scheduledAt, sentAt, status)

Template (id, type, title, body)          — géré par ADMIN
Tip (id, targetStatus, title, content)    — géré par ADMIN
```

Points de conception :

- **D1 — Multi-tenant** : `Establishment` et `Cohort` sont créées dès la première migration, avec `User.cohortId` nullable. Aucun écran école n'existe au MVP ; poser les tables maintenant évite une migration douloureuse plus tard.
- `status` : enum stricte côté BDD **et** côté TypeScript (source de vérité partagée via zod, dans `packages/shared`)
- Les transitions d'état valides sont définies dans une machine à états côté service — pas dans le controller, pas dans le front
- Le schéma détaillé (types, index, contraintes) vit dans `prisma/schema.prisma` ; ce diagramme donne l'intention

## 8. Choix techniques justifiés

> Règle : chaque choix mentionne l'alternative écartée et le motif. C'est ce qui rend le document défendable en entretien.

| Domaine        | Choix                                                 | Alternatives écartées | Justification                                                                                                                                                                                       |
| -------------- | ----------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend        | **NestJS (TypeScript)**                               | Express nu, Fastify   | Architecture en modules imposée (bonne pratique à démontrer), injection de dépendances, très demandé sur le marché français                                                                         |
| BDD            | **PostgreSQL**                                        | MongoDB               | Données fortement relationnelles (users → applications → historique), besoins d'agrégations pour les stats                                                                                          |
| ORM            | **Prisma**                                            | TypeORM               | Types générés automatiquement, migrations simples, DX moderne                                                                                                                                       |
| Jobs & rappels | **Cron quotidien + table `Reminder`** (D2)            | BullMQ + Redis        | Le volume (1 balayage/jour) ne justifie pas Redis + une file ; la table `Reminder` persiste l'état et garantit l'absence de double envoi. BullMQ reporté en V2 si le besoin de retry/scale apparaît |
| Emails         | **Resend** (ou Brevo)                                 | SMTP maison           | Délivrabilité gérée, tier gratuit suffisant, API simple                                                                                                                                             |
| Frontend       | **React + Vite + TypeScript**                         | Next.js               | Une SPA suffit (pas de besoin SEO) ; Next.js envisagé en V2 pour la partie publique/marketing                                                                                                       |
| Data fetching  | **TanStack Query**                                    | Redux + fetch maison  | Cache, invalidation et optimistic updates (indispensable pour le kanban fluide)                                                                                                                     |
| Formulaires    | **React Hook Form + zod**                             | Formik                | Schémas de validation **partagés** entre front et back                                                                                                                                              |
| UI             | **Tailwind CSS + shadcn/ui**                          | MUI                   | Rapidité sans design figé, composants accessibles                                                                                                                                                   |
| Tests          | **Vitest + Supertest + Testing Library + Playwright** | Jest                  | Vitest natif Vite ; Playwright pour 2-3 parcours E2E critiques                                                                                                                                      |
| Infra          | **Docker + GitHub Actions + Railway**                 | VPS dès le départ     | Déploiement continu simple d'abord ; migration VPS/nginx prévue au mois 4 comme exercice                                                                                                            |

## 9. Exigences non fonctionnelles

- **Sécurité** : hash argon2, rate limiting sur l'auth, validation zod de toute entrée, headers helmet, protection contre l'accès aux données d'autrui testée (US-01)
- **RGPD (D4)** : la suppression de compte = suppression **effective en cascade** des `Application`, `StatusHistory` et `Reminder` de l'utilisateur (pas d'anonymisation au MVP). Contrainte `onDelete: Cascade` dans le schéma Prisma et test réel de la suppression (pas seulement codée). Pas de donnée sensible au-delà du nécessaire.
- **Performance** : réponse API < 300 ms sur les endpoints du pipeline ; pagination des listes
- **Qualité** : couverture de tests ≥ 70 % sur les services métier ; CI bloquante (lint + tests) sur toute PR
- **Accessibilité** : kanban utilisable au clavier, labels de formulaires, contrastes AA

## 10. Risques & hypothèses

| Risque                                                   | Probabilité | Mitigation                                                                                   |
| -------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| Dérive du scope (« et si j'ajoutais… »)                  | **Élevée**  | Section §5 + toute nouvelle idée va dans le backlog V2, jamais dans le sprint courant        |
| Sous-estimation des relances automatiques (jobs, emails) | Moyenne     | Spike technique de 2h en début de Phase 2 pour valider l'envoi Resend + le balayage cron     |
| Manque de temps (10-20h/sem)                             | Moyenne     | MVP découpé en jalons livrables indépendamment ; F6 (stats) est la première coupée si retard |
| Drag & drop kanban complexe                              | Faible      | Librairie éprouvée (dnd-kit) plutôt qu'une implémentation maison                             |

**Hypothèses :** les utilisateurs acceptent de saisir manuellement leurs candidatures (validé si mes 10 premiers utilisateurs le font) ; un rappel email suffit (pas besoin de push/SMS au MVP).

## 11. Jalons

Dates (D6) ancrées sur `docs/roadmap.md`, S1 = semaine du 2026-07-21 (Phase 0, faite). À ajuster si le rythme réel diffère.

| Jalon             | Échéance       | Contenu                                              | Critère de sortie                             |
| ----------------- | -------------- | ---------------------------------------------------- | --------------------------------------------- |
| M1 — Socle API    | **2026-08-17** | Auth, CRUD candidatures, machine à états             | Tests d'intégration verts, Swagger publié     |
| M2 — API complète | **2026-09-07** | Relances (cron + `Reminder`), templates, astuces     | US-01 à 04 validées côté API                  |
| M3 — Front MVP    | **2026-10-05** | Kanban, formulaires, templates, indicateurs d'effort | Parcours complet utilisable, 2 tests E2E      |
| M4 — Production   | **2026-10-26** | Docker, CI/CD, déploiement, Sentry, 5 bêta-testeurs  | URL publique, pipeline vert, premiers retours |

## 12. Glossaire

- **Pipeline** : ensemble des candidatures d'un utilisateur, organisées par état
- **Relance** : message envoyé au recruteur après une période sans réponse
- **Rappel** : notification envoyée à l'utilisateur pour l'inciter à relancer

## 13. Modèle économique (hypothèses à valider)

> Section volontairement **hypothétique** au stade MVP. L'objectif est de la corriger avec des données réelles après les entretiens de la Phase 5 (voir `docs/roadmap.md`), pas de figer un business plan aujourd'hui.

- **MVP** : gratuit, pour lever la friction et recruter les 10 premiers utilisateurs réels. Aucune monétisation tant que l'usage n'est pas prouvé (métrique de survie : des candidatures créées en semaine 3).
- **Piste B2C (V2)** : freemium — suivi illimité gratuit, fonctions avancées payantes (templates IA, statistiques de résultat, multi-recherches).
- **Piste B2B / écoles (V2+)** : c'est la raison des tables `Establishment`/`Cohort` (D1). Une école privée paierait un tableau de bord agrégé — **volumes et alertes uniquement**, jamais le contenu des messages ni le détail des refus (D3). Modèle probable : abonnement par promo ou par étudiant.
- **À vérifier en Phase 5** : les 3 conversations avec des responsables relations entreprises servent à comprendre les budgets réels et l'appétence, **pas à vendre**. Cette section sera réécrite avec ces apprentissages.

---

## 📎 Annexe méthode — pourquoi ce document est structuré ainsi

Cette annexe est pour toi, pas pour le document final. Les principes réutilisables sur n'importe quel projet :

1. **§1-2 avant tout** : problème et objectifs mesurables. Si tu ne peux pas les écrire, tu n'es pas prêt à coder.
2. **§5 (hors périmètre) est la section la plus « senior »** : dire non explicitement, avec les raisons, c'est ce qui rend un projet livrable.
3. **§6 : des critères d'acceptation testables**, en format Étant donné / Quand / Alors implicite. Ils deviennent tes tests — la spécification et la vérification sont le même document.
4. **§8 : jamais un choix sans alternative écartée.** « Pourquoi Prisma ? » en entretien → tu as déjà la réponse écrite.
5. **§10 : nommer les risques ne les fait pas disparaître, mais les rend gérables.** Le risque n°1 de tout projet perso est toujours la dérive du scope.
6. **Document vivant** : commite-le dans `/docs`, mets-le à jour via PR quand une décision change. L'historique Git de ce fichier racontera l'évolution de ta réflexion — très fort en entretien.
