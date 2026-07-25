# Roadmap

## Maintenant

Objectif : produire et observer une série harmonique brute, traçable et
déterministe.

- [x] charger Ouistreham et Le Havre derrière `StationRepository` ;
- [x] refuser les licences sans usage commercial ;
- [x] calculer 288 échantillons UTC sur 24 heures ;
- [x] exposer la preuve par une CLI JSON et des tests.
- [x] diagnostiquer la structure d'une série sans la muter ;
- [x] visualiser localement les deux séries, leur provenance et les limites ;
- [ ] inspecter visuellement l'observatoire aux cinq largeurs de référence.

## Ensuite

Objectif : détecter automatiquement les extrema à partir de la série validée.

- [ ] définir les contrats `TideEvent` sans modifier `TideSeries` ;
- [ ] détecter pleines et basses mers, puis caractériser les étales ;
- [ ] mesurer la robustesse au pas d'échantillonnage.

## Plus tard

- valider les événements contre des références ;
- documenter et appliquer les corrections locales Côte Fleurie ;
- produire des exports annuels ;
- concevoir une API, puis intégrer les clients dont `skill-mar-e`.

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
| M3 — validation | rapport de comparaison | extrema stables et références choisies | seuils et limites documentés |
