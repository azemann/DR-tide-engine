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
- `TideSeries` : métadonnées de fenêtre et échantillons ordonnés.

## Relations

Une station possède une source, une licence et au moins un constituant. Une
requête porte exactement une station. Une série répond à une requête et contient
zéro ou plusieurs échantillons ; la tranche de 24 heures en contient 288.

## Invariants

- la station est harmonique, commercialement utilisable et indépendante du type externe ;
- le début et la fin sont des instants UTC valides et `début < fin` ;
- le pas est un nombre entier de minutes strictement positif ;
- les échantillons appartiennent à `[début, fin[` et sont strictement ordonnés ;
- toutes les amplitudes, phases et hauteurs sont des nombres finis ;
- la source et la licence de la série sont celles de la station calculée.

## Commandes ou actions métier

| Action | Entrées | Préconditions | Résultat | Erreurs attendues |
| --- | --- | --- | --- | --- |
| trouver une station | `StationId` | identifiant valide | `HarmonicStation` ou absence | station inconnue, type ou données invalides, licence refusée |
| prédire une série | `PredictionRequest` | station et fenêtre valides | `TideSeries` | requête invalide, résultat externe non fini ou incohérent |

## Événements significatifs

La première tranche ne produit aucun événement métier de marée. Les extrema
seront introduits dans un jalon distinct après validation de la série.

## États et transitions

Les objets de la première tranche sont immuables. Il n'existe pas de cycle
d'état persistant : une requête est soit refusée, soit transformée en série.
