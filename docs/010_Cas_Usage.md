# Cas d’usage

## UC-001 — Générer une courbe brute sur 24 heures

- **Acteur :** développeur d'un client externe du moteur
- **Intention :** obtenir une série harmonique traçable sans implémenter le calcul
- **Préconditions :** dépendances verrouillées, station connue, harmonique et commercialement utilisable
- **Déclencheur :** exécution de `npm run predict` avec une station et une date civile

### Parcours nominal

1. La CLI valide l'identifiant de station et la date.
2. Le dépôt adapte la station externe vers `HarmonicStation` et contrôle sa licence.
3. Le prédicteur calcule les niveaux toutes les cinq minutes entre les bornes UTC.
4. La CLI sérialise la série et ses métadonnées en JSON sur la sortie standard.

### Variantes et erreurs

- la station n'existe pas : erreur `STATION_NOT_FOUND` ;
- la station n'est pas harmonique : erreur `STATION_NOT_HARMONIC` ;
- l'usage commercial est interdit : erreur `STATION_LICENSE_REJECTED` ;
- la date ou le pas est invalide : erreur `INVALID_PREDICTION_REQUEST`.

### Résultat

Une série déterministe décrit la station, la fenêtre UTC semi-ouverte, le pas de
cinq minutes et 288 hauteurs brutes finies et strictement ordonnées.

### Critères d’acceptation

- [x] Ouistreham et Le Havre peuvent être chargées et calculées.
- [x] Une station inconnue et une licence non commerciale sont refusées.
- [x] Le JSON contient 288 échantillons, sans valeur non numérique.
- [x] Deux exécutions identiques produisent le même JSON.

### Données et règles touchées

Identité et métadonnées de station, licence, constituants harmoniques, fenêtre
UTC, pas temporel, hauteur brute et provenance.
