# ADR-0008 — Détecter les extrema discrets sans fausse précision

- **Statut :** accepté
- **Date :** 2026-07-26

## Contexte

M2 doit dériver pleines et basses mers d'une `TideSeries` à cinq minutes sans
modifier le calcul harmonique, dépendre de Neaps ou annoncer une précision que
l'échantillonnage ne fournit pas. Les plateaux et les bornes rendent un simple
test `précédent < courant > suivant` insuffisant.

## Décision

La méthode `discrete-local-extremum-v1` :

1. refuse toute série structurellement non conforme ;
2. regroupe les hauteurs consécutives strictement égales ;
3. qualifie `high` un groupe plus haut que ses deux voisins et `low` un groupe
   plus bas ;
4. représente un groupe d'un point par son instant échantillonné ;
5. représente un plateau par les instants de son premier et dernier
   échantillon, sans choisir de centre ;
6. ignore tout groupe touchant une borne de la fenêtre ;
7. conserve station, source, licence, hauteur brute et version de méthode.

La comparaison des hauteurs est exacte. Aucun epsilon, lissage, interpolation,
raffinement temporel, confiance numérique ou étale physique n'est introduit.

## Conséquences

- le détecteur est pur, déterministe et indépendant des adaptateurs ;
- un résultat vide est légitime pour une série monotone ou trop courte ;
- les événements proches des bornes sont détectables s'ils possèdent encore
  deux voisins internes ;
- un plateau communique l'incertitude temporelle au lieu de la masquer ;
- les horaires restent des candidats discrets à comparer lors de M4.

## Alternatives écartées

- choisir le milieu d'un plateau : fausse précision ;
- retenir le premier point : biais temporel implicite ;
- interpoler une parabole : raffinement prématuré avant validation discrète ;
- accepter les bornes comme extrema : absence de preuve du côté extérieur ;
- ajouter une tolérance flottante : convention scientifique non qualifiée.
