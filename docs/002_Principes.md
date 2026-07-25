# Principes

Les principes guident les choix lorsque les spécifications ne suffisent pas. Ils doivent rester peu nombreux et arbitrables.

## Principes génériques proposés

### P1 — Vocabulaire stable

Les documents, le code, les données et l’interface se rattachent aux mêmes concepts canoniques.

### P2 — Une source de vérité explicite

Chaque donnée ou règle importante possède un propriétaire et un emplacement de référence.

### P3 — Invariants avant fonctionnalités

Définir ce qui doit rester vrai avant d’ajouter ce que le système peut faire.

### P4 — Séparation des responsabilités

Le métier, l’orchestration, les accès externes et la présentation évoluent sans se confondre.

### P5 — Traçabilité des décisions

Les choix structurants conservent leur contexte, leurs alternatives et leurs conséquences.

### P6 — Validation proportionnée au risque

Plus un changement est irréversible, externe ou critique, plus sa preuve doit être forte.

### P7 — Complexité justifiée

Une abstraction, une couche ou une dépendance doit résoudre un problème identifié.

### P8 — Données maîtrisées

Collecter le minimum, donner le contrôle et permettre un export dans un format exploitable.

## Principes propres au projet

- Le moteur ne connaît aucune interface cliente ; les clients consomment ses
  contrats sans porter de logique de marée.
- Une donnée fournie par une dépendance externe est normalisée à la frontière et
  ne circule jamais directement dans le domaine.
- Les calculs internes et les contrats temporels utilisent UTC.
- Une licence de station interdisant l'usage commercial provoque un refus, sans
  dérogation implicite.
- Une hauteur brute n'est jamais présentée comme une hauteur officielle ou
  navigable sans validation de sa référence verticale.
