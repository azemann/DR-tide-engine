# DR Tide Engine

> Moteur open source de prédiction et de validation des marées, indépendant de toute interface Alexa, web ou mobile.

## Objectif

DR Tide Engine doit :

- charger des stations et leurs constantes harmoniques ;
- calculer une courbe de hauteur d'eau dans le temps ;
- détecter automatiquement pleines et basses mers ;
- déterminer si la mer monte ou descend ;
- appliquer plus tard des corrections locales par commune ;
- produire des résultats traçables, attribués et validés.

La Côte Fleurie constitue le périmètre pilote. La future Skill Alexa `skill-mar-e` sera un client du moteur, pas son cœur.

## Périmètre V1

- Cabourg
- Dives-sur-Mer
- Houlgate
- Villers-sur-Mer
- Deauville
- Trouville-sur-Mer
- Villerville
- Honfleur

Stations candidates autorisant l'usage commercial :

- Ouistreham — TICON-4 / CC BY 4.0 ;
- Le Havre — TICON-4 / CC BY 4.0.

Les stations CC BY-NC sont exclues du chemin de publication.

## Architecture cible

```text
src/
├── domain/         types et règles métier
├── stations/       chargement et sélection des stations
├── harmonic/       calcul harmonique
├── extrema/        détection pleines/basses mers
├── corrections/    corrections locales
├── validation/     comparaison aux références
└── exports/        JSON, CSV, API
```

## Première brique disponible

L'inventaire recherche les stations harmoniques autour des communes de la Côte Fleurie et conserve distance, licence, datum et nombre de constituants.

```bash
npm install
npm run inventory
```

Résultat local :

```text
data/generated/inventory-results.json
```

## Règle de publication

Aucun port ne passe au statut `validated` avant :

1. vérification de la licence ;
2. identification du datum lorsque des hauteurs sont publiées ;
3. comparaison des heures de pleine et basse mer ;
4. mesure des erreurs moyenne et maximale ;
5. attribution claire des sources.

La V1 privilégie les horaires et la tendance. Les hauteurs et coefficients viendront après validation de leur référence.
