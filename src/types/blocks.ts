export interface Block {
  id: string
  type: 'text' | 'list' | 'image' | 'table' | 'callout'
  titre: string
  contenu: string   // table: JSON {headers,rows}; others: HTML or URL
  variant?: string  // callout: 'info'|'warning'|'success'|'quote'|'danger'
}

export interface TableData {
  headers: string[]
  rows: string[][]
}

export function parseTable(contenu: string): TableData {
  try {
    const p = JSON.parse(contenu)
    if (Array.isArray(p?.headers) && Array.isArray(p?.rows)) return p
  } catch { /* fall through */ }
  return { headers: ['Colonne 1', 'Colonne 2'], rows: [['', ''], ['', '']] }
}
