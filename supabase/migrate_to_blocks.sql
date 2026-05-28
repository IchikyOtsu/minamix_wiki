-- Optional migration: convert old named fields in pays/races to blocks[] format.
-- The app automatically migrates old data when reading, so this script is NOT required.
-- Running it will store the converted format in the DB instead of migrating on every read.

-- ── Pays ──────────────────────────────────────────────────────────────────────
UPDATE pays
SET data = jsonb_build_object(
  'nom',    data->>'nom',
  'couleur', data->>'couleur',
  'blocks', (
    SELECT jsonb_agg(
      jsonb_build_object('id', gen_random_uuid()::text, 'type', t.type, 'titre', t.titre, 'contenu', t.contenu)
      ORDER BY t.ord
    )
    FROM (
      VALUES
        (1, 'text', 'Géographie',        data->>'geographie'),
        (2, 'text', 'Histoire',          data->>'histoire'),
        (3, 'text', 'Politique interne', data->>'politiqueInterne'),
        (4, 'text', 'Politique externe', data->>'politiqueExterne'),
        (5, 'text', 'Mode de vie',       data->>'modeDeVie'),
        (6, 'list', 'Traditions',        data->>'traditions'),
        (7, 'text', 'Société',           data->>'societe'),
        (8, 'text', 'Magie',             data->>'magie')
    ) AS t(ord, type, titre, contenu)
    WHERE t.contenu IS NOT NULL AND t.contenu <> ''
  )
)
WHERE (data ? 'geographie') AND NOT (data ? 'blocks');

-- ── Races ─────────────────────────────────────────────────────────────────────
UPDATE races
SET data = jsonb_build_object(
  'nom',          data->>'nom',
  'couleur',      data->>'couleur',
  'image',        data->>'image',
  'population',   (data->>'population')::numeric,
  'esperanceVie', data->>'esperanceVie',
  'blocks', (
    SELECT jsonb_agg(
      jsonb_build_object('id', gen_random_uuid()::text, 'type', t.type, 'titre', t.titre, 'contenu', t.contenu)
      ORDER BY t.ord
    )
    FROM (
      VALUES
        (1, 'text', 'Description',       data->>'description'),
        (2, 'text', 'Histoire',           data->>'histoire'),
        (3, 'text', 'Apparence physique', data->>'physique'),
        (4, 'text', 'Magie',              data->>'magie'),
        (5, 'text', 'Société',            data->>'societe')
    ) AS t(ord, type, titre, contenu)
    WHERE t.contenu IS NOT NULL AND t.contenu <> ''
  )
)
WHERE (data ? 'description') AND NOT (data ? 'blocks');
