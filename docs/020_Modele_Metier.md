# Modèle métier

## Entités

### Station harmonique

- **Rôle :** fournir les métadonnées et constantes nécessaires à une prédiction.
- **Identité :** `StationId` opaque, stable dans le référentiel adapté.
- **Cycle de vie :** chargée à la demande ; immuable dans une exécution.
- **Propriétaire de la vérité :** `StationRepository`, alimenté actuellement par
  `@neaps/tide-database`.

## Objets-valeurs

- `StationId` : identifiant non vide validé à la frontière ;
- `StationMetadata` : nom et coordonnées ;
- `StationSource` : nom, identifiant amont et URL ;
- `StationLicense` : type, URL et autorisation commerciale ;
- `HarmonicConstituent` : nom, amplitude et phase finis ;
- `PredictionRequest` : station normalisée, début, fin et pas ;
- `TideSample` : instant UTC et hauteur brute finie ;
- `TideSeriesStation` : identité, fuseau IANA, source et licence de la station
  attachés à une série ;
- `TideSeries` : métadonnées de fenêtre UTC et échantillons ordonnés.
- `TideSeriesDiagnostics` : mesure immuable de la structure d'une série
  existante : effectif attendu, trous, doublons, ordre, régularité, valeurs non
  finies, minimum, maximum et amplitude bruts.
- `TideEventType` : `high` ou `low` ;
- `TideEventTime` : instant d'un échantillon strict ou bornes échantillonnées
  d'un plateau ;
- `TideEvent` : extremum brut avec provenance, licence, méthode et
  qualification ;
- `TideEventsResult` : événements ordonnés et métadonnées de la série source.

## Relations

Une station possède une source, une licence et au moins un constituant. Une
requête porte exactement une station. Une série répond à une requête et contient
zéro ou plusieurs échantillons ; la tranche de 24 heures en contient 288.
Un résultat d'événements dérive d'une seule série et chaque événement reprend sa
station, sa source et sa licence.

## Invariants

- la station est harmonique, commercialement utilisable et indépendante du type externe ;
- le début et la fin sont des instants UTC valides et `début < fin` ;
- le pas est un nombre entier de minutes strictement positif ;
- les échantillons appartiennent à `[début, fin[` et sont strictement ordonnés ;
- toutes les amplitudes, phases et hauteurs sont des nombres finis ;
- la source et la licence de la série sont celles de la station calculée.
- le fuseau de la série est celui de la station ; il sert uniquement à projeter
  les instants UTC en heure civile locale ;
- une série source invalide n'est ni triée ni corrigée par le détecteur ;
- les deux bornes de la série ne sont jamais qualifiées comme extrema ;
- un plateau est qualifié uniquement lorsqu'il possède deux voisins externes ;
- l'ordre des événements suit l'ordre des échantillons, sans interpolation.

## Commandes ou actions métier

| Action | Entrées | Préconditions | Résultat | Erreurs attendues |
| --- | --- | --- | --- | --- |
| trouver une station | `StationId` | identifiant valide | `HarmonicStation` ou absence | station inconnue, type ou données invalides, licence refusée |
| prédire une série | `PredictionRequest` | station et fenêtre valides | `TideSeries` | requête invalide, résultat externe non fini ou incohérent |
| diagnostiquer une série | `TideSeries` | fenêtre divisible et pas positif | `TideSeriesDiagnostics` | métadonnées de fenêtre invalides |
| détecter les événements | `TideSeries` | diagnostic structurel conforme | `TideEventsResult` | série source invalide |

## Événements significatifs

M2 produit des événements discrets `high` et `low`. Ils sont dérivés du calcul,
pas observés ni validés extérieurement. Une étale physique n'est pas déduite
d'un plateau de cinq minutes.

## États et transitions

Les objets de la première tranche sont immuables. Il n'existe pas de cycle
d'état persistant : une requête est soit refusée, soit transformée en série.
Le diagnostic lit la série sans la corriger ni la remplacer.
Le détecteur suit la même règle et produit un nouvel objet immuable.
