export interface Race {
  slug: string;
  nom: string;
  couleur: string;
  image: string;
  population: number;
  esperanceVie: string;
  description: string;
  histoire: string;
  magie: string;
  societe: string;
  physique: string;
}

export const races: Race[] = [
  {
    slug: "humains",
    nom: "Humains et Humanoïdes",
    couleur: "#F4BEE9",
    image: "humain.jpeg",
    population: 203500,
    esperanceVie: "80 ans",
    description:
      "Les humains sont des êtres communautaires, sédentaires ou nomades selon leur mode de vie. Ils forment la base des sociétés de Minamix.",
    histoire:
      "Créés par les Ryximus vers l'an 250, les humains ont rapidement formé des civilisations organisées. Ils ont connu des périodes de conflits entre mages et non-mages avant de s'établir dans leurs nations actuelles.",
    magie:
      "Environ 35 % des humains sont des mages capables d'utiliser la magie innée. Les autres peuvent devenir sorciers en passant un pacte avec un Ryximus. Ils possèdent des affinités élémentaires variées.",
    societe:
      "Les humains vivent en communautés organisées, avec des structures sociales allant de la monarchie à la démocratie selon le pays. Ils constituent la majorité de la population dans Silfus et Frimaz.",
    physique:
      "Apparence humaine classique, avec une grande diversité de traits physiques selon leur origine géographique. Taille moyenne de 1,6 à 1,85 mètre.",
  },
  {
    slug: "elfes",
    nom: "Elfes",
    couleur: "#D4BAF7",
    image: "elfe.jpeg",
    population: 226000,
    esperanceVie: "500 ans",
    description:
      "Les elfes sont des artisans forestiers aux sens aiguisés. Excellents archers, ils vivent en harmonie avec la nature dans les forêts de Minamix.",
    histoire:
      "Parmi les premières races créées, les elfes ont développé une culture riche axée sur l'art et la nature. Ils ont maintenu leur indépendance en habitant les forêts profondes, loin des conflits politiques des nations humaines.",
    magie:
      "80 % des elfes sont des mages avec des affinités naturelles pour la magie élémentaire et naturelle. Leur longue vie leur permet de maîtriser des sorts complexes que peu d'autres races peuvent atteindre.",
    societe:
      "Les elfes vivent en communautés forestières dirigées par des anciens. Ils sont reconnus pour leur artisanat exceptionnel et leur maîtrise du tir à l'arc. Ils sont légèrement claustrophobes et mal à l'aise hors des forêts.",
    physique:
      "Grands et élancés, avec des oreilles pointues caractéristiques. Leurs sens (vue, ouïe, odorat) sont bien supérieurs à ceux des humains. Taille moyenne de 1,75 à 2 mètres.",
  },
  {
    slug: "sakennapies",
    nom: "Sakenpapiés",
    couleur: "#FAEEB0",
    image: "sakenpapié.jpeg",
    population: 92000,
    esperanceVie: "350 ans",
    description:
      "Les Sakenpapiés sont des humanoïdes dotés de cornes et d'une capacité magique innée remarquable. Chacun maîtrise un seul élément avec une perfection absolue.",
    histoire:
      "Race mystérieuse aux origines anciennes, les Sakenpapiés ont toujours été perçus comme des êtres magiques par excellence. Leur corne primaire, réservoir de mana, est au cœur de leur identité et de leur culture.",
    magie:
      "Chaque Sakenpapié contrôle un seul élément avec une perfection absolue grâce à sa corne primaire qui agit comme réservoir magique. Leur capacité magique est innée à 100 % et ne nécessite pas d'apprentissage académique.",
    societe:
      "Les Sakenpapiés forment des communautés soudées organisées autour de leurs affinités élémentaires. Ils sont respectés pour leurs capacités magiques uniques et jouent souvent un rôle de médiateurs ou de gardiens dans les conflits.",
    physique:
      "Humanoïdes avec une ou plusieurs cornes sur la tête. La corne principale est un organe magique actif. Leur apparence est proche des humains à l'exception de leurs cornes distinctives.",
  },
  {
    slug: "rumis",
    nom: "Rumis",
    couleur: "#FBBCBC",
    image: "rumi.jpeg",
    population: 25000,
    esperanceVie: "Indéterminée",
    description:
      "Les Rumis sont des humanoïdes qui se nourrissent d'essence spirituelle plutôt que de nourriture physique. Ils apparaissent magnifiquement humains mais consomment les âmes pour survivre.",
    histoire:
      "Rares et mystérieux, les Rumis ont toujours existé en marge des sociétés. Leur nature particulière les a souvent conduits à se cacher parmi les humains, adoptant leurs coutumes tout en préservant leur mode de vie secret.",
    magie:
      "100 % des Rumis possèdent des capacités magiques. Ils maintiennent leur apparence juvénile grâce à leur alimentation en essence spirituelle. Leur connexion avec les âmes leur confère des pouvoirs uniques liés à l'esprit.",
    societe:
      "En raison de leur nature, les Rumis vivent souvent en solitaires ou en petits groupes discrets. Ils se fondent dans la population humaine, adoptant des identités diverses au fil de leur longue existence.",
    physique:
      "Indistinguables des humains à première vue. Leur beauté remarquable et leur apparence éternellement juvénile peuvent les trahir aux yeux des plus observateurs. Ils ne vieillissent pas tant qu'ils se nourrissent régulièrement.",
  },
  {
    slug: "nains",
    nom: "Nains",
    couleur: "#F9D1BB",
    image: "nain.jpeg",
    population: 59000,
    esperanceVie: "350 ans",
    description:
      "Les Nains sont des artisans montagnards habiles dans la métallurgie et la taille de la pierre. Organisés en clans, ils valorisent la tradition et la loyauté au-dessus de tout.",
    histoire:
      "Habitants des montagnes depuis les origines de Minamix, les Nains ont développé une civilisation souterraine florissante. Leurs galeries et cités souterraines sous Lyndera sont parmi les merveilles architecturales du monde.",
    magie:
      "Les Nains ont une affinité naturelle pour la magie de la terre et de la forge. Bien que moins nombreux à être mages que d'autres races, ceux qui le sont excellent dans la création d'objets magiques et les enchantements durables.",
    societe:
      "Organisés en clans dirigés par des anciens, les Nains mettent la tradition et la loyauté familiale au premier plan. Leurs cités souterraines sont des merveilles d'ingénierie. Ils commercent leurs métaux et artefacts avec les autres races.",
    physique:
      "Petits et trapus, environ 1,2 mètre de haut, mais d'une force physique impressionnante. Leur endurance et leur résistance sont légendaires. Ils portent souvent barbes et tresses élaborées comme symboles de statut.",
  },
  {
    slug: "poluzoanns",
    nom: "Poluzoanns",
    couleur: "#B9E5C8",
    image: "poluzoann.jpeg",
    population: 82500,
    esperanceVie: "Proche des humains",
    description:
      "Les Poluzoanns sont des humains avec des membres supplémentaires qui se manifestent lors d'événements significatifs de leur vie. Ces appendices possèdent un niveau de conscience indépendant.",
    histoire:
      "Race relativement récente dans l'histoire de Minamix, les Poluzoanns sont apparus comme une évolution ou mutation des humains. Leurs membres supplémentaires sont considérés comme des compagnons spirituels ou des extensions de leur âme.",
    magie:
      "La magie des Poluzoanns est souvent liée à leurs membres supplémentaires qui agissent comme des canaux magiques indépendants. Cette particularité leur permet des utilisations magiques créatives impossibles pour les autres races.",
    societe:
      "Les Poluzoanns s'intègrent généralement dans les sociétés humaines, leur particularité étant acceptée avec plus ou moins de curiosité selon les régions. Leurs membres supplémentaires sont parfois source de fascination, parfois de méfiance.",
    physique:
      "Apparence humaine avec des membres supplémentaires (bras, tentacules ou autres appendices) qui apparaissent lors de moments émotionnellement forts ou d'étapes importantes de la vie. Ces membres ont une conscience partielle.",
  },
  {
    slug: "hommes-betes",
    nom: "Hommes-Bêtes",
    couleur: "#C8D8F0",
    image: "homme_bête.jpeg",
    population: 315000,
    esperanceVie: "30 à 180 ans selon l'espèce",
    description:
      "Les Hommes-Bêtes sont la race la plus nombreuse de Minamix. Hybrides humains-animaux, leurs capacités varient considérablement selon leur ascendance animale.",
    histoire:
      "Présents depuis les origines de Minamix, les Hommes-Bêtes comprennent une multitude de sous-espèces correspondant aux différents animaux. Ils ont développé des cultures variées influencées par leur nature animale respective.",
    magie:
      "Les capacités magiques des Hommes-Bêtes varient selon leur espèce animale. Certains ont des affinités naturelles pour certains éléments, d'autres possèdent des capacités physiques améliorées. Le pourcentage de mages varie selon les espèces.",
    societe:
      "Organisés en meutes, hardes ou clans selon leur nature animale, les Hommes-Bêtes ont leurs propres hiérarchies et traditions. Ils sont particulièrement nombreux à Lyndera où leur structure sociale clanique est valorisée.",
    physique:
      "Hybrides humains-animaux avec des caractéristiques physiques variées selon l'ascendance. Certains sont bipèdes avec des traits animaux (oreilles, queue, griffes), d'autres ont une apparence plus animale. Taille et force variables selon l'espèce.",
  },
];
