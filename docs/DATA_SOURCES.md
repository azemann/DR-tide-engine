# Sources de données et de calcul

La V1 utilise `@neaps/tide-database` 0.8.20260701 pour accéder aux stations
TICON-4 et à leurs constantes harmoniques. La somme harmonique est effectuée par
`@neaps/tide-predictor` 0.10.0. `package-lock.json` est la preuve calculable des
versions réellement installées.

## Stations retenues

- Ouistreham : `ticon/ouistreham-311-fra-refmar`, station de référence,
  TICON-4, CC BY 4.0, usage commercial autorisé, 50 constituants.
- Le Havre : `ticon/le_havre-4-fra-refmar`, station de référence, TICON-4,
  CC BY 4.0, usage commercial autorisé, 50 constituants.

Ces faits ont été vérifiés dans la version verrouillée. L'adaptateur continue à
les lire à l'exécution et les tests protègent les deux candidats.

## Stations écartées du chemin publiable

Toute station dont `license.commercial_use` n'est pas strictement `true` est
refusée avant calcul. Les variantes amont marquées CC BY-NC ne doivent donc pas
alimenter un client publiable ou susceptible d'être monétisé.

## Limite actuelle

Le contenu des métadonnées de datum a évolué entre révisions amont. La première
tranche n'applique aucun offset de datum : elle expose uniquement la hauteur
brute de la somme harmonique. Cette valeur n'est ni une observation, ni une
hauteur SHOM, ni une donnée destinée à la navigation.

Tout résultat conserve la source, l'identifiant et la licence de station. La
sortie déterministe ne contient pas de date de génération dépendant de l'horloge.
Un futur export versionné pourra ajouter des métadonnées de génération hors du
contenu déterministe.
