# Adoption progressive du template

## Décision

Le template possède un noyau commun et deux portes d’entrée temporaires :

- `new` part d’une intention et atteint `bootstrap` ;
- `existing` part des preuves du dépôt et atteint `discovery` ;
- les deux convergent à `development`.

Les niveaux suivants sont communs : `release`, `distribution`, puis `operation`.

## Deux axes distincts

Le niveau d’adoption répond à la question « quelle preuve la méthode demande-t-elle maintenant ? ».

La portée de livraison répond à la question « à quelle frontière appartient cette opération logicielle ? ».

| Niveau d’adoption | Preuve recherchée |
| --- | --- |
| `bootstrap` | intention, périmètre et première tranche raccordés |
| `discovery` | projet réel ou projeté suffisamment compris |
| `development` | tranche développable et vérifiable |
| `release` | artefact productible, immuable et qualifié |
| `distribution` | release publiable ou déployable sans reconstruction |
| `operation` | système observable, maintenable et récupérable |

Un niveau n’active pas automatiquement le suivant.

## Manifeste d’adoption

`project.adoption.yaml` décrit :

- l’origine et le niveau courant ;
- les profils actifs ;
- les préoccupations transversales actives, différées ou non applicables ;
- la correspondance entre rôles documentaires et chemins réels.

Il ne remplace ni `project.yaml`, ni `PROJECT_STATE.md`.

## Rôles plutôt que chemins imposés

Une exigence porte sur un rôle tel que `vision`, `architecture` ou `quality-tests`. Le projet choisit son chemin :

```yaml
documents:
  architecture:
    path: docs/system/overview.md
    status: active
```

Ainsi, un projet existant n’a pas à déplacer sa documentation vers la numérotation du template.

## Statuts et obligation

L’obligation `required` est calculée par le niveau, les profils et les préoccupations. Le projet ne peut pas la choisir.

Les seuls statuts déclarables sont :

- `active` : applicable maintenant ; le chemin doit exister et ne plus contenir de variable de template ;
- `deferred` : applicable plus tard ; `until` et `reason` sont obligatoires ;
- `not-applicable` : sans objet pour ce projet ; `reason` est obligatoire.

Un invariant central ou une exigence rendue obligatoire par un profil ne peut pas être neutralisé par `not-applicable`.

## Profils et préoccupations

Les profils décrivent une famille de projet : `software`, `android`, `linux-service`, `web-pwa`, `game`, `research-simulation` ou `dr-engineering`.

Les préoccupations activent des exigences transversales que le type de projet ne suffit pas à déduire :

- `user-interface` ;
- `persistent-data` ;
- `sensitive-data` ;
- `network-access` ;
- `authentication` ;
- `multi-user` ;
- `background-service` ;
- `assets` ;
- `automated-delivery`.

Une préoccupation omise n’est pas réputée active.

Les identifiants de préoccupations sont fermés : une faute de frappe est une
erreur, car elle ne doit jamais désactiver silencieusement une exigence de
sécurité ou d'exploitation. Ajouter une nouvelle préoccupation exige d'ajouter
simultanément ses règles machine.

## Validation cumulative

```bash
./scripts/check-project.sh bootstrap
./scripts/check-project.sh discovery
./scripts/check-project.sh development
./scripts/check-project.sh release
./scripts/check-project.sh distribution
./scripts/check-project.sh operation
```

Sans niveau explicite, le script lit `adoption.current_level`.

Le contrôle :

- valide les deux manifestes possédés par la méthode ;
- calcule les rôles exigibles ;
- ignore les placeholders des documents différés ;
- refuse les placeholders des documents actifs ;
- explique la provenance d’une exigence ;
- fournit une prochaine action ;
- exécute localement les mêmes validations que la CI.

`READY` signifie que le contrat déclaratif demandé est cohérent. Ce statut ne
remplace ni la revue du contenu, ni l'exécution des commandes du projet, ni une
preuve fonctionnelle. Un document actif vide est refusé ; sa qualité reste une
responsabilité humaine proportionnée au risque.

## Non-destructivité

Le diagnostic d’un projet existant :

- ne crée ni ne modifie aucun fichier ;
- n’installe aucune dépendance ;
- n’exécute aucun script du dépôt ;
- ne modifie ni Git, ni lockfile, ni workflow ;
- distingue observation et inférence.

Toute intégration commence après validation humaine du rapport.
