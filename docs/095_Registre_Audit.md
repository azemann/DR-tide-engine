# Registre d’audit et dettes

Ce registre contient uniquement des écarts confirmés ou risques explicitement acceptés. Une idée non validée reste dans `099_Questions_Ouvertes.md`.

| ID | Écart ou risque | Gravité | Périmètre | Preuve | Action | Responsable | Échéance | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AUD-001 | Les manifestes contenaient encore l'identité générique du template. | haute | adoption | `check-project.sh bootstrap` puis `development` réussis le 2026-07-25 | compléter et valider bootstrap puis development | mainteneur | première tranche | fermé |
| AUD-002 | Aucune installation reproductible : dépendance en plage et aucun lockfile. | haute | dépendances | versions exactes, `package-lock.json` et `npm ci` réussis | utiliser des versions exactes et committer `package-lock.json` | mainteneur | première tranche | fermé |
| AUD-003 | Le dépôt documentait un moteur sans code ni tests correspondants. | haute | capacité métier | contrats, adaptateurs, CLI et tests réussis le 2026-07-25 | implémenter uniquement la série brute et ajuster l'état | mainteneur | première tranche | fermé |
| AUD-004 | La référence verticale des hauteurs n'est pas validée pour publication. | haute | données et usages | historique des métadonnées et absence de comparaison | qualifier la sortie de brute et différer toute hauteur officielle | mainteneur | jalon validation | ouvert |
| AUD-005 | Le projet vise l'open source sans licence de code choisie. | haute | juridique et release | `LICENSE.md` | choisir une licence, ajouter son texte officiel et vérifier les attributions | mainteneur | avant release | ouvert |

## Gravité

- **critique :** perte grave, exposition ou impossibilité d’exploiter ;
- **haute :** fonction essentielle ou invariant compromis ;
- **moyenne :** qualité, maintenabilité ou expérience sensiblement dégradée ;
- **faible :** amélioration localisée sans risque immédiat.

## Clôture

Un point est fermé uniquement avec une preuve reproductible, une décision d’acceptation du risque ou une explication vérifiable de non-applicabilité.
