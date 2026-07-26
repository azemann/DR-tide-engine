# DR Tide Engine

> Moteur open source de prédiction et de validation des marées, indépendant de toute interface Alexa, web ou mobile.

Le projet est en phase `development`. Sa licence open source n'est pas encore
choisie : en attendant cette décision, le dépôt est consultable mais ne doit pas
être considéré comme librement redistribuable. Voir [LICENSE.md](LICENSE.md).

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

## Architecture

```text
src/
├── domain/          types, invariants, ports et erreurs
├── application/     orchestration des cas d'usage
├── adapters/neaps/  données de stations et calcul harmonique
└── cli/             arguments et sérialisation, sans logique de marée
```

Le domaine sait désormais dériver des pleines et basses mers discrètes d'une
`TideSeries`. Les corrections, la validation externe et les exports ne sont pas
encore implémentés.

## Installation et validation

```bash
npm ci
npm run typecheck
npm test
```

## Première brique exécutable

Générer une série brute en UTC pour une journée civile :

```bash
npm run predict -- --station ticon/ouistreham-311-fra-refmar --date 2026-07-25
```

Pour rediriger uniquement le JSON, sans l'en-tête informatif de npm :

```bash
npm run --silent predict -- --station ticon/ouistreham-311-fra-refmar --date 2026-07-25
```

La fenêtre est semi-ouverte et contient 288 échantillons, de `00:00` à `23:55`
UTC, avec un pas de cinq minutes. Les hauteurs sont les valeurs brutes du calcul
harmonique, sans correction locale ni revendication de datum validé.

L'inventaire géographique initial reste disponible :

```bash
npm run inventory
```

Résultat local :

```text
data/generated/inventory-results.json
```

## Observatoire local

Afficher la courbe, les événements M2, leurs heures UTC et locales, leur
qualification, la provenance et les limites connues :

```bash
npm run observatory -- --date 2026-07-25
```

Puis ouvrir `http://127.0.0.1:4173`. La page consomme un instantané recalculable
et ne contient aucun calcul de marée.

L'UTC reste la référence du moteur. L'heure locale est dérivée du fuseau IANA
de la station (`Europe/Paris` pour Ouistreham et Le Havre), ce qui applique
automatiquement l'heure d'été ou d'hiver à la date affichée.

## Règle de publication

Aucune station ou hauteur ne passe au statut `validated` avant :

1. vérification de la licence ;
2. identification du datum lorsque des hauteurs sont publiées ;
3. comparaison des heures de pleine et basse mer ;
4. mesure des erreurs moyenne et maximale ;
5. attribution claire des sources.

Les événements actuels sont des extrema discrets non validés extérieurement.
Les hauteurs officielles, tendances, corrections et coefficients viendront
après leurs jalons de validation respectifs.

## Licence et attribution

Le choix de licence du code est ouvert et bloque toute release. Les résultats
conservent la source et la licence de chaque station ; les constantes des deux
stations V1 sont distribuées sous CC BY 4.0 dans la version verrouillée de la
base Neaps.
