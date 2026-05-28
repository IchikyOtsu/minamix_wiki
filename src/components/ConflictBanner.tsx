'use client'

interface Props {
  onForce: () => void
  onCancel: () => void
  saving: boolean
}

export function ConflictBanner({ onForce, onCancel, saving }: Props) {
  return (
    <div
      className="w-full rounded-lg px-4 py-3 flex items-center gap-3 flex-wrap text-sm"
      style={{ background: 'rgba(160,100,10,0.10)', border: '1px solid rgba(160,100,10,0.35)', color: 'var(--ink-muted)' }}
    >
      <span className="flex-1">
        ⚠ Cette page a été modifiée depuis votre dernière lecture. Forcer écrasera ces changements.
      </span>
      <button onClick={onCancel} className="btn-wiki btn-wiki-ghost">Annuler & recharger</button>
      <button onClick={onForce} disabled={saving} className="btn-wiki btn-wiki-primary disabled:opacity-60">
        {saving ? 'Sauvegarde…' : 'Forcer la sauvegarde'}
      </button>
    </div>
  )
}
