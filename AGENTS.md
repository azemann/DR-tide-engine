# Instructions pour les agents

## Mission

Intervenir sur ce projet sans perdre son intention, son vocabulaire ni ses invariants.

## Avant de modifier

1. Lire `project.adoption.yaml`, `PROJECT_STATE.md`, `README.md`, les rôles actifs, les profils et les décisions concernées.
2. Examiner l’état réel du projet et les changements déjà présents ; ne pas confondre capacité prévue et capacité fonctionnelle.
3. Identifier la source de vérité et les invariants touchés.
4. Rechercher un concept existant avant d’introduire un terme ou une abstraction.
5. Distinguer clairement constat, hypothèse, proposition et décision.
6. Vérifier `docs/095_Registre_Audit.md` et ne pas déclarer terminé un point encore ouvert dans le périmètre touché.
7. Vérifier sources, risques, données, flux et échelles lorsque la tâche les affecte.
8. Pour un projet logiciel, lire `project.yaml` et vérifier qu'il correspond aux manifestes, lockfiles, scripts, commandes et cibles réellement présents.
9. Si la livraison est touchée, distinguer opération universelle, politique, orchestrateur, artefact, environnement et cible ; ne jamais écrire une valeur de secret dans le manifeste.
10. Pour une adoption `existing` encore au niveau `discovery`, rester en lecture seule tant que le diagnostic n’a pas été validé.

## Règles

- préserver les changements sans rapport avec la tâche ;
- préférer une modification petite, cohérente et vérifiable ;
- ne pas déplacer la logique métier dans l’interface ;
- ne pas ajouter de dépendance sans justification ;
- ne jamais écrire un secret, jeton ou donnée réelle sensible dans le dépôt, les tests, captures ou journaux ;
- ne pas modifier silencieusement le sens d’un concept ;
- ne pas déclarer dans `PROJECT_STATE.md` une capacité sans preuve proportionnée ;
- ne pas introduire une couleur, une taille, un rayon, une ombre ou une durée arbitraire lorsqu’un token existe ;
- couvrir les états vide, chargement, erreur, succès, indisponible et dégradé lorsqu’ils sont possibles ;
- préserver une cible tactile minimale de 48 px et un focus clavier visible ;
- employer des icônes SVG cohérentes plutôt que des emojis comme éléments d’interface ;
- respecter `prefers-reduced-motion` et ne pas verrouiller le zoom utilisateur ;
- vérifier au minimum téléphone, tablette/fold et bureau pour toute interface responsive ;
- documenter toute décision structurante par une ADR ;
- préserver la compatibilité ou fournir migration, sauvegarde et retour arrière ;
- traiter installation, configuration, démarrage, diagnostic, mise à jour, sauvegarde, restauration et suppression comme un cycle explicite lorsque le projet est distribué ;
- mettre à jour `PROJECT_STATE.md` à la fin de toute tranche qui change l’état réel du projet ;
- alimenter `RETROSPECTIVE.md` à la fin d’un jalon, sans transformer chaque micro-changement en cérémonie ;
- tester proportionnellement au risque ;
- signaler les contradictions au lieu d’en choisir arbitrairement une version.
- ne pas confondre langage, compilateur/interpréteur, runtime, gestionnaire de dépendances, outil de build, framework et plateforme ;
- ne jamais déduire silencieusement une commande depuis une simple convention technologique.
- ne jamais confondre publication d'un artefact, création d'une release et déploiement dans un environnement.
- ne jamais reconstruire un artefact dans la portée `distribution` ;
- ne pas activer release, distribution ou exploitation uniquement parce que leurs modèles existent ;
- préserver les chemins et sources de vérité existants lorsqu’un rôle documentaire peut y être mappé.

## Validation minimale

Avant livraison, exécuter les commandes réellement définies dans `project.yaml`, puis `./scripts/check-project.sh`. Vérifier : comportement demandé, tests pertinents, documentation touchée, absence de secret, cohérence avec le glossaire, accessibilité, rendu visuel, migration et retour arrière lorsque pertinents.

Le résumé final doit distinguer : réalisé et vérifié, réalisé mais non vérifié, non réalisé, risques restants et prochaine action.

## Commandes du projet

La source calculable est `project.yaml`. `defined` exige un `argv` vérifié ; `unresolved`, `not-applicable` et `disabled` exigent une raison.

La validation de la méthode est :

```bash
./scripts/check-project.sh
```

Ne jamais exécuter une commande `unresolved` ni tenter d’interpréter une variable `{{...}}`.
