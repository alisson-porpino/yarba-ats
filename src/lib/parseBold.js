
export function parseBoldHTML(text) {
  if (!text) return ''
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

export function parseBoldNodes(text) {
  if (!text) return []
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1
      ? { type: 'strong', content: part, key: i }
      : { type: 'text', content: part, key: i }
  )
}
