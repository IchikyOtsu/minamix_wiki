interface RichTextProps {
  content: string
  className?: string
}

export function RichText({ content, className = '' }: RichTextProps) {
  if (!content) return null

  if (content.includes('<')) {
    return (
      <div
        className={`wiki-content ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  return (
    <p className={`text-justify leading-relaxed text-gray-800 ${className}`}>
      {content}
    </p>
  )
}
