# Questions ouvertes

Ce fichier évite de transformer trop tôt une incertitude en décision.

| ID | Question | Pourquoi elle compte | Options connues | Responsable | Échéance | Statut |
| --- | --- | --- | --- | --- | --- | --- |
| Q-001 | Quelle licence open source appliquer au code de DR Tide Engine ? | Sans licence, le code n'est pas redistribuable et aucune release open source n'est légitime. | licence permissive telle que MIT ou Apache-2.0 ; copyleft à examiner selon l'intention du mainteneur | mainteneur | avant release | ouverte |
| Q-002 | Quelle référence verticale et quel protocole autoriseront la publication de hauteurs ? | La série actuelle est brute et ne doit pas être assimilée à une hauteur officielle. | conserver le zéro harmonique ; appliquer un datum vérifié ; ne publier que les horaires | mainteneur | jalon validation | ouverte |
| Q-003 | Quelle version minimale de Node doit être réellement supportée après M1 ? | Le manifeste déclare Node 20+, mais la tranche d'observabilité est validée uniquement avec le runtime local Node 24. | maintenir 20 avec CI dédiée ; relever la borne ; définir une matrice LTS plus tard | mainteneur | avant release | ouverte |
