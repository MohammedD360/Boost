# Plan de route — Boost

### Document d'exécution — complément du cahier des charges

|                 |                                                                                     |
| --------------- | ----------------------------------------------------------------------------------- |
| **Emplacement** | `/docs/roadmap.md` dans le repo                                                     |
| **Statut**      | À dater par toi (remplacer S1, S2… par de vraies dates)                             |
| **Règle d'or**  | Une phase ne commence pas tant que la précédente n'est pas _terminée_ au sens du §7 |

---

## 0. Les six décisions à verrouiller avant d'écrire une ligne de code

Ces décisions sont coûteuses à défaire. Elles se prennent maintenant, s'écrivent dans le cahier des charges, et ne se rediscutent plus avant la V2.

| #   | Décision                                | Recommandation                                                                                            | Statut |
| --- | --------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------ |
| D1  | Multi-tenant (école → promo → étudiant) | Tables posées dès la première migration, aucun écran école au MVP                                         | ☐      |
| D2  | Jobs : BullMQ ou cron                   | Cron quotidien + table `Reminder` comme garde-fou ; BullMQ seulement si choix pédagogique assumé          | ☐      |
| D3  | Périmètre de visibilité école           | L'école voit des volumes et des alertes, jamais le contenu des messages ni le détail des refus            | ☐      |
| D4  | Politique RGPD sur suppression          | Cascade sur `StatusHistory` et `Reminder`, ou anonymisation ? Trancher et écrire                          | ☐      |
| D5  | Statistiques : effort ou résultat       | Effort (envoyées cette semaine, relances faites, en attente de relance). Pas de taux de conversion au MVP | ☐      |
| D6  | Dates réelles des jalons                | Remplacer « fin mois 2 » par des dates ; un jalon sans date n'est pas un jalon                            | ☐      |

**Sortie de cette étape :** le cahier des charges est mis à jour par une PR qui intègre ces six décisions, plus la nouvelle section §13 (modèle économique).

---

## 1. Phase 0 — Fondations (S1, ~1 semaine)

Objectif : ne plus jamais avoir à s'occuper de l'outillage ensuite.

- [ ] Repo GitHub, branche `main` protégée (pas de push direct)
- [ ] GitHub Projects : colonnes `Backlog / Sprint / En cours / Revue / Fait`
- [ ] Toutes les US du §6 créées en issues, étiquetées par jalon (M1 → M4)
- [ ] Monorepo ou deux dossiers `api/` et `web/` — trancher et ne plus y revenir
- [ ] `docker-compose.yml` : PostgreSQL en local (+ Redis seulement si D2 = BullMQ)
- [ ] ESLint + Prettier + hooks de pré-commit
- [ ] CI GitHub Actions : lint + tests, bloquante sur PR, dès le premier commit
- [ ] Un test bidon qui passe, pour valider que la CI fonctionne réellement
- [ ] `docs/` contient le cahier des charges et ce plan

> **Piège classique :** mettre en place la CI au mois 3. À ce stade elle est douloureuse à ajouter et tu la sabotes. Elle se pose vide, le premier jour.

---

## 2. Phase 1 — Socle API (S2 à S4)

Correspond à M1. Objectif : l'API sait gérer des candidatures, avec une isolation entre utilisateurs prouvée par des tests.

### Ordre de travail

1. **Schéma Prisma complet**, y compris `Establishment` et `Cohort` (D1). Première migration.
2. **Auth** : inscription, connexion, hash argon2, rôles `USER` / `ADMIN`, rate limiting.
3. **Machine à états** dans un module de service dédié, avec ses tests unitaires **avant** tout controller. C'est le cœur métier, il se teste isolément.
4. **CRUD candidatures** + application systématique du filtre par utilisateur.
5. **Historique de statut** alimenté automatiquement à chaque transition.
6. **Swagger** publié.

### Sortie de phase

- [ ] US-01 et US-02 vertes en tests d'intégration
- [ ] Un test prouve explicitement qu'un utilisateur ne peut pas lire les candidatures d'un autre
- [ ] Une transition invalide renvoie bien 422
- [ ] Swagger accessible et à jour

---

## 3. Phase 2 — Relances, templates, astuces (S5 à S7)

Correspond à M2.

1. **Spike de 2 h** sur l'envoi d'email (Resend) : un email part vraiment, en conditions réelles. À faire **en premier**, avant tout le reste de la phase.
2. **Détection des candidatures à relancer** : une requête, testée sur des jeux de dates.
3. **Envoi + journalisation** dans `Reminder`. L'absence de double envoi se teste explicitement.
4. **Templates** : CRUD admin, moteur de substitution de variables, variable manquante signalée et non remplacée par du vide.
5. **Astuces** : CRUD admin, association à un état.

### Sortie de phase

- [ ] US-03 et US-04 vertes
- [ ] Un rappel envoyé deux fois est impossible, prouvé par un test
- [ ] Le changement d'état retire bien la candidature du périmètre de rappel

---

## 4. Phase 3 — Front MVP (S8 à S11)

Correspond à M3. Règle : aucune fonctionnalité nouvelle côté API pendant cette phase.

### Ordre de travail

1. Base React + Vite + Tailwind + shadcn/ui, thème sobre défini une fois pour toutes
2. Auth et routes protégées
3. **Kanban** avec dnd-kit, machine à états importée depuis le paquet partagé
4. Formulaire de candidature — contrainte de conception : **moins de 30 secondes** pour en créer une
5. Champ « coller l'URL de l'offre » qui pré-remplit entreprise et intitulé, même imparfaitement
6. Génération de message depuis un template, copie en un clic
7. Astuces contextuelles
8. Indicateurs d'effort (D5)

### Sortie de phase

- [ ] Parcours complet utilisable de bout en bout par quelqu'un d'autre que toi
- [ ] 2 tests E2E Playwright : créer une candidature, la faire avancer
- [ ] Kanban utilisable au clavier, labels de formulaire, contrastes AA

---

## 5. Phase 4 — Mise en production (S12 à S14)

Correspond à M4.

- [ ] Dockerfiles API et front
- [ ] Pipeline de déploiement continu sur Railway
- [ ] Variables d'environnement et secrets propres, rien en dur
- [ ] Sentry branché des deux côtés
- [ ] Sauvegardes de base de données vérifiées (une restauration testée, pas seulement configurée)
- [ ] Page vitrine minimale : problème, capture d'écran, inscription
- [ ] Mentions légales et politique de confidentialité
- [ ] README soigné : le recruteur lit ça en premier

### Sortie de phase

- [ ] URL publique fonctionnelle
- [ ] Pipeline vert de bout en bout
- [ ] Toi-même en train d'utiliser Boost pour tes propres candidatures

---

## 6. Phase 5 — Premiers utilisateurs réels (S15 et au-delà)

C'est la phase que tout le monde saute, et c'est celle qui fait la différence.

- [ ] 5 bêta-testeurs recrutés (camarades de promo en recherche d'alternance)
- [ ] Un entretien de 20 min avec chacun après deux semaines d'usage
- [ ] Les frictions relevées deviennent des issues, priorisées par fréquence
- [ ] En parallèle : 3 conversations avec des responsables relations entreprises d'écoles privées — **pour comprendre, pas pour vendre**
- [ ] Section §13 du cahier des charges corrigée avec ce que tu as appris sur les budgets réels

**Métrique de survie :** combien d'utilisateurs ont créé une candidature en semaine 3 ? Si c'est zéro, le problème est la friction de saisie, pas le manque de fonctionnalités.

---

## 7. Définition de « terminé »

Une tâche n'est finie que si **tous** ces points sont vrais. Pas de « je finirai les tests plus tard ».

- [ ] Le code est sur une branche, poussé via PR
- [ ] La CI est verte (lint + tests)
- [ ] Les critères d'acceptation de l'US sont couverts par un test
- [ ] Le cahier des charges est à jour si une décision a changé
- [ ] L'issue GitHub est fermée par le merge

---

## 8. Rituels hebdomadaires

Trente minutes par semaine, non négociables.

| Quand      | Quoi                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------- |
| Lundi      | Choisir les issues du sprint. Aucune issue hors sprint ne rentre en cours de semaine              |
| En continu | Toute nouvelle idée va dans `Backlog V2`. Jamais dans le sprint courant                           |
| Vendredi   | Relire l'avancement vs jalon. Si retard > 1 semaine, couper du périmètre — pas ajouter des heures |

---

## 9. Le tableau des coupes

Décidé à froid, maintenant, pour ne pas décider dans la panique. Si le calendrier dérape, on coupe dans cet ordre :

1. Astuces contextuelles (F5)
2. Statistiques d'effort (F6)
3. Templates réduits à deux modèles en dur
4. E2E réduits à un seul parcours

**Ne se coupe jamais :** l'auth, le kanban, les relances. C'est le produit.

---

## 10. Checklist anti-oubli

Les choses qu'on découvre trop tard.

- [ ] Les mots de passe ne sont jamais journalisés
- [ ] Les emails de rappel ont un lien de désinscription
- [ ] Le fuseau horaire est explicite en base (UTC) et converti à l'affichage
- [ ] La suppression de compte est testée réellement, pas seulement codée
- [ ] Le champ `offerUrl` est validé (pas d'injection via une URL)
- [ ] La CI ne contient aucun secret en clair
- [ ] Le dépôt est public si c'est un projet portfolio — sinon personne ne le lira
- [ ] L'historique Git est propre : des commits lisibles racontent ta démarche mieux qu'un README
