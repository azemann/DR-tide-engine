# Vision

## Situation actuelle

Les applications de marée tendent à intégrer directement sélection des
stations, calculs, corrections et présentation. Cette organisation rend les
résultats difficiles à partager, tester et valider entre plusieurs clients.

## Problème

La future Skill Alexa `skill-mar-e` et les autres clients prévus ne disposent
pas d'un moteur indépendant fournissant des prédictions traçables à partir de
constantes harmoniques ouvertes.

## Personnes ou systèmes concernés

Les développeurs de clients Alexa, Android, Linux, web, CLI et API qui ont
besoin d'un même résultat métier sans dupliquer le calcul dans leur interface.

## Vision

DR Tide Engine a vocation à devenir un moteur open source indépendant des
interfaces, capable de calculer des prédictions de marée à partir de constantes
harmoniques et de fournir des séries et événements structurés aux applications
clientes. La publication open source reste conditionnée au choix explicite de
la licence du code.

## Valeur produite

Un noyau réutilisable, fortement typé et testable, qui conserve la provenance
et la licence de ses stations et permet de valider séparément chaque étape du
calcul.

## Résultats observables

- un client obtient la même série temporelle pour une même station et une même période ;
- une source de données externe peut être remplacée derrière un adaptateur ;
- une station incompatible avec l'usage commercial est refusée explicitement.

## Non-objectifs

- fournir une aide à la navigation maritime officielle ;
- intégrer la logique métier dans Alexa, une API ou une interface graphique.

## Critères de réussite

| Critère | Mesure ou preuve | Cible | Échéance |
| --- | --- | --- | --- |
| Première prédiction brute | tests et commande CLI reproductible | 288 échantillons UTC sur 24 heures | première tranche |
| Indépendance des clients | dépendances du domaine et revue d'architecture | aucune dépendance à Alexa, HTTP ou une UI | chaque jalon |
| Traçabilité des données | JSON et tests | identifiant, source et licence conservés | première tranche |
