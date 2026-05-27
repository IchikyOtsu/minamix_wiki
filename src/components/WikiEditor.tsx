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
    <div className={`border-2 border-blue-400 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-gray-100 border-b border-gray-300 p-1.5 flex flex-wrap gap-1">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Gras">
          <strong>G</strong>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italique">
          <em>I</em>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Souligné">
          <u>S</u>
        </Btn>
        <span className="w-px bg-gray-300 mx-0.5 self-stretch" />
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titre 2">
          H2
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titre 3">
          H3
        </Btn>
        <span className="w-px bg-gray-300 mx-0.5 self-stretch" />
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
      <div className="bg-white p-3 min-h-[80px]">
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
      className={`px-2 py-0.5 text-sm rounded font-medium transition-colors ${
        active ? 'bg-[#747474] text-white' : 'hover:bg-gray-200 text-gray-700'
      }`}
    >
      {children}
    </button>
  )
}
