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

## UC-002 — Observer une série brute

- **Acteur :** mainteneur de DR Tide Engine
- **Intention :** comprendre la forme et la qualité interne d'une série sans
  conclure à son exactitude scientifique
- **Préconditions :** build réussi et dépendances locales installées
- **Déclencheur :** génération d'un instantané pour une date UTC

### Parcours nominal

1. Le script exécute le cas d'usage existant pour les deux stations.
2. Le domaine calcule les diagnostics sans modifier les séries.
3. Le script ajoute versions techniques, roadmap et audits ouverts.
4. Le serveur loopback expose uniquement les ressources connues.
5. Le mainteneur choisit une station et inspecte courbe, métriques et limites.

### Variantes et erreurs

- instantané absent : la page affiche la commande de génération ;
- aucune série : la page affiche un état vide ;
- anomalie structurelle : l'état dégradé et les compteurs restent visibles ;
- source documentaire ou Git indisponible : l'information est marquée
  indisponible, jamais inventée.

### Résultat

Une vue locale remplaçable affiche l'entrée réellement calculée et l'état
documenté. Aucun résultat métier n'est produit par le navigateur.

## UC-003 — Détecter les pleines et basses mers discrètes

- **Acteur :** moteur ou client externe
- **Intention :** dériver des événements structurés d'une série déjà calculée
- **Préconditions :** série complète, finie, ordonnée et alignée sur son pas
- **Déclencheur :** appel de `detectTideEvents`

### Parcours nominal

1. Le détecteur vérifie la structure de la série sans la corriger.
2. Il regroupe les échantillons consécutifs de hauteur égale.
3. Il compare chaque point ou groupe à ses voisins directs.
4. Il produit les maxima `high` et minima `low` dans l'ordre UTC.
5. Chaque événement conserve station, source, licence et méthode.

### Variantes et erreurs

- série monotone : résultat vide ;
- extremum strict : heure de l'échantillon conservée ;
- plateau encadré : première et dernière heures échantillonnées conservées ;
- extremum ou plateau touchant une borne : non qualifié ;
- série invalide : `INVALID_EVENT_SOURCE_SERIES`.

### Résultat

Un `TideEventsResult` déterministe contenant des événements discrets non
interpolés et non validés contre une référence.
