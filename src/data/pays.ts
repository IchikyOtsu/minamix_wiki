import type { Block } from '@/types/blocks'

export interface Pays {
  slug: string
  nom: string
  couleur: string
  blocks: Block[]
}

export const pays: Pays[] = [
  {
    slug: "silfus",
    nom: "Silfus",
    couleur: "#4D77DB",
    blocks: [
      {
        id: "silfus-geo",
        type: "text",
        titre: "Géographie",
        contenu: "<p>Silfus possède des frontières terrestres avec Lyndera et Ilonaï. Son territoire est principalement plat avec quelques collines éparses, organisé autour de la rivière Lizieu, du canal Paisible et du lac Curato. Le climat y est océanique.</p>",
      },
      {
        id: "silfus-hist",
        type: "text",
        titre: "Histoire",
        contenu: "<p>Vers l'an 250, les Ryximus créent les humains. La Grande Dynastie s'établit, marquée par des conflits entre mages et non-mages. Après sa chute en l'an 700, l'Empire sous l'Impératrice Vivynotta Reichauss prend le relais. Silfus est fondé en 1112 sous la famille De Nolid, puis passe aux Ginaldus en 1205.</p>",
      },
      {
        id: "silfus-pol-int",
        type: "text",
        titre: "Politique interne",
        contenu: "<p>Silfus est gouverné par un Roi qui arbitre entre le Conseil des Six familles : Sapienthys (Éducation et Recherche), Statera (Justice et Affaires étrangères), Exercitus (Intérieur et Armées), Laboren (Travail et Santé), Thesaurus (Économie et Finances), Agros (Culture et Agriculture).</p>",
      },
      {
        id: "silfus-pol-ext",
        type: "text",
        titre: "Politique externe",
        contenu: "<p>Les relations avec Lyndera sont marquées par des tensions diplomatiques autour de la cité-État de Frimaz. Ilonaï est ignorée. Les tensions avec Frimaz portent sur le commerce et les intérêts militaires.</p>",
      },
      {
        id: "silfus-mdv",
        type: "text",
        titre: "Mode de vie",
        contenu: "<p>La technologie est comparable au Moyen-Âge. La magie est intégrée dans la vie quotidienne avec une accessibilité variable selon la classe sociale. La médecine repose sur les remèdes à base de plantes et les pratiques traditionnelles.</p>",
      },
      {
        id: "silfus-trad",
        type: "list",
        titre: "Traditions",
        contenu: "<ul><li><strong>Le Rite</strong> — Compétition bisannuelle pour les jeunes mages.</li><li><strong>La Communion</strong> — Festival annuel d'une semaine pour remercier les éléments de la nature.</li><li><strong>Tasi</strong> — Tradition de dons basée sur la légende de deux amants des clans de lumière et d'obscurité.</li></ul>",
      },
      {
        id: "silfus-soc",
        type: "text",
        titre: "Société",
        contenu: "<p>Trois classes sociales : nobles et riches (moins de 15 %), bourgeoisie et classe moyenne (environ 30 %), peuple commun (environ 55 %).</p>",
      },
    ],
  },
  {
    slug: "lyndera",
    nom: "Lyndera",
    couleur: "#BA7F23",
    blocks: [
      {
        id: "lyndera-geo",
        type: "text",
        titre: "Géographie",
        contenu: "<p>Lyndera possède une frontière terrestre avec Silfus et une frontière maritime avec Ilonaï. Le terrain est montagneux, variant de 1 300 à 4 800 mètres. Les populations naines habitent des galeries souterraines. Le climat est frais avec la rivière Sableuse comme voie d'eau principale.</p>",
      },
      {
        id: "lyndera-hist",
        type: "text",
        titre: "Histoire",
        contenu: "<p>Lyndera partage une histoire similaire à Silfus jusqu'en l'an 906. La région a traversé l'Ère des Ténèbres avant de se stabiliser vers l'an 950 sous l'Alpha Nomaz Tioùa et la guilde de la Bête Rugissante. Plusieurs coups d'État ont mené à l'instauration des tournois de l'Arène en 1102 pour désigner les dirigeants.</p>",
      },
      {
        id: "lyndera-pol-int",
        type: "text",
        titre: "Politique interne",
        contenu: "<p>Monarchie absolue avec le Roi assisté d'un Triumvirat de trois conseillers de confiance sélectionnés via le tournoi Phaeton. La société est organisée en clans dirigés par des chefs qui maintiennent une semi-autonomie sous la tutelle royale.</p>",
      },
      {
        id: "lyndera-pol-ext",
        type: "text",
        titre: "Politique externe",
        contenu: "<p>Les relations avec Silfus sont froides. Lyndera considère Ilonaï comme un territoire à conquérir pour ses ressources. Frimaz est ciblée pour une influence diplomatique et économique.</p>",
      },
      {
        id: "lyndera-mdv",
        type: "text",
        titre: "Mode de vie",
        contenu: "<p>La technologie reste rudimentaire, axée sur l'artisanat, notamment la métallurgie et la fabrication d'armes. L'architecture est fortifiée. Solvernia est la ville principale avec des quartiers organisés par clans.</p>",
      },
      {
        id: "lyndera-trad",
        type: "list",
        titre: "Traditions",
        contenu: "<ul><li><strong>Arena Fight</strong> — Tournoi annuel déterminant la direction du pays.</li><li><strong>Phaeton</strong> — Tournoi pour sélectionner le Triumvirat (22-24 septembre).</li><li><strong>Aurae</strong> — Saison des amours au printemps.</li><li><strong>Tasi</strong> — Tradition de dons.</li></ul>",
      },
      {
        id: "lyndera-soc",
        type: "text",
        titre: "Société",
        contenu: "<p>Structure hiérarchique basée sur la dynamique prédateur-proie. Les autres races sont tolérées mais subordonnées. Les clans familiaux sont fondamentaux. L'éducation est pratique et martiale.</p>",
      },
    ],
  },
  {
    slug: "frimaz",
    nom: "Frimaz",
    couleur: "#72A06E",
    blocks: [
      {
        id: "frimaz-geo",
        type: "text",
        titre: "Géographie",
        contenu: "<p>Frimaz borde Silfus et Ilonaï par voie terrestre et maritime. Le terrain est relativement plat avec deux à trois collines, une mine et un climat continental organisé autour du canal Paisible.</p>",
      },
      {
        id: "frimaz-hist",
        type: "text",
        titre: "Histoire",
        contenu: "<p>Initialement partie de la forêt d'Ilonaï, Frimaz déclare son indépendance vers l'an 300 sous Friedrich Dolagan. Après des siècles d'occupation, une révolution démocratique en l'an 830 renverse la monarchie et établit une république.</p>",
      },
      {
        id: "frimaz-pol-int",
        type: "text",
        titre: "Politique interne",
        contenu: "<p>République démocratique avec deux Consuls (mandats d'un an) comme exécutifs, un Sénat de vingt membres (mandats de trois ans) avec pouvoir législatif, des Magistrats gérant des domaines spécifiques, un système judiciaire indépendant et une Assemblée Populaire permettant l'expression citoyenne.</p>",
      },
      {
        id: "frimaz-pol-ext",
        type: "text",
        titre: "Politique externe",
        contenu: "<p>Commerce modéré avec Silfus. Relations tendues avec Lyndera en raison des occupations passées. Échanges fréquents mais informels avec Ilonaï.</p>",
      },
      {
        id: "frimaz-mdv",
        type: "text",
        titre: "Mode de vie",
        contenu: "<p>Technologiquement avancée avec des systèmes d'égouts, des réseaux hydrauliques et des armes à poudre noire. L'architecture présente des bâtiments en pierre à plusieurs étages avec une infrastructure sophistiquée.</p>",
      },
      {
        id: "frimaz-trad",
        type: "list",
        titre: "Traditions",
        contenu: "<ul><li><strong>Konoka</strong> — Compétition trimestrielle d'entrée militaire pour les jeunes mages.</li><li><strong>Exposition annuelle</strong> — Vitrine technologique annuelle (fin mars).</li><li><strong>Tasi</strong> — Tradition de dons.</li></ul>",
      },
      {
        id: "frimaz-soc",
        type: "text",
        titre: "Société",
        contenu: "<p>Nobles et riches (20 %), bourgeoisie et classe moyenne (40 %), peuple commun (40 %) engagé dans le travail manuel et de services.</p>",
      },
    ],
  },
  {
    slug: "ilonai",
    nom: "Ilonaï",
    couleur: "#B71414",
    blocks: [
      {
        id: "ilonai-geo",
        type: "text",
        titre: "Géographie",
        contenu: "<p>Ilonaï borde Frimaz et Silfus. Plus de la moitié du territoire est couvert de forêts denses (climat méditerranéen). Les zones restantes ont un climat continental avec quelques reliefs, organisées autour de la Rivière Défendue et du Lac d'Olfatra.</p>",
      },
      {
        id: "ilonai-hist",
        type: "text",
        titre: "Histoire",
        contenu: "<p>Territoire indépendant avec sa propre tradition monarchique jusqu'à la désastreuse gouvernance du Roi Trumpet en l'an 870 qui provoqua une rébellion. Durant plus de deux siècles, divers systèmes politiques échouèrent. La population finit par se fragmenter en villages autonomes et tribus nomades.</p>",
      },
      {
        id: "ilonai-pol-int",
        type: "text",
        titre: "Politique interne",
        contenu: "<p>Aucun gouvernement centralisé. Divisée en clans indépendants utilisant leurs propres systèmes de gouvernance, avec des décisions prises collectivement ou par l'autorité clanique traditionnelle.</p>",
      },
      {
        id: "ilonai-pol-ext",
        type: "text",
        titre: "Politique externe",
        contenu: "<p>Ignorée par Silfus. Vue avec suspicion par Lyndera en raison de prétendues ambitions territoriales. Maintient des relations commerciales pratiques mais informelles avec Frimaz.</p>",
      },
      {
        id: "ilonai-mdv",
        type: "text",
        titre: "Mode de vie",
        contenu: "<p>Technologie simple et durable axée sur le tir à l'arc, les remèdes à base de plantes et l'artisanat du bois. Les habitats s'intègrent dans la nature à travers des villages dans les arbres, des habitations en flanc de colline et des campements temporaires.</p>",
      },
      {
        id: "ilonai-magie",
        type: "text",
        titre: "Magie",
        contenu: "<p>La magie est intuitive, basée sur les émotions et liée à la nature plutôt qu'à l'étude académique. Il n'y a pas d'académies ; les anciens guident les jeunes praticiens. La magie évite la destruction et met l'accent sur l'équilibre naturel.</p>",
      },
      {
        id: "ilonai-trad",
        type: "list",
        titre: "Traditions",
        contenu: "<ul><li><strong>Shyke</strong> — Dernier jour de récolte pour remercier les Ryximus et les agriculteurs.</li><li><strong>Solstices et Équinoxes</strong> — Quatre célébrations saisonnières avec repas, vêtements et danses traditionnels.</li><li><strong>Tasi</strong> — Tradition de dons.</li></ul>",
      },
      {
        id: "ilonai-soc",
        type: "text",
        titre: "Société",
        contenu: "<p>Communautés diverses basées sur les clans avec des structures familiales élargies. Les rôles sont assignés par l'âge et l'expérience. L'éducation est pratique et orale. Plus grande tolérance raciale que dans les pays voisins.</p>",
      },
    ],
  },
]
