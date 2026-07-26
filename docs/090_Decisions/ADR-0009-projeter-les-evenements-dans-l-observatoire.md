# ADR-0009 — Projeter les événements dans l'observatoire

- **Statut :** accepté
- **Date :** 2026-07-26

## Contexte

M3 doit rendre les événements M2 visibles sans créer une deuxième
implémentation de la détection dans le navigateur. L'ancien instantané v1 ne
contenait que série et diagnostics.

## Décision

L'instantané local passe à `schemaVersion: 2`. Pour chaque prédiction, le
générateur appelle `detectTideEvents` et ajoute le `TideEventsResult` au même
agrégat que la série et ses diagnostics.

La page :

- positionne les événements à partir de `TideEvent.time` et `rawHeight` ;
- affiche un marqueur textuel PM ou BM, complété par une couleur ;
- représente un plateau par un segment et son intervalle textuel ;
- répète type, heure UTC, heure locale dérivée du fuseau IANA de station,
  valeur brute, qualification et méthode dans une liste accessible ;
- garde l'UTC comme axe canonique et ajoute une seconde ligne d'axe locale sans
  transformer les instants du domaine ;
- change courbe, événements, diagnostics et provenance comme un seul ensemble
  lors du changement de station.

## Conséquences

- le JSON `predict` et les contrats M1/M2 ne changent pas ;
- générateur et page évoluent ensemble pour le schéma local recalculable ;
- la page ne dépend toujours pas de Neaps ;
- l'affichage reste explicitement discret, brut et non officiel ;
- le changement d'heure est délégué aux règles IANA du navigateur, jamais à un
  décalage Normandie codé en dur ;
- `npm test` vérifie désormais le contrat d'instantané v2.

## Alternatives écartées

- recalculer les extrema en JavaScript navigateur : duplication métier ;
- déduire les événements des pixels de la courbe : perte de traçabilité ;
- afficher uniquement des points colorés : accessibilité insuffisante ;
- arrondir un plateau à une heure : fausse précision interdite par ADR-0008.
