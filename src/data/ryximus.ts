import type { Block } from '@/types/blocks'

export interface Ryximus {
  slug: string;
  nom: string;
  genre: "Masculin" | "Féminin";
  element: string;
  couleur: string;
  image: string;
  personnalite: string;
  conditionPacte: string;
  blocks?: Block[];
}

export const ryximus: Ryximus[] = [
  {
    slug: "whimir",
    nom: "Whimir",
    genre: "Féminin",
    element: "Esprit",
    couleur: "#9B7EC8",
    image: "whimir.jpeg",
    personnalite:
      "<p>Dernière née des Ryximus, elle incarne l'élément le plus énigmatique et insaisissable : l'esprit. Contrairement aux autres, ses émotions ne sont pas palpables, elles sont voilées, presque absentes. Ses gestes sont lents, mesurés, souvent dérangeants dans leur précision. Elle parle peu, mais quand elle le fait, ses mots semblent disséquer l'âme. Parmi les siens, elle est l'incomprise. Trop étrange, trop froide, trop différente au sein de la fratrie. Cette incompréhension s'est changée en distance, puis en acceptation. Wihmir ne cherche pas à appartenir : elle préfère observer. Ce qu'elle aime, ce n'est pas l'agitation du monde, mais les méandres de l'esprit humain, là où résident les souvenirs brisés, les pensées secrètes, les failles. Elle explore ces failles comme d'autres explorent les mers, à la recherche de quelque chose sans savoir quoi exactement. Son regard est parfois cruel car elle aime ce qu'elle y trouve : les peurs, le désespoir, les fissures. Contrairement à ce que beaucoup pensent, Wihmir ne hait pas les mortels, elle les trouve fascinants. Trop fragiles pour la contenir, ceux qui ont le privilège de voir leur esprit envahit par sa présence garde de nombreuses séquelles. Vicieuse, elle l'est, sadique, elle se le refuse. Elle n'inflige pas la douleur aux autres, elle l'étudie, l'examine sous toutes ses formes jusqu'à trouver le point. Le point où l'humain vacille, où son esprit touche ses propres limites. Elle s'en délecte, ressent un frisson et un plaisir vorace. Elle ne cherche pas à détruire, mais à révéler et parfois, cela suffit à briser.</p>",
    conditionPacte:
      "<p>Passer au delà d'une barrière, d'un obstacle, physique ou psychique ; ceux qui ont chuté et se sont relevés autrement.</p>",
  },
  {
    slug: "noctis",
    nom: "Noctis",
    genre: "Masculin",
    element: "Obscurité",
    couleur: "#2D2D5E",
    image: "noctis.jpeg",
    personnalite:
      "<p>Noctis n'est pas l'ombre menaçante qui rôde dans les cauchemars mais plutôt celle qui observe en silence, le souffle court, toujours sur le qui-vive. Il est l'incarnation de la peur ; pas celle qu'on inspire mais celle que l'on ressent, qui ronge les os, qui paralyse chaque muscle d'un corps. Et pourtant, il est l'un des Ryximus les plus doux. Calme, effacé, en retrait, il n'élève jamais la voix. Il réfléchit longuement avant d'agir, souvent trop. Il doute beaucoup, Il craint de mal faire, de décevoir, de déclencher des conflits. Cette prudence extrême lui permet aussi d'éviter bien des erreurs. Il cherche toujours à apaiser, à comprendre, à désamorcer. Il est un médiateur sensible, bien plus empathique qu'il ne le laisse paraître. Il ne manque pas de force, ni de pouvoir, mais il ne souhaite pas l'utiliser. Il préfère tendre la main que serrer le poing. Ses responsabilités le terrifient, et c'est à Galdros, qu'il considère comme son roc, qu'il se réfère avant toute décision importante. Il le suit comme une ombre, non par soumission, mais par besoin de sécurité.</p>",
    conditionPacte:
      "<p>Passer outre ses peurs et phobies pour aller de l'avant.</p>",
  },
  {
    slug: "vespera",
    nom: "Vespera",
    genre: "Féminin",
    element: "Lumière",
    couleur: "#F5C842",
    image: "vespera.jpeg",
    personnalite:
      "<p>Vespera est une incarnation de la lumière sous toutes ses formes : la chaleur réconfortante du matin, l'éclat implacable du soleil désertique, l'espoir d'une lueur dans la nuit. Vive, solaire et parfois étourdissante, il est rare de la voir s'arrêter ou prendre une pause. Toujours en mouvement, elle agit, parle, console, éclaire. Son cœur déborde d'altruisme. Vespera veut aider, tout le temps, tout le monde, quitte à s'épuiser ou blesser par excès. Car si sa lumière réchauffe, elle peut aussi brûler. Elle a parfois du mal à comprendre que tout le monde ne souhaite pas être sauvé ou éclairé. Forte, courageuse, tenace, elle ne se laisse jamais abattre, même après des échecs cuisants. D'une détermination à rude épreuve, elle est résiliente, et continue d'avancer peu importe ce qu'il se passe. Elle croit au pardon, à la seconde chance, et à la bonté cachée en chacun. Pourtant derrière cette lumière se cache une certaine solitude : celle de l'étoile qui brille pour les autres, sans toujours savoir qui veillera sur elle.</p>",
    conditionPacte:
      "<p>Surmonter les épreuves de la vie et toujours avancer, même si leur vie s'effondre.</p>",
  },
  {
    slug: "sylvae",
    nom: "Sylvaë",
    genre: "Masculin",
    element: "Nature",
    couleur: "#4A7A3D",
    image: "sylvaë.jpeg",
    personnalite:
      "<p>Sylvaë incarne la lenteur, celle qu'on retrouve dans un chêne qui a pris mille ans à construire ses racines jusqu'à en devenir majestueux. Il dégage une aura apaisante, presque hypnotique, et sa présence rassure même les plus nerveux. Son esprit est ouvert, prêt à tout voir, tout entendre, de la mort d'un individu jusqu'à la naissance d'un nouveau-né. Tout est un cycle, un enchaînement qu'il préfère contempler, au lieu de parler, sans chercher à le bousculer, persuadé que le temps finit toujours par remettre les choses à leur juste place. Le peu qu'il parle, sa voix est grave et posée, un sourire toujours niché dans sa gorge. Pacifiste au plus profond de son être, il préfère la discussion au conflit, et la patience à l'impulsion. Il peut passer des heures assis au même endroit, simplement à écouter les chants des oiseaux ou le bruissement des feuilles. Son regard semble toujours un peu ailleurs, ce qui lui vaut quelques remarques durant les réunions familiales, où il a tendance à décrocher rapidement. Pourtant, il fait de son mieux, apportant ses mots et sa sagesse quand on le lui demande.</p>",
    conditionPacte:
      "<p>Sylvaë offre ses pouvoirs aux personnes vivant en harmonie avec la nature, ou faisant preuve d'une grande patience.</p>",
  },
  {
    slug: "ignir",
    nom: "Ignir",
    genre: "Masculin",
    element: "Feu",
    couleur: "#E84A2F",
    image: "ignir.jpeg",
    personnalite:
      "<p>Ignir est l'incarnation de l'intensité, de cette flamme rebelle qui brûle dans chaque être. Tout en lui flamboie : sa voix tonne, son rire explose et ses colères sont volcaniques. De par sa nature, il lui est impossible de faire les choses à moitié. Soit il aime ardemment, soit il déteste violemment ; soit il s'implique à corps perdu, soit il se détourne complètement. Son énergie est communicative, presque étourdissante. Charismatique, exubérant, provocateur, il attire facilement les regards, et aime s'en amuser. Il aime briller, séduire, provoquer, surtout quand il peut inspirer les autres à embraser leur propre feu intérieur. Toutefois, cette intensité fait aussi de lui quelqu'un de difficile à canaliser, sujet à l'impulsivité, à l'impatience, voire à l'imprudence. Son être parle avec des braises chaudes, envoûtantes et réconfortantes, à la fois à l'écoute et prêt à repartir à la moindre étincelle. Il respecte peu l'autorité, sauf quand elle vient de Galdros, qu'il accepte à contrecœur comme figure de repère. Il est comme un volcan : chaud, bouillant, prêt à l'explosion ; pourtant protégé par la terre qui l'empêche de déborder.</p>",
    conditionPacte:
      "<p>Ignir offre ses pouvoirs à celles et ceux qui, comme lui, sont animés par une passion brûlante, une motivation d'enfer, ou sont toujours à fond dans ce qu'ils font.</p>",
  },
  {
    slug: "galdros",
    nom: "Galdros",
    genre: "Masculin",
    element: "Terre",
    couleur: "#7A5C30",
    image: "galdros.jpeg",
    personnalite:
      "<p>Très stoïque, presque inexpressif en toutes circonstances, on pourrait croire qu'il a un cœur de pierre, ce qui n'est probablement pas totalement faux. Son calme en devient presque effrayant tant il semble fait de granite. Presque muet au-delà de ses responsabilités, souriant encore moins, il ne se livre jamais sur ce qu'il ressent, sur ce qu'il est ou ce qu'il aimerait. Aîné des 4, il porte une obligation en son sein : veiller sur ses cadets. Porter leurs colères, leurs erreurs et parfois leurs absences est son rôle, son devoir même. D'un sérieux exemplaire, il est le seul à assister systématiquement aux réunions de famille, à faire appliquer les pactes, à intervenir quand un autre Ryximu s'attarde trop chez les mortels. Pourtant, au-delà de sa carapace, Galdros n'est pas fait que de terre et de pierre. En minant, on découvre un être d'une tendresse austère mais profonde, son amour pour ses adelphes est immense et tout ce qu'il fait, c'est pour eux, pour que le monde reste stable et continue d'exister ainsi, avec sa famille. Il les protège, les discipline, parfois à leur grand désarroi, mais toujours dans un souci de cohésion, pour qu'ils restent tous les huit unis.</p>",
    conditionPacte:
      "<p>Il prête son pouvoir aux gens qui, comme lui, sont déterminés dans leurs idées, et sur qui on peut compter en toutes circonstances. Ce sont des personnes solides, de véritables bouées de sauvetage en plein naufrage.</p>",
  },
  {
    slug: "zoggan",
    nom: "Zoggan",
    genre: "Féminin",
    element: "Air",
    couleur: "#A8D8EA",
    image: "zoggan.jpeg",
    personnalite:
      "<p>Zoggan n'a qu'un seul maître mot : la liberté. Vive, imprévisible, audacieuse et d'une curiosité sans limite, elle est le symbole même de l'expression \"Libre comme l'air\". De ce fait, elle déteste toute forme de contrainte ou de routine, son être aspirant à voyager. Quant à ses responsabilités, elle les laisse de côté le plus possible, faisant semblant d'être aveugle pour s'amuser et vivre l'instant présent. Esprit provocateur, elle aime séduire, défier, rire et danser avec les mortels qui habitent le continent. Les réunions de famille l'ennuient alors elle fait semblant de les oublier. Il est plutôt aisé de la retrouver dans des tavernes ou lors des fêtes, sa présence est une brise légère qui renverse tout sur son passage, tel une tempête. Zoggan peut paraître superficielle mais sous son indécence se cache une forme de sagesse ; celle de suivre ses désirs sans honte ni remords.</p>",
    conditionPacte:
      "<p>Avoir un fort sens de la liberté, ou la désirer le plus ardemment possible est la condition pour que Zoggan offre ses pouvoirs au travers d'un pacte.</p>",
  },
  {
    slug: "nyrel",
    nom: "Nyrel",
    genre: "Féminin",
    element: "Eau",
    couleur: "#2E86AB",
    image: "nyrel.jpeg",
    personnalite:
      "<p>Très franche, elle apprécie que les gens le soient en retour. La sincérité et le respect sont ce qui lie les êtres vivants, tout comme l'eau qui est présente dans chacun des êtres. Nyrel est profondément émotive, toujours dans l'excès : elle rit à en pleurer, pleure à inonder les plaines, aime comme une mer calme ou déchaînée. De ce fait, elle ne cache rien, ni joie, ni colère. Son visage est le reflet de sa mer intérieure, facile à lire et à prévoir. Dernière de la fratrie des 4, elle est surtout reconnue pour sa nature douce et généreuse ainsi que son calme.</p>",
    conditionPacte:
      "<p>Nyrel accorde son pouvoir à celles et ceux qui vivent leurs émotions sans honte, et sont très expressifs, que ce soit dans le positif ou le négatif.</p>",
  },
];
