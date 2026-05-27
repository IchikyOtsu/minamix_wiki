'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

interface WikiEditorProps {
  content: string
  onChange: (html: string) => void
  className?: string
}

export function WikiEditor({ content, onChange, className = '' }: WikiEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'wiki-editor-content focus:outline-none',
      },
    },
  })

  if (!editor) return null

  return (
    <div className={`border border-[var(--card-border)] rounded-lg overflow-hidden shadow-sm ${className}`} style={{ borderColor: 'var(--gold)', borderWidth: '1.5px' }}>
      <div className="wiki-editor-toolbar">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Gras">
          <strong>G</strong>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italique">
          <em>I</em>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Souligné">
          <u>S</u>
        </Btn>
        <span className="sep" />
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titre 2">
          H2
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titre 3">
          H3
        </Btn>
        <span className="sep" />
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Liste à puces">
          •
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Liste numérotée">
          1.
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citation">
          ❝
        </Btn>
      </div>
      <div className="p-3 min-h-[80px]" style={{ background: 'var(--card-bg)' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

function Btn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={active ? 'active' : ''}
    >
      {children}
    </button>
  )
}
