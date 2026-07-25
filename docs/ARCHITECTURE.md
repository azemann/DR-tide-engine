# Architecture de DR Tide Engine

## Principe

Le moteur ne connaît ni Alexa, ni interface web, ni appareil particulier. Il reçoit une station, une période et des options, puis retourne des données métier normalisées.

```text
Client
  ↓
TideService
  ├── StationRepository
  ├── HarmonicPredictor
  ├── ExtremumDetector
  ├── LocalCorrectionService
  └── ValidationService
```

## Modules

### `stations`

Charge les métadonnées, constantes, licences et références verticales. Refuse les stations incompatibles avec le mode de diffusion demandé.

### `harmonic`

Calcule une série temporelle à partir des constituants harmoniques. Le moteur de référence externe et notre moteur pédagogique devront pouvoir être comparés.

### `extrema`

Détecte les changements de pente afin d'identifier pleines et basses mers. Une interpolation locale affine ensuite l'heure de l'extrême.

### `corrections`

Associe une commune à une station validée et applique des corrections temporelles ou de hauteur documentées.

### `validation`

Compare les événements calculés à une référence sur une période définie et produit : erreur moyenne, médiane, maximum, taux de correspondance et statut.

### `exports`

Expose des formats stables pour les clients : JSON annuel, API locale, CSV de contrôle et futur paquet npm.

## Contrat métier envisagé

```ts
export interface TideRequest {
  placeId: string;
  from: string;
  to: string;
  timezone: string;
}

export interface TideEvent {
  type: "high" | "low";
  datetimeUtc: string;
  localTime: string;
  heightMeters?: number;
  stationId: string;
  validationStatus: "candidate" | "testing" | "validated" | "rejected";
}
```

## Ordre de réalisation

1. inventaire et filtrage des stations ;
2. prédiction d'une station de référence ;
3. génération d'une courbe sur 24 heures ;
4. détection automatique des extrêmes ;
5. validation de Ouistreham et du Havre ;
6. corrections locales Côte Fleurie ;
7. export JSON ;
8. intégration dans `skill-mar-e`.
