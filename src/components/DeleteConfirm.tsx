'use client'

import { useState } from 'react'

interface Props {
  onConfirm: () => void | Promise<void>
  label?: string
}

export function DeleteConfirm({ onConfirm, label = 'Supprimer' }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await onConfirm()
    setLoading(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-md px-2.5 py-1.5">
        <span className="text-xs text-red-700 font-medium">Confirmer ?</span>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="text-xs font-bold text-red-700 hover:text-red-900 disabled:opacity-60 underline"
        >
          {loading ? '…' : 'Oui'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-500 hover:text-gray-800"
        >
          Non
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="btn-wiki btn-wiki-danger"
    >
      {label}
    </button>
  )
}
