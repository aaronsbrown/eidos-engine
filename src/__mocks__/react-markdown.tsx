import React from 'react'

// AIDEV-NOTE: Mock ReactMarkdown for testing - renders children as plain text to avoid ESM issues
const ReactMarkdown = ({ children }: { children: string }) => {
  return <div data-testid="markdown-content">{children}</div>
}

export default ReactMarkdown