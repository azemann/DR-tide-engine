# État actuel du projet

Ce document est la source de vérité du **présent opérationnel**. Il décrit ce qui existe réellement, non ce qui est seulement prévu ou documenté.

- **Date :** 2026-07-25
- **Origine d’adoption :** nouveau projet
- **Niveau validé :** development
- **Phase :** première tranche moteur terminée
- **Version :** 0.1.0
- **Branche :** `main`
- **Dernier jalon validé :** M1 — série brute sur 24 heures
- **Responsable de mise à jour :** mainteneur de DR Tide Engine
- **Portées actives :** développement manuel

## Fonctionne réellement

- Le profil logiciel et les douze rôles requis au niveau `development` sont
  validés par le Project Template.
- Les dépendances exactes sont verrouillées et installables avec `npm ci`.
- Ouistreham et Le Havre sont chargées derrière `StationRepository` avec leur
  source, leur licence et leurs 50 constituants.
- Les stations inconnues, non harmoniques ou sans usage commercial autorisé sont
  refusées par des erreurs stables.
- `TidePredictor` produit en UTC 288 échantillons bruts à cinq minutes sur une
  journée civile semi-ouverte.
- La CLI `predict` produit un JSON déterministe et ne porte aucun calcul métier.
- Les tests, le typecheck et le build réussissent.

## Fonctionne partiellement

- Les hauteurs sont des ordonnées harmoniques brutes. Elles ne sont pas validées
  contre le SHOM et ne doivent pas être présentées comme officielles ou
  navigables.
- L'inventaire géographique historique reste un outil de diagnostic ; il ne
  sélectionne pas automatiquement une station publiable.

## Ne fonctionne pas

- Aucune détection de pleine mer, basse mer ou étale n'existe.
- Les corrections locales, la validation externe, le générateur annuel, l'API,
  Alexa et les autres clients ne sont pas implémentés.

## Changements récents

- Le template a été validé successivement aux niveaux bootstrap et development.
- Les contrats du domaine, le cas d'usage, les deux adaptateurs Neaps, la CLI et
  les tests de la première série ont été ajoutés.

## Décisions et blocages actuels

- ADR-0006 impose deux adaptateurs distincts pour la base et le calculateur.
- AUD-004 reste ouvert : la référence verticale n'est pas qualifiée pour
  publication.
- AUD-005 reste ouvert : aucune licence de code n'autorise encore une release
  open source.
- Les portées release, distribution et operation restent différées.

## Prochaine tranche verticale

Détecter automatiquement les pleines et basses mers à partir de `TideSeries`
validée, sans modifier le contrat brut ni introduire de correction locale.

## Commande de reprise

```text
npm ci && npm test && npm run typecheck && ./scripts/check-project.sh --current
```

## Validation attendue

Définir et tester le contrat des événements, les changements de pente, les
plateaux et les extrema proches des bornes avant toute comparaison externe.

## Preuves disponibles

- tests : tests Node de la première tranche réussis le 2026-07-25
- captures ou démonstration : non applicable, aucune interface
- audit : AUD-001 à AUD-003 clos ; AUD-004 et AUD-005 ouverts
