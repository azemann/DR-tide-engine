# Exigences

Une exigence décrit un résultat vérifiable, pas une solution technique prématurée.

## Exigences fonctionnelles

| ID | Exigence | Source | Priorité | Critère d’acceptation | Statut |
| --- | --- | --- | --- | --- | --- |
| EF-001 | Charger une station harmonique par son identifiant sans exposer le format externe au domaine. | Mission initiale | indispensable | Ouistreham et Le Havre sont chargées comme `HarmonicStation`. | acceptée |
| EF-002 | Refuser toute station inconnue ou dont la licence interdit l'usage commercial. | Politique V1 | indispensable | Les deux refus possèdent des erreurs distinctes et des tests. | acceptée |
| EF-003 | Produire une série brute pour une journée civile UTC avec un pas de cinq minutes. | Mission initiale | indispensable | La fenêtre semi-ouverte contient exactement 288 échantillons strictement ordonnés. | acceptée |
| EF-004 | Produire un JSON déterministe conservant station, source et licence. | Mission initiale | indispensable | Deux exécutions avec la même entrée produisent exactement la même chaîne JSON. | acceptée |

## Qualités attendues

| ID | Qualité | Mesure | Cible | Conditions | Statut |
| --- | --- | --- | --- | --- | --- |
| EQ-001 | Typage | contrôle TypeScript strict | aucune erreur | chaque changement | acceptée |
| EQ-002 | Modularité | graphe de dépendances | domaine sans import Neaps ou CLI | première tranche | acceptée |
| EQ-003 | Déterminisme | comparaison byte à byte du JSON | résultat identique | même station, date et versions verrouillées | acceptée |
| EQ-004 | Portabilité | runtime documenté | Node.js 20 ou ultérieur | Linux, macOS ou Windows disposant de Node | acceptée |

La première tranche n'a pas d'interface ni de données personnelles. Les
exigences d'accessibilité visuelle, d'authentification, de réseau et
d'exploitation sont donc différées avec les clients qui les introduiront.

## Contraintes

| ID | Contrainte | Origine | Conséquence | Réexamen |
| --- | --- | --- | --- | --- |
| EC-001 | Calcul interne en UTC. | Architecture du moteur | aucune date locale ambiguë dans le domaine | si un contrat temporel public évolue |
| EC-002 | Aucune station CC BY-NC dans le chemin publiable. | Politique de licence V1 | contrôle avant toute prédiction | à chaque changement de source |
| EC-003 | Résultat non destiné à la navigation. | Limites des données et du calcul | avertissement documentaire et aucune revendication officielle | avant toute release |
| EC-004 | Aucune fausse précision ou datum non validé. | Qualité scientifique | la hauteur reste explicitement brute | jalon de validation des hauteurs |

## Traçabilité

EF-001 à EF-004 sont reliées à UC-001. Leur preuve est constituée par les tests
de la première tranche et par l'ADR sur la frontière Neaps.
