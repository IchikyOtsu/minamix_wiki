-- Migre les traditions du format tableau [{nom, description}] vers une chaîne HTML
UPDATE pays
SET data = jsonb_set(
  data,
  '{traditions}',
  to_jsonb(
    '<ul>' || (
      SELECT string_agg(
        '<li><strong>' || (t->>'nom') || '</strong> — ' || (t->>'description') || '</li>',
        ''
      )
      FROM jsonb_array_elements(data->'traditions') AS t
    ) || '</ul>'
  )
)
WHERE jsonb_typeof(data->'traditions') = 'array';
