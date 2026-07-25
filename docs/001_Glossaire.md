# Glossaire canonique

Ce document est normatif.

> Un concept possède un nom canonique. Un nom canonique possède une définition. Toute modification de cette définition constitue une décision explicite.

## Station harmonique

- **Définition :** station de référence possédant des constantes harmoniques
  suffisantes pour calculer directement une prédiction.
- **Ne signifie pas :** commune cible ou port secondaire corrigé.
- **Alias autorisés :** aucun.
- **Représentation technique :** `HarmonicStation`.
- **Source :** ADR-0006.
- **Statut :** accepté.

## Série de marée

- **Définition :** suite strictement chronologique d'échantillons calculés sur
  une fenêtre UTC semi-ouverte et avec un pas constant.
- **Ne signifie pas :** liste d'événements de pleine ou basse mer.
- **Alias autorisés :** série temporelle de marée.
- **Représentation technique :** `TideSeries`.
- **Source :** EF-003.
- **Statut :** accepté.

## Échantillon de marée

- **Définition :** instant UTC et hauteur brute finie produits par le calculateur
  pour une station harmonique.
- **Ne signifie pas :** observation réelle ou hauteur officielle.
- **Alias autorisés :** échantillon.
- **Représentation technique :** `TideSample`.
- **Source :** EF-003 et EC-004.
- **Statut :** accepté.

## Hauteur brute

- **Définition :** ordonnée en mètres retournée par la somme harmonique, sans
  correction locale ni revendication de référence verticale validée.
- **Ne signifie pas :** hauteur SHOM, hauteur observée ou valeur navigable.
- **Alias autorisés :** niveau harmonique brut.
- **Représentation technique :** `height`.
- **Source :** ADR-0006.
- **Statut :** accepté.

## Source de station

- **Définition :** provenance déclarée des métadonnées et constantes d'une
  station, distincte de la bibliothèque qui les distribue.
- **Ne signifie pas :** licence ou calculateur harmonique.
- **Alias autorisés :** source.
- **Représentation technique :** `StationSource`.
- **Source :** format Neaps adapté par DR Tide Engine.
- **Statut :** accepté.

## Licence de station

- **Définition :** conditions déclarées pour l'utilisation des données d'une
  station, incluant explicitement l'autorisation commerciale.
- **Ne signifie pas :** licence du code de la dépendance.
- **Alias autorisés :** licence des données.
- **Représentation technique :** `StationLicense`.
- **Source :** politique V1.
- **Statut :** accepté.

## Règles lexicales

- ne pas employer deux mots pour le même concept sans alias déclaré ;
- ne pas employer le même mot pour deux concepts dans le même contexte ;
- définir les acronymes à leur première occurrence ;
- marquer les définitions provisoires ;
- accompagner tout renommage d’un plan de migration.
