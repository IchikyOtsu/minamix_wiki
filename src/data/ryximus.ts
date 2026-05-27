export interface Ryximus {
  slug: string;
  nom: string;
  genre: "Masculin" | "Féminin";
  element: string;
  couleur: string;
  image: string;
  citation: string;
  description: string;
  personnalite: string;
  conditionPacte: string;
}

export const ryximus: Ryximus[] = [
  {
    slug: "whimir",
    nom: "Whimir",
    genre: "Féminin",
    element: "Esprit",
    couleur: "#9B7EC8",
    image: "whimir.jpeg",
    citation: "Dernière née des Ryximus, elle incarne l'élément le plus énigmatique et insaisissable : l'esprit.",
    description:
      "Whimir est la plus jeune des Ryximus et la plus mystérieuse. Elle incarne l'esprit sous toutes ses formes — la pensée, la conscience, le rêve et la folie.",
    personnalite:
      "Distante et énigmatique, Whimir est fascinée par la psychologie humaine et la souffrance qu'elle engendre. Elle observe plus qu'elle n'agit, collectionnant les émotions des mortels comme d'autres collectionnent des objets précieux.",
    conditionPacte:
      "Surmonter des barrières psychologiques ou physiques significatives. Whimir n'accorde son pacte qu'à ceux qui ont traversé et dépassé leurs limites mentales.",
  },
  {
    slug: "noctis",
    nom: "Noctis",
    genre: "Masculin",
    element: "Obscurité",
    couleur: "#2D2D5E",
    image: "noctis.jpeg",
    citation: "L'incarnation de la peur ; pas celle qu'on inspire mais celle que l'on ressent.",
    description:
      "Noctis incarne l'obscurité et la peur ressentie. Contrairement à ce qu'on pourrait attendre, il est la personnification non de la terreur qu'on inspire, mais de la vulnérabilité de celui qui craint.",
    personnalite:
      "Doux, anxieux et empathique malgré son domaine. Noctis comprend profondément la peur car il la ressent lui-même. Il est le protecteur de ceux qui tremblent dans le noir, non leur bourreau.",
    conditionPacte:
      "Vaincre ses peurs et phobies. Noctis accorde son pacte à ceux qui ont affronté ce qui les terrorisait le plus et l'ont surmonté.",
  },
  {
    slug: "vespera",
    nom: "Vespera",
    genre: "Féminin",
    element: "Lumière",
    couleur: "#F5C842",
    image: "vespera.jpeg",
    citation: "Une incarnation de la lumière sous toutes ses formes : la chaleur réconfortante du matin.",
    description:
      "Vespera est l'incarnation de la lumière dans toutes ses manifestations — la clarté du jour, la chaleur du soleil, l'espoir et la guérison.",
    personnalite:
      "Énergique, altruiste et résiliente, Vespera a tendance à s'épuiser à force d'aider les autres. Elle est la plus interventionniste des Ryximus, toujours prête à agir pour alléger la souffrance des mortels.",
    conditionPacte:
      "Persévérer à travers les épreuves de la vie. Vespera accorde son pacte à ceux qui ont fait preuve d'une résilience remarquable face à l'adversité.",
  },
  {
    slug: "sylvae",
    nom: "Sylvaë",
    genre: "Masculin",
    element: "Nature",
    couleur: "#4A7A3D",
    image: "sylvaë.jpeg",
    citation: "Incarne la lenteur, celle qu'on retrouve dans un chêne qui a pris mille ans à construire.",
    description:
      "Sylvaë est l'esprit de la nature dans ce qu'elle a de plus patient et de plus durable. Il représente les cycles naturels, la croissance lente et la sagesse qui vient avec le temps.",
    personnalite:
      "Patient, paisible et contemplatif, Sylvaë réfléchit toujours aux cycles naturels. Sa temporalité est différente des autres — là où ses frères et sœurs pensent en années, lui pense en siècles.",
    conditionPacte:
      "Être en harmonie avec la nature ou faire preuve d'une patience exceptionnelle. Sylvaë n'est pas pressé d'accorder son pacte.",
  },
  {
    slug: "ignir",
    nom: "Ignir",
    genre: "Masculin",
    element: "Feu",
    couleur: "#E84A2F",
    image: "ignir.jpeg",
    citation: "L'incarnation de l'intensité, de cette flamme rebelle qui brûle dans chaque être.",
    description:
      "Ignir est le feu à l'état pur : l'intensité, la passion, la destruction créatrice et la chaleur vitale. Il représente tout ce qui brûle avec force, de la flamme d'un foyer à l'ambition d'un conquérant.",
    personnalite:
      "Intense, charismatique, impulsif et passionné. Ignir vit chaque instant comme si c'était le dernier. Sa présence est difficile à ignorer — il embrase tout ce qu'il touche, pour le meilleur et pour le pire.",
    conditionPacte:
      "Faire preuve d'une motivation ardente et d'une intensité égale à la sienne. Ignir n'accorde son pacte qu'à ceux qui brûlent d'une flamme aussi vive que la sienne.",
  },
  {
    slug: "galdros",
    nom: "Galdros",
    genre: "Masculin",
    element: "Terre",
    couleur: "#7A5C30",
    image: "galdros.jpeg",
    citation: "Très stoïque, presque inexpressif en toutes circonstances, on pourrait croire qu'il a un cœur de pierre.",
    description:
      "Galdros est le plus ancien des Ryximus. Il incarne la terre dans ce qu'elle a de plus solide — la fondation, la permanence, la protection et le poids des responsabilités.",
    personnalite:
      "Stoïque, presque inexpressif, Galdros est un protecteur fiable pour ses frères et sœurs Ryximus. Il est celui qui maintient la stabilité quand tout autour semble vaciller. Son apparente froideur cache une profonde loyauté.",
    conditionPacte:
      "Être déterminé et fiable. Galdros favorise les individus qui font preuve d'une volonté inébranlable et d'une constance dans leurs engagements.",
  },
  {
    slug: "zoggan",
    nom: "Zoggan",
    genre: "Féminin",
    element: "Air",
    couleur: "#A8D8EA",
    image: "zoggan.jpeg",
    citation: "N'a qu'un seul maître mot : la liberté.",
    description:
      "Zoggan est l'incarnation de l'air et de la liberté. Imprévisible comme le vent, elle ne peut être contrainte ni encadrée. Elle représente la liberté absolue, le voyage et le changement perpétuel.",
    personnalite:
      "Imprévisible, éprise de liberté, Zoggan fuit les responsabilités et les engagements. Elle apparaît et disparaît selon son bon vouloir, même parmi les Ryximus. Sa bonne humeur est contagieuse mais on ne peut jamais compter sur sa présence.",
    conditionPacte:
      "Avoir un désir profond de liberté. Zoggan accorde son pacte à ceux qui refusent d'être enfermés dans les conventions et aspirent à une existence libre de toute contrainte.",
  },
  {
    slug: "nyrel",
    nom: "Nyrel",
    genre: "Féminin",
    element: "Eau",
    couleur: "#2E86AB",
    image: "nyrel.jpeg",
    citation: "Très franche, elle apprécie que les gens le soient en retour.",
    description:
      "Nyrel est l'incarnation de l'eau et des émotions. Comme l'eau qui prend la forme de son contenant, elle s'adapte mais conserve toujours sa nature profonde — fluide, sincère et profonde.",
    personnalite:
      "Très franche et émotionnellement expressive, Nyrel dit toujours ce qu'elle pense et attend la même chose en retour. Elle est généreuse avec ceux qui lui font confiance et impitoyable envers la fausseté.",
    conditionPacte:
      "Embrasser ses émotions ouvertement et sincèrement. Nyrel accorde son pacte à ceux qui ne cachent pas ce qu'ils ressentent et vivent avec authenticité.",
  },
];
