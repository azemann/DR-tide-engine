# ADR-0007 — Observer le moteur par un instantané local

- **Statut :** accepté
- **Date :** 2026-07-25

## Contexte

La CLI prouve le contrat JSON mais ne permet pas de voir rapidement la forme
d'une courbe, les anomalies structurelles, la provenance et l'avancement du
projet. Une interface utile ne doit toutefois ni introduire une API prématurée,
ni déplacer le calcul ou la qualification des marées dans le navigateur.

## Décision

Ajouter un observatoire de développement local en deux phases :

1. un script Node appelle le même cas d'usage que la CLI, calcule les
   `TideSeriesDiagnostics` du domaine et écrit un instantané ignoré par Git ;
2. une page HTML/JavaScript statique visualise cet instantané via un serveur
   HTTP limité à une liste explicite de routes sur l'interface loopback.

Le navigateur peut choisir une série déjà calculée et construire sa
visualisation SVG. Il ne charge pas Neaps, ne calcule pas une hauteur, ne
détecte pas d'événement et ne modifie pas la série.

## Conséquences

- l'observatoire reste un client remplaçable du contrat métier ;
- aucune dépendance web, API ou donnée générée n'est ajoutée au dépôt ;
- les états d'interface et les rôles du Project Template deviennent actifs ;
- une nouvelle date exige de régénérer l'instantané ;
- la validation visuelle devient une preuve distincte des tests du moteur.

## Alternatives écartées

- calculer directement dans le navigateur : couplage à Neaps et duplication de
  logique ;
- créer une API REST : hors périmètre et sans besoin opérationnel ;
- committer des instantanés : risque de volume, de dérive et de confusion avec
  une référence scientifique.
