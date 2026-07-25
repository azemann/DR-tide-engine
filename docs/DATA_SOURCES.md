# Sources de données

La V1 utilise `@neaps/tide-database` pour accéder aux stations TICON-4 et à leurs constantes harmoniques.

## Stations retenues

- Ouistreham : `ticon/ouistreham-311-fra-refmar`, licence CC BY 4.0, 50 constituants.
- Le Havre : `ticon/le_havre-4-fra-refmar`, licence CC BY 4.0, 50 constituants.

## Stations écartées du chemin publiable

Les variantes `Balise a Rouen` et `Havre GPM Rouen` sont marquées CC BY-NC 4.0. Elles ne doivent pas alimenter une Skill publique susceptible d'être monétisée.

## Limite actuelle

Le datum est absent des métadonnées examinées. La V1 privilégie donc les horaires de pleine et basse mer, la tendance montante ou descendante et le délai avant le prochain événement. Les hauteurs seront publiées seulement après validation de leur référence verticale.

Tout export doit conserver la source, l'identifiant de station, la licence, la date de génération et le statut de validation.
