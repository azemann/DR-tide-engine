# Sources et preuves

Ce registre distingue ce qui est observé, supposé, interprété et décidé. Une référence n’est pas automatiquement une preuve et une mesure n’est interprétable qu’avec son protocole.

## Registre

| ID | Affirmation | Type | Source | Méthode/protocole | Limites/incertitude | Statut |
| --- | --- | --- | --- | --- | --- | --- |
| SRC-001 | `@neaps/tide-database` distribue des stations et constantes, pas un calculateur d'exécution. | documentation et manifeste amont | dépôt `openwatersio/tide-database` | lecture du README et des dépendances | peut évoluer après la version verrouillée | confirmé le 2026-07-25 |
| SRC-002 | `@neaps/tide-predictor` calcule une timeline à pas régulier en UTC. | documentation et résultat expérimental | paquet 0.10.0 et dépôt `openwatersio/neaps` | lecture de l'API et test d'intégration sur 24 heures | exactitude locale non encore comparée au SHOM | confirmé le 2026-07-25 |
| SRC-003 | Ouistreham et Le Havre sont des stations de référence TICON-4, CC BY 4.0, commerciales, avec 50 constituants. | métadonnées de station | `@neaps/tide-database` 0.8.20260701 | chargement et assertions d'intégration | une mise à jour peut changer les métadonnées | confirmé le 2026-07-25 |
| SRC-004 | Le moteur n'est pas destiné à la navigation. | avertissement amont et décision projet | documentation Neaps et EC-003 | revue documentaire | n'évalue pas tous les usages détournés | confirmé |

## Types canoniques

- **observation :** constat daté dans des conditions précisées ;
- **mesure :** résultat produit par un instrument ou calcul défini ;
- **documentation :** affirmation provenant d’une source externe identifiée ;
- **témoignage :** déclaration attribuée, non confondue avec une observation directe ;
- **hypothèse :** proposition encore ouverte à vérification ou réfutation ;
- **interprétation :** sens attribué depuis un modèle explicite ;
- **décision :** choix du projet, conservé dans une ADR si structurant ;
- **résultat expérimental :** résultat reproductible ou accompagné de ses limites.

## Règles

- conserver date, version et lien ou emplacement stable de la source ;
- ne pas transformer une absence de preuve en preuve d’absence ;
- enregistrer les résultats négatifs ou contradictoires ;
- séparer la qualité de la source de l’accord avec notre hypothèse ;
- relier les preuves aux exigences, décisions et risques concernés.
