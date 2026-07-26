# Exigences

Une exigence décrit un résultat vérifiable, pas une solution technique prématurée.

## Exigences fonctionnelles

| ID | Exigence | Source | Priorité | Critère d’acceptation | Statut |
| --- | --- | --- | --- | --- | --- |
| EF-001 | Charger une station harmonique par son identifiant sans exposer le format externe au domaine. | Mission initiale | indispensable | Ouistreham et Le Havre sont chargées comme `HarmonicStation`. | acceptée |
| EF-002 | Refuser toute station inconnue ou dont la licence interdit l'usage commercial. | Politique V1 | indispensable | Les deux refus possèdent des erreurs distinctes et des tests. | acceptée |
| EF-003 | Produire une série brute pour une journée civile UTC avec un pas de cinq minutes. | Mission initiale | indispensable | La fenêtre semi-ouverte contient exactement 288 échantillons strictement ordonnés. | acceptée |
| EF-004 | Produire un JSON déterministe conservant station, source et licence. | Mission initiale | indispensable | Deux exécutions avec la même entrée produisent exactement la même chaîne JSON. | acceptée |
| EF-005 | Mesurer la qualité structurelle d'une série sans la modifier ni prétendre valider sa justesse scientifique. | Besoin d'observabilité | indispensable | Des tests synthétiques couvrent série saine, trous, doublons, date invalide, valeur non finie et immutabilité. | acceptée |
| EF-006 | Visualiser localement la courbe, ses diagnostics, sa provenance et l'état du projet sans logique métier dans le navigateur. | Besoin d'observabilité | utile au développement | Un instantané réel des deux stations est généré et servi par des routes loopback explicites. | acceptée |
| EF-007 | Détecter les maxima et minima locaux d'une série saine sans modifier la série ni dépendre du calculateur. | Jalon M2 | indispensable | Extrema stricts, plateaux, monotonie et proximité des bornes sont testés sur séries synthétiques ; les deux stations réelles produisent des événements ordonnés et alternés. | acceptée |

## Qualités attendues

| ID | Qualité | Mesure | Cible | Conditions | Statut |
| --- | --- | --- | --- | --- | --- |
| EQ-001 | Typage | contrôle TypeScript strict | aucune erreur | chaque changement | acceptée |
| EQ-002 | Modularité | graphe de dépendances | domaine sans import Neaps ou CLI | première tranche | acceptée |
| EQ-003 | Déterminisme | comparaison byte à byte du JSON | résultat identique | même station, date et versions verrouillées | acceptée |
| EQ-004 | Portabilité | runtime documenté | Node.js 20 ou ultérieur | Linux, macOS ou Windows disposant de Node | acceptée pour M1 ; revalidation de la borne Node 20 explicitement différée |
| EQ-005 | Accessibilité de l'observatoire | contrat statique et recette visuelle | clavier, focus, zoom, mouvement réduit, états explicites | observatoire local | partiellement vérifiée |

L'observatoire est une interface locale de développement sans authentification,
donnée personnelle ou exposition réseau. L'accessibilité et la validation
visuelle sont actives ; l'exploitation publique reste différée.

## Contraintes

| ID | Contrainte | Origine | Conséquence | Réexamen |
| --- | --- | --- | --- | --- |
| EC-001 | Calcul interne en UTC. | Architecture du moteur | aucune date locale ambiguë dans le domaine | si un contrat temporel public évolue |
| EC-002 | Aucune station CC BY-NC dans le chemin publiable. | Politique de licence V1 | contrôle avant toute prédiction | à chaque changement de source |
| EC-003 | Résultat non destiné à la navigation. | Limites des données et du calcul | avertissement documentaire et aucune revendication officielle | avant toute release |
| EC-004 | Aucune fausse précision ou datum non validé. | Qualité scientifique | la hauteur reste explicitement brute | jalon de validation des hauteurs |
| EC-005 | Aucune interpolation temporelle dans M2. | Ordre de développement | un événement strict garde l'heure d'un échantillon et un plateau garde ses deux échantillons bornes | avant un futur raffinement |

## Traçabilité

EF-001 à EF-004 sont reliées à UC-001. EF-005 est prouvée par les tests de
diagnostic. EF-006 est bornée par l'ADR-0007 et la recette de validation
visuelle. EF-007 est reliée à UC-003 et aux tests synthétiques et réels du
détecteur.
