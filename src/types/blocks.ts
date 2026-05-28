export interface Block {
  id: string
  type: 'text' | 'list' | 'image'
  titre: string
  contenu: string
}
