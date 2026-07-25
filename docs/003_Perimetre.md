# Périmètre

## Inclus

- moteur open source indépendant des interfaces ;
- chargement de stations harmoniques par un dépôt abstrait ;
- stations candidates initiales Ouistreham et Le Havre ;
- calcul d'une série brute en UTC sur 24 heures, à cinq minutes ;
- conservation de l'identifiant, de la source et de la licence ;
- périmètre géographique V1 : Cabourg, Dives-sur-Mer, Houlgate,
  Villers-sur-Mer, Deauville, Trouville-sur-Mer, Villerville et Honfleur.

## Hors périmètre

- Skill Alexa et modification de `skill-mar-e` ;
- interface graphique et API publique ;
- détection des pleines mers, basses mers et étales ;
- coefficients français et générateur annuel ;
- hauteurs publiées pour les ports secondaires ;
- corrections locales automatiques ;
- navigation maritime officielle ;
- couverture nationale ou mondiale.

## Hypothèses

| Hypothèse | Impact si fausse | Méthode de vérification | Statut |
| --- | --- | --- | --- |
| Les deux stations candidates sont des stations harmoniques de référence dont la licence autorise l'usage commercial. | La station concernée est exclue du chemin publiable. | Vérification des métadonnées de la version verrouillée et tests d'intégration. | à vérifier à l'installation |
| Le calculateur Neaps accepte les constituants TICON normalisés. | La première prédiction ne peut pas être produite avec cette chaîne. | Test d'intégration sur Ouistreham et Le Havre. | à vérifier |

## Contraintes

- **Temps :** aucune échéance externe déclarée ; privilégier les tranches vérifiables.
- **Budget :** dépendances et données accessibles sous licences compatibles avec l'open source.
- **Technique :** TypeScript, Node.js 20 ou ultérieur, calcul interne UTC.
- **Légale/réglementaire :** exclusion stricte des stations sans usage commercial autorisé.
- **Compatibilité :** le domaine ne dépend pas du format interne de Neaps.

## Frontières du système

Le projet possède ses contrats, l'orchestration et la sérialisation. Il consomme
les métadonnées et constantes de stations ainsi qu'un calculateur harmonique
tiers. Il produit une série brute structurée. Les données amont, leurs erreurs,
les conditions océaniques réelles et l'usage final restent hors de sa maîtrise.
