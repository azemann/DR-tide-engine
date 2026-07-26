# État actuel du projet

Ce document est la source de vérité du **présent opérationnel**. Il décrit ce qui existe réellement, non ce qui est seulement prévu ou documenté.

- **Date :** 2026-07-26
- **Origine d’adoption :** nouveau projet
- **Niveau validé :** development
- **Phase :** événements discrets observables
- **Version :** 0.1.0
- **Branche :** `main`
- **Dernier jalon validé :** M3 — petite page HTML des événements
- **Responsable de mise à jour :** mainteneur de DR Tide Engine
- **Portées actives :** développement manuel

## Fonctionne réellement

- Le profil logiciel et les seize rôles requis au niveau `development` sont
  validés par le Project Template.
- Les dépendances exactes sont verrouillées et installables avec `npm ci`.
- Ouistreham et Le Havre sont chargées derrière `StationRepository` avec leur
  source, leur licence et leurs 50 constituants.
- Les stations inconnues, non harmoniques ou sans usage commercial autorisé sont
  refusées par des erreurs stables.
- `TidePredictor` produit en UTC 288 échantillons bruts à cinq minutes sur une
  journée civile semi-ouverte.
- La CLI `predict` produit un JSON déterministe et ne porte aucun calcul métier.
- `TideSeriesDiagnostics` mesure la structure de la série sans la modifier.
- Le lanceur de tests découvre tous les fichiers `dist/tests/**/*.test.js`.
- L'observatoire local génère et affiche les deux séries, leur provenance, leurs
  diagnostics et les points d'audit ouverts, sans logique de marée côté web.
- `detectTideEvents` dérive sans mutation les maxima `high` et minima `low`
  stricts ou en plateau d'une série structurellement conforme.
- Les plateaux conservent leurs deux instants échantillonnés ; aucune heure
  centrale, interpolation ou étale physique n'est inventée.
- Sur la journée du 2026-07-25, Ouistreham et Le Havre produisent chacune quatre
  événements stricts, ordonnés et alternés.
- L'instantané d'observatoire v2 conserve les événements M2 et son contrôle est
  intégré à `npm test`.
- La série conserve le fuseau IANA de sa station ; l'UTC reste canonique.
- La page affiche marqueurs PM/BM, heures UTC et locales, valeurs brutes,
  qualifications et méthode ; le changement de station met à jour l'ensemble
  de la vue.
- Le rendu chargé est inspecté à 360, 390, 768, 1024 et 1280 px ; les contrastes
  textuels et le focus respectent les seuils documentés.
- Les tests, le typecheck, le build, la génération de l'instantané et les routes
  HTTP locales réussissent avec Node.js 24.

## Fonctionne partiellement

- Les hauteurs sont des ordonnées harmoniques brutes. Elles ne sont pas validées
  contre le SHOM et ne doivent pas être présentées comme officielles ou
  navigables.
- L'inventaire géographique historique reste un outil de diagnostic ; il ne
  sélectionne pas automatiquement une station publiable.
- La borne minimale Node.js 20 n'est pas revalidée dans cette tranche.
- Les horaires d'événements sont des candidats au pas de cinq minutes, sans
  validation contre une référence officielle.

## Ne fonctionne pas

- Aucun raffinement temporel, mesure de confiance ou détecteur d'étale physique
  n'existe.
- Les corrections locales, la validation externe, le générateur annuel, l'API,
  Alexa et les autres clients ne sont pas implémentés.

## Changements récents

- Le template a été validé successivement aux niveaux bootstrap et development.
- Les contrats du domaine, le cas d'usage, les deux adaptateurs Neaps, la CLI et
  les tests de la première série ont été ajoutés.
- Les invariants métier ont été ajoutés aux règles des agents.
- Les diagnostics purs, le lanceur de tests multi-fichiers et l'observatoire
  local ont été ajoutés ; ADR-0007 en fixe la frontière.
- Les contrats `TideEvent`, le détecteur discret et ses tests synthétiques et
  réels ont été ajoutés ; ADR-0008 fixe plateaux, bornes et précision.
- L'observatoire affiche les événements via l'instantané v2 ; ADR-0009 interdit
  tout recalcul métier dans la page.
- L'heure locale est projetée depuis `station.timezone`, sans décalage
  Normandie codé en dur ni modification des instants UTC.

## Décisions et blocages actuels

- ADR-0006 impose deux adaptateurs distincts pour la base et le calculateur.
- ADR-0007 interdit toute logique métier dans l'observatoire.
- ADR-0008 impose une méthode discrète sans interpolation ni fausse précision.
- ADR-0009 impose la projection fidèle des événements M2 dans la page.
- AUD-004 reste ouvert : la référence verticale n'est pas qualifiée pour
  publication.
- AUD-005 reste ouvert : aucune licence de code n'autorise encore une release
  open source.
- Les portées release, distribution et operation restent différées.

## Prochaine tranche verticale

Comparer les horaires discrets M2 à des références choisies et licites, avec un
protocole d'appariement et des mesures d'erreur explicites.

## Commande de reprise

```text
npm ci && npm test && npm run typecheck && npm run observatory:data -- --date 2026-07-25 && ./scripts/check-project.sh --current
```

## Validation attendue

Définir d'abord la source de référence, son droit d'usage, les règles
d'appariement, les seuils et les limites avant tout raffinement temporel.

## Preuves disponibles

- tests : tests Node multi-fichiers et contrat d'instantané v2 réussis le
  2026-07-26 avec Node.js 24
- événements : tests synthétiques de maxima, minima, plateaux, monotonie,
  bornes, refus, provenance et immutabilité ; intégration des deux stations
  réussie le 2026-07-26
- démonstration : instantané réel des deux stations et routes HTTP vérifiés
- interface M3 : captures temporaires inspectées aux cinq largeurs, changement
  vers Le Havre vérifié et contrastes mesurés le 2026-07-26
- heure locale : fuseau `Europe/Paris` contrôlé dans le JSON et double affichage
  UTC/local confirmé dans l'observatoire réel par le mainteneur le 2026-07-26
- audit : AUD-001 à AUD-003 clos ; AUD-004 et AUD-005 ouverts
