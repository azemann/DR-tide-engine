# Rétrospective

À mettre à jour à chaque jalon important. Ce document évalue la manière de construire ; il ne remplace ni l’audit du produit ni le registre de risques.

## Jalon examiné

M3 — petite page HTML des événements, 2026-07-26.

## Ce qui a fonctionné

- valider le bootstrap avant d'activer development a empêché de confondre
  cadrage et capacité ;
- les ports séparés ont rendu les tests de licence et de calcul lisibles ;
- le calculateur réel a pu être utilisé sans laisser ses types entrer dans le
  domaine.
- un diagnostic pur a rendu visibles les anomalies sans modifier le contrat ;
- l'instantané local a permis une interface utile sans API ni dépendance web.
- les séries synthétiques ont fixé le sens des plateaux et des bornes avant
  d'observer les données Neaps ;
- le détecteur a pu rester une seule fonction pure du domaine.
- l'instantané v2 a transporté le contrat M2 sans transformation métier ;
- WebDriver BiDi a permis d'inspecter le contenu réellement chargé plutôt que
  le seul état initial.

## Ce qui nous a ralentis

- les dépendances du validateur et npm n'étaient pas installées ;
- la documentation amont et le contenu de la version verrouillée différaient sur
  les datums ;
- le calculateur inclut la borne finale, contrairement au contrat choisi.
- la découverte automatique de `node --test` incluait aussi les sources
  TypeScript ; un lanceur explicite, récursif et déterministe a été nécessaire ;
- le sandbox interdisait l'écoute loopback sans autorisation dédiée.
- un simple champ `datetimeUtc` aurait forcé une fausse précision pour les
  plateaux ; un type temporel discriminé a été nécessaire.
- les captures Firefox immédiates sur `load` précédaient le chargement asynchrone
  du JSON ; une session contrôlée et une attente explicite ont été nécessaires.

## Hypothèses invalidées

- `@neaps/tide-database` ne fournit pas le calculateur en dépendance d'exécution ;
- la version 0.8.20260701 contient déjà des datums pour les deux stations, malgré
  la limite historiquement documentée dans le dépôt.

## Complexité inutile introduite

Aucun calcul, interpolateur ou adaptateur Neaps n'a été ajouté au navigateur.
La nouvelle page ne fait que projeter un contrat déjà calculé.

## Décisions à conserver

- versions exactes et lockfile ;
- fenêtre UTC semi-ouverte ;
- contrôle commercial avant calcul ;
- hauteur explicitement brute.
- diagnostic structurel distinct de la validation scientifique ;
- données de démonstration générées et non committées.
- méthode d'événements versionnée et provenance conservée ;
- plateaux représentés par leurs bornes échantillonnées.
- marqueurs toujours complétés par PM/BM et une liste textuelle ;
- contrôle de l'instantané de présentation intégré aux tests.

## Décisions à revoir

- le sens vertical et l'éventuel offset de datum avant toute publication de
  hauteur ;
- la granularité et une éventuelle interpolation seulement après comparaison
  des événements discrets en M4.

## Ce que le template doit apprendre

Pour un projet neuf comportant déjà quelques commits métier, `origin: new`
reste correct : il faut adopter le bootstrap depuis l'intention, puis confronter
les manifestes aux preuves réelles avant `development`.

## Actions

| ID | Action | Responsable | Échéance | Preuve de clôture |
| --- | --- | --- | --- | --- |
| RET-001 | Conserver AUD-004 ouvert jusqu'à validation verticale. | mainteneur | jalon validation | protocole et comparaison documentés |
| RET-002 | Évaluer la détection d'extrema sans coupler `TideSeries` au calculateur. | mainteneur | M2 | clôturé : tests synthétiques et deux stations réelles |
| RET-003 | Produire les captures multi-largeur et mesurer les contrastes de l'observatoire. | mainteneur | M3 | clôturé : cinq largeurs inspectées et contrastes mesurés |
| RET-004 | Comparer les horaires discrets à des références avant tout raffinement. | mainteneur | M4 | rapport d'erreurs horaires et méthode décidée |
