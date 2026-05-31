'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TiptapImage from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { ImagePickerModal } from './ImagePickerModal'
import { uploadImage } from '@/lib/uploadImage'
import { sanitizeName } from '@/lib/sanitize'

// ── Image style helpers ───────────────────────────────────────────────────────

function buildImgStyle(width: string, align: string): string {
  const w = width || '100%'
  if (align === 'left')  return `width:${w};max-width:100%;float:left;margin:0 1rem 0.5rem 0;`
  if (align === 'right') return `width:${w};max-width:100%;float:right;margin:0 0 0.5rem 1rem;`
  return `width:${w};max-width:100%;display:block;margin:0 auto;`
}

// ── Custom resizable image node view ─────────────────────────────────────────

const WIDTHS: [string, string][] = [['25%', 'XS'], ['50%', 'S'], ['75%', 'M'], ['100%', 'L']]
const ALIGNS: [string, string][] = [['left', '←'], ['center', '≡'], ['right', '→']]

function ImageNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, alt, width = '100%', align = 'center' } = node.attrs as {
    src: string; alt: string; width: string; align: string
  }

  return (
    <NodeViewWrapper className="my-2">
      <div className={selected ? 'outline outline-2 outline-blue-400 outline-offset-2 rounded-lg' : ''}>
        <img
          src={src}
          alt={alt || ''}
          style={Object.fromEntries(
            buildImgStyle(width, align)
              .split(';')
              .filter(Boolean)
              .map(s => {
                const [k, v] = s.split(':')
                return [k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v.trim()]
              })
          ) as React.CSSProperties}
          className="rounded-lg"
        />
        {selected && (
          <div
            contentEditable={false}
            onMouseDown={e => e.preventDefault()}
            className="flex items-center gap-2 mt-2 flex-wrap justify-center"
          >
            {/* Width presets */}
            <div className="flex items-center gap-0.5 bg-white shadow-md border border-gray-200 rounded-lg px-2 py-1">
              <span className="text-xs text-gray-400 mr-1 select-none">Taille</span>
              {WIDTHS.map(([w, label]) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => updateAttributes({ width: w, style: buildImgStyle(w, align) })}
                  className={`text-xs px-2 py-0.5 rounded-md font-medium transition-colors select-none ${
                    width === w ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* Alignment */}
            <div className="flex items-center gap-0.5 bg-white shadow-md border border-gray-200 rounded-lg px-2 py-1">
              <span className="text-xs text-gray-400 mr-1 select-none">Position</span>
              {ALIGNS.map(([a, label]) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => updateAttributes({ align: a, style: buildImgStyle(width, a) })}
                  className={`text-xs px-2 py-0.5 rounded-md font-medium transition-colors select-none ${
                    align === a ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

// ── Extended Image extension ──────────────────────────────────────────────────

const ResizableImage = TiptapImage.extend({
  addAttributes() {
    return {
      src:   { default: null },
      alt:   { default: '' },
      title: { default: null },
      width: {
        default: '100%',
        parseHTML: el => el.style.width || '100%',
        renderHTML: () => ({}), // handled via style below
      },
      align: {
        default: 'center',
        parseHTML: el => {
          if (el.style.float === 'left')  return 'left'
          if (el.style.float === 'right') return 'right'
          return 'center'
        },
        renderHTML: () => ({}),
      },
      style: {
        default: buildImgStyle('100%', 'center'),
        parseHTML: el => el.getAttribute('style'),
        renderHTML: attrs => ({ style: attrs.style ?? buildImgStyle(attrs.width, attrs.align) }),
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },
})

// ── Toolbar helpers ───────────────────────────────────────────────────────────

function Btn({ onClick, active, title, children }: {
  onClick: () => void; active: boolean; title: string; children: React.ReactNode
}) {
  return (
    <button type="button" onClick={onClick} title={title} className={active ? 'active' : ''}>
      {children}
    </button>
  )
}

const IconAlignLeft   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
const IconAlignCenter = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
const IconAlignRight  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
const IconLink        = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
const IconImage       = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>

// ── Main WikiEditor ───────────────────────────────────────────────────────────

type PendingUpload = { file: File; previewUrl: string; name: string; ext: string }

interface WikiEditorProps {
  content: string
  onChange: (html: string) => void
  className?: string
}

export function WikiEditor({ content, onChange, className = '' }: WikiEditorProps) {
  const [showPicker, setShowPicker]       = useState(false)
  const [showImageMenu, setShowImageMenu] = useState(false)
  const [pending, setPending]             = useState<PendingUpload | null>(null)
  const [uploading, setUploading]         = useState(false)
  const imageMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showImageMenu) return
    function handler(e: MouseEvent) {
      if (imageMenuRef.current && !imageMenuRef.current.contains(e.target as Node))
        setShowImageMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showImageMenu])

  useEffect(() => {
    return () => { if (pending) URL.revokeObjectURL(pending.previewUrl) }
  }, [pending])

  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ResizableImage,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: 'text-blue-600 underline hover:text-blue-800 cursor-pointer' },
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: 'wiki-editor-content focus:outline-none' } },
  })

  const insertImage = useCallback((url: string) => {
    if (!editor) return
    const style = buildImgStyle('100%', 'center')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor.chain().focus().setImage({ src: url, alt: '', width: '100%', align: 'center', style } as any).run()
  }, [editor])

  function handleFileSelect(file: File) {
    if (pending) URL.revokeObjectURL(pending.previewUrl)
    const clean = sanitizeName(file.name)
    const lastDot = clean.lastIndexOf('.')
    setPending({
      file,
      previewUrl: URL.createObjectURL(file),
      name: lastDot > 0 ? clean.slice(0, lastDot) : clean,
      ext: lastDot > 0 ? clean.slice(lastDot) : '',
    })
    setShowImageMenu(false)
  }

  async function confirmUpload() {
    if (!pending) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', pending.file)
      fd.append('name', pending.name.trim() || 'image')
      const result = await uploadImage(fd)
      if (!result.ok) { alert('Erreur upload : ' + result.error); return }
      insertImage(result.url)
      URL.revokeObjectURL(pending.previewUrl)
      setPending(null)
    } catch (e) {
      alert('Erreur : ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setUploading(false)
    }
  }

  function cancelPending() {
    if (pending) URL.revokeObjectURL(pending.previewUrl)
    setPending(null)
  }

  function handleLink() {
    if (!editor) return
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL du lien :', prev ?? 'https://')
    if (url === null) return
    if (!url.trim()) editor.chain().focus().unsetLink().run()
    else editor.chain().focus().setLink({ href: url.trim() }).run()
  }

  if (!editor) return null

  return (
    <div className={`border rounded-lg shadow-sm ${className}`} style={{ borderColor: 'var(--gold)', borderWidth: '1.5px' }}>

      {/* ── Toolbar ── */}
      <div className="wiki-editor-toolbar flex-wrap gap-y-0.5">
        {/* Format */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()}      active={editor.isActive('bold')}      title="Gras"><strong>G</strong></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()}    active={editor.isActive('italic')}    title="Italique"><em>I</em></Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Souligné"><u>S</u></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()}    active={editor.isActive('strike')}    title="Barré"><s>ab</s></Btn>
        <Btn onClick={() => editor.chain().focus().toggleCode().run()}      active={editor.isActive('code')}      title="Code inline"><code className="font-mono text-xs">`</code></Btn>
        <span className="sep" />

        {/* Headings */}
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titre 2">H2</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titre 3">H3</Btn>
        <span className="sep" />

        {/* Alignment */}
        <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()}   active={editor.isActive({ textAlign: 'left' })}   title="Gauche"><IconAlignLeft /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centrer"><IconAlignCenter /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()}  active={editor.isActive({ textAlign: 'right' })}  title="Droite"><IconAlignRight /></Btn>
        <span className="sep" />

        {/* Lists + misc */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive('bulletList')}  title="Liste à puces">•</Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Liste numérotée">1.</Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()}  active={editor.isActive('blockquote')}  title="Citation">❝</Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Séparateur">—</Btn>
        <span className="sep" />

        {/* Link */}
        <Btn onClick={handleLink} active={editor.isActive('link')} title={editor.isActive('link') ? 'Modifier le lien' : 'Insérer un lien'}>
          <IconLink />
        </Btn>

        {/* Image dropdown */}
        <div ref={imageMenuRef} className="relative">
          <Btn onClick={() => setShowImageMenu(m => !m)} active={showImageMenu} title="Insérer une image">
            <IconImage />
          </Btn>
          {showImageMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-30 w-48 py-1.5 overflow-hidden">
              <label className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                <span className="text-gray-400 text-base">↑</span> Uploader un fichier
                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = '' }} />
              </label>
              <button type="button" onClick={() => { setShowPicker(true); setShowImageMenu(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors">
                <span>🖼</span> Bibliothèque
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Pending upload confirm ── */}
      {pending && (
        <div className="border-b border-blue-200 bg-blue-50 p-3 space-y-2">
          <img src={pending.previewUrl} alt="aperçu" className="max-h-28 rounded-lg object-contain mx-auto block" />
          <p className="text-xs text-center text-gray-500">Nom du fichier</p>
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              value={pending.name}
              onChange={e => setPending(p => p ? { ...p, name: e.target.value } : null)}
              onKeyDown={e => { if (e.key === 'Enter') confirmUpload(); if (e.key === 'Escape') cancelPending() }}
              className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-blue-400"
              placeholder="nom-du-fichier"
              disabled={uploading}
            />
            <span className="text-xs text-gray-400 font-mono shrink-0">{pending.ext}</span>
            <button type="button" onClick={confirmUpload} disabled={uploading}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0">
              {uploading ? '…' : '↑ Insérer'}
            </button>
            <button type="button" onClick={cancelPending} disabled={uploading}
              className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors shrink-0">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div className="p-3 min-h-[80px]" style={{ background: 'var(--card-bg)' }}>
        <EditorContent editor={editor} />
      </div>

      {/* ── Library modal ── */}
      {showPicker && (
        <ImagePickerModal
          onSelect={url => { insertImage(url); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
