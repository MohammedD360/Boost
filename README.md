laura@MacBook-Air-de-Laura-4 ~ % cd boost
laura@MacBook-Air-de-Laura-4 boost % mkdir docs 
laura@MacBook-Air-de-Laura-4 boost % touch README.md
laura@MacBook-Air-de-Laura-4 boost % >....                                                                                                                                                              

9. Exigences non fonctionnelles
Sécurité : hash argon2, rate limiting sur l'auth, validation zod de toute entrée, headers helmet, protection contre l'accès aux données d'autrui testée (US-01)
RGPD : suppression de compte = suppression effective des données ; pas de donnée sensible au-delà du nécessaire
Performance : réponse API < 300 ms sur les endpoints du pipeline ; pagination des listes
Qualité : couverture de tests ≥ 70 % sur les services métier ; CI bloquante (lint + tests) sur toute PR
Accessibilité : kanban utilisable au clavier, labels de formulaires, contrastes AA
10. Risques & hypothèses
Risque
Probabilité
Mitigation
Dérive du scope (« et si j'ajoutais… »)
Élevée
Section §5 + toute nouvelle idée va dans le backlog V2, jamais dans le sprint courant
Sous-estimation des relances automatiques (jobs, emails)
Moyenne
Spike technique de 2h en début de mois 2 pour valider BullMQ + Resend
Manque de temps (10-20h/sem)
Moyenne
MVP découpé en jalons livrables indépendamment ; F6 (stats) est la première coupée si retard
Drag & drop kanban complexe
Faible
Librairie éprouvée (dnd-kit) plutôt qu'une implémentation maison

Hypothèses : les utilisateurs acceptent de saisir manuellement leurs candidatures (validé si mes 10 premiers utilisateurs le font) ; un rappel email suffit (pas besoin de push/SMS au MVP).
11. Jalons
Jalon
Échéance
Contenu
Critère de sortie
M1 — Socle API
Fin mois 2, sem. 2
Auth, CRUD candidatures, workflow d'états
Tests d'intégration verts, Swagger publié
M2 — API complète
Fin mois 2
Relances (BullMQ), templates, astuces, stats
US-01 à 04 validées côté API
M3 — Front MVP
Fin mois 3
Kanban, formulaires, templates, stats
Parcours complet utilisable, 2 tests E2E
M4 — Production
Fin mois 4
Docker, CI/CD, déploiement, Sentry, 5 bêta-testeurs
URL publique, pipeline vert, premiers retours

12. Glossaire
Pipeline : ensemble des candidatures d'un utilisateur, organisées par état
Relance : message envoyé au recruteur après une période sans réponse
Rappel : notification envoyée à l'utilisateur pour l'inciter à relancer

 Annexe méthode — pourquoi ce document est structuré ainsi
Cette annexe est pour toi, pas pour le document final. Les principes réutilisables sur n'importe quel projet :
§1-2 avant tout : problème et objectifs mesurables. Si tu ne peux pas les écrire, tu n'es pas prêt à coder.
§5 (hors périmètre) est la section la plus « senior » : dire non explicitement, avec les raisons, c'est ce qui rend un projet livrable.
§6 : des critères d'acceptation testables, en format Étant donné / Quand / Alors implicite. Ils deviennent tes tests — la spécification et la vérification sont le même document.
§8 : jamais un choix sans alternative écartée. « Pourquoi Prisma ? » en entretien → tu as déjà la réponse écrite.
§10 : nommer les risques ne les fait pas disparaître, mais les rend gérables. Le risque n°1 de tout projet perso est toujours la dérive du scope.
Document vivant : commite-le dans /docs, mets-le à jour via PR quand une décision change. L'historique Git de ce fichier racontera l'évolution de ta réflexion — très fort en entretien.
