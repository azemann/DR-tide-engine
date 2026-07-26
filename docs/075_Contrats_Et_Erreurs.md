# Contrats, erreurs et compatibilité

## Contrats internes et externes

| ID | Producteur | Consommateur | Format/version | Validation | Compatibilité |
| --- | --- | --- | --- | --- | --- |
| CT-001 | `StationRepository` | orchestration CLI et futurs clients | interfaces TypeScript 0.1 | tests de stations | additions compatibles jusqu'à décision contraire |
| CT-002 | `TidePredictor` | orchestration CLI et futurs détecteurs | interfaces TypeScript 0.1 | tests de série | la fenêtre reste semi-ouverte |
| CT-003 | CLI `predict` | humain ou client de diagnostic | JSON 0.1 | test déterministe | toute rupture exige ADR et version |
| CT-004 | `detectTideEvents` | futurs validateurs et clients | interfaces TypeScript, méthode `discrete-local-extremum-v1` | tests synthétiques et réels | toute modification de plateau, borne ou temps change la version de méthode |

## Modèle d’erreur

Une erreur importante précise :

- catégorie stable ;
- cause technique conservée sans être exposée inutilement ;
- message utilisateur compréhensible ;
- caractère récupérable ou non ;
- action recommandée ;
- identifiant de corrélation lorsque pertinent ;
- données qu’il est interdit d’inscrire dans les journaux.

| Code | Situation | Message utilisateur | Récupération | Journalisation |
| --- | --- | --- | --- | --- |
| `INVALID_STATION_ID` | identifiant vide ou mal formé | identifiant de station invalide | corriger `--station` | code et valeur non sensible |
| `STATION_NOT_FOUND` | aucune station correspondante | station inconnue | choisir un identifiant disponible | identifiant |
| `STATION_NOT_HARMONIC` | station sans constituants exploitables | station non harmonique | choisir une station de référence | identifiant et type |
| `STATION_LICENSE_REJECTED` | `commercial_use` n'est pas vrai | licence incompatible avec la politique V1 | choisir une station autorisée | identifiant et type de licence |
| `INVALID_PREDICTION_REQUEST` | date, fenêtre ou pas invalide | requête de prédiction invalide | corriger les arguments | champ invalide |
| `INVALID_PREDICTION_RESULT` | résultat externe incohérent ou non fini | le calculateur a produit un résultat invalide | vérifier versions et station | station et index, jamais de secret |
| `INVALID_EVENT_SOURCE_SERIES` | série incomplète, non finie, désordonnée ou désalignée | impossible de détecter des événements dans cette série | corriger le producteur de série | station et compteurs de diagnostic |
| `CLI_USAGE_ERROR` | arguments absents ou inconnus | utilisation invalide de la commande | consulter l'usage | aucun détail sensible |

## Versionnement

Le JSON de la CLI est un contrat de développement en version 0.1. Une rupture
de nom, unité, borne temporelle ou sens de hauteur exige une décision explicite.
Il n'existe pas encore d'API publique ni de sauvegarde.

## Idempotence et répétition

La prédiction est pure à versions, station et requête identiques. Elle est
relançable et n'écrit aucune donnée. Seule la sortie standard est produite.
