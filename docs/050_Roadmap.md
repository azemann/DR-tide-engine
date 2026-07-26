# Roadmap

## M1 — Terminé

Objectif : produire et observer une série harmonique brute, traçable et
déterministe.

- [x] charger Ouistreham et Le Havre derrière `StationRepository` ;
- [x] refuser les licences sans usage commercial ;
- [x] calculer 288 échantillons UTC sur 24 heures ;
- [x] exposer la preuve par une CLI JSON et des tests.
- [x] diagnostiquer la structure d'une série sans la muter ;
- [x] visualiser localement les deux séries, leur provenance et les limites ;
- [x] inspecter visuellement l'observatoire aux cinq largeurs de référence.

## M2 — Terminé

Objectif : détecter automatiquement les extrema à partir de la série validée.

- [x] définir les contrats `TideEvent` sans modifier `TideSeries` ;
- [x] détecter maxima et minima stricts ;
- [x] représenter les plateaux sans prétendre caractériser une étale ;
- [x] refuser les séries invalides et les extrema non qualifiables aux bornes ;
- [x] prouver l'ordre et l'alternance sur Ouistreham et Le Havre.

## M3 — Terminé

- [x] intégrer les événements prouvés à la petite page HTML existante ;
- [x] distinguer PM, BM, extrema stricts et plateaux dans la courbe et la liste ;
- [x] vérifier le changement Ouistreham / Le Havre ;
- [x] inspecter 360, 390, 768, 1024 et 1280 px ;
- [x] mesurer les contrastes des rôles textuels et du focus ;
- [x] ne déplacer aucune logique de détection dans le navigateur.

## M4 — Maintenant : comparaison aux références

- valider les événements contre des références ;
- documenter et appliquer les corrections locales Côte Fleurie ;
- produire des exports annuels ;

## M5 — Alexa

- définir un contrat client validé ;
- intégrer `skill-mar-e` sans logique métier.

## Non planifié

- couverture nationale ou mondiale ;
- navigation maritime officielle ;
- coefficients français.

## Jalons

| Jalon | Résultat vérifiable | Conditions d’entrée | Conditions de sortie |
| --- | --- | --- | --- |
| M1 — série brute | JSON de 288 échantillons pour les deux stations | bootstrap validé et dépendances verrouillées | tests, typecheck et check-project réussis |
| M1.1 — observabilité | diagnostics purs et observatoire local | M1 validé | tests multi-fichiers, génération réelle et routes locales vérifiés |
| M2 — extrema | événements ordonnés dérivés de la série | M1 validé | cas limites et erreurs temporelles testés |
| M3 — page HTML | courbe et événements observables | M2 validé et observatoire local existant | rendu responsive et limites visibles |
| M4 — validation | rapport de comparaison | extrema stables et références choisies | seuils et limites documentés |
| M5 — Alexa | client vocal sans logique métier | contrat validé | tests client et attribution |
