"use client"

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Button } from './button'
import { X } from 'lucide-react'

// AIDEV-NOTE: Import highlight.js CSS for code syntax highlighting
import 'highlight.js/styles/github-dark.css'

export type EducationalLevel = 'intuitive' | 'conceptual' | 'technical'

export interface EducationalContent {
  title: string
  layers: {
    intuitive: {
      title: string
      content: string
      audienceHint?: string
    }
    conceptual: {
      title: string
      content: string
      audienceHint?: string
    }
    technical: {
      title: string
      content: string
      audienceHint?: string
    }
  }
  parameters?: {
    [key: string]: string
  }
  resources?: {
    title: string
    url: string
    type: 'article' | 'paper' | 'tutorial' | 'documentation'
  }[]
}

export type OverlayType = 'accordion' | 'sidebar'

export interface EducationalOverlayProps {
  type: OverlayType
  content: EducationalContent
  isVisible: boolean
  onClose: () => void
  className?: string
}

// AIDEV-NOTE: Base educational overlay component for prototyping different approaches
export function EducationalOverlay({
  type,
  content,
  isVisible,
  onClose,
  className = ""
}: EducationalOverlayProps) {
  if (!isVisible) return null

  const renderContent = () => {
    switch (type) {
      case 'accordion':
        return <AccordionOverlay content={content} onClose={onClose} />
      case 'sidebar':
        return <SidebarOverlay content={content} onClose={onClose} />
      default:
        return null
    }
  }

  return (
    <div className={`educational-overlay ${className}`}>
      {renderContent()}
    </div>
  )
}


// Accordion implementation with horizontal tabs
function AccordionOverlay({ content, onClose }: { content: EducationalContent; onClose: () => void }) {
  const [currentLevel, setCurrentLevel] = React.useState<EducationalLevel>(() => {
    // Load saved preference or default to intuitive
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('educational-level-preference')
        if (saved && ['intuitive', 'conceptual', 'technical'].includes(saved)) {
          return saved as EducationalLevel
        }
      } catch (error) {
        console.warn('Failed to load preference:', error)
      }
    }
    return 'intuitive'
  })

  const [savePreference, setSavePreference] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)

  // AIDEV-NOTE: Reset scroll position when tab changes
  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [currentLevel])

  const switchLevel = (level: EducationalLevel) => {
    setCurrentLevel(level)
    if (savePreference && typeof window !== 'undefined') {
      try {
        localStorage.setItem('educational-level-preference', level)
      } catch (error) {
        console.warn('Failed to save preference:', error)
      }
    }
  }

  const toggleSavePreference = () => {
    const newSaveState = !savePreference
    setSavePreference(newSaveState)
    
    if (newSaveState && typeof window !== 'undefined') {
      try {
        localStorage.setItem('educational-level-preference', currentLevel)
      } catch (error) {
        console.warn('Failed to save preference:', error)
      }
    } else if (!newSaveState && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('educational-level-preference')
      } catch (error) {
        console.warn('Failed to clear preference:', error)
      }
    }
  }

  const levelConfig = {
    intuitive: { label: 'Intuitive', hint: 'Beginner-friendly' },
    conceptual: { label: 'Conceptual', hint: 'Intermediate' },
    technical: { label: 'Technical', hint: 'Advanced' }
  }

  const currentContent = content.layers[currentLevel]

  return (
    <div className="bg-background border border-border rounded-lg mt-4 overflow-hidden animate-in slide-in-from-top-4 duration-300">
      {/* Header with close button */}
      <div className="flex justify-between items-center p-4 border-b border-border bg-background/50">
        <div className="flex items-center gap-3">
          <span className="text-foreground text-lg">🎓</span>
          <h3 className="text-foreground font-mono uppercase text-lg">{content.title}</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close educational overlay">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Horizontal tab navigation */}
      <div className="flex bg-background/50 border-b border-border">
        {Object.entries(levelConfig).map(([level, config]) => (
          <button
            key={level}
            onClick={() => switchLevel(level as EducationalLevel)}
            className={`flex-1 py-4 px-6 text-sm font-mono uppercase transition-all duration-200 ${
              currentLevel === level
                ? 'bg-accent-primary text-accent-primary-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <div className="text-center">
              <div className="font-semibold">{config.label}</div>
              <div className="text-xs opacity-75 mt-1">{config.hint}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Content area - horizontal layout optimized */}
      <div ref={contentRef} className="p-6 bg-background min-h-[300px] max-h-[400px] overflow-auto">
        <div className="max-w-4xl">
          <h4 className="text-foreground font-mono text-xl mb-4 border-b border-border pb-2">
            {currentContent.title}
          </h4>
          <div className="text-foreground leading-relaxed text-base prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Custom styling for markdown elements to match technical aesthetic
                h1: ({ children }) => <h1 className="text-foreground font-mono text-xl mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-foreground font-mono text-lg mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-foreground font-mono text-base mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-foreground mb-4 leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                code: ({ children, className }) => {
                  const isInline = !className
                  return isInline ? (
                    <code className="bg-muted text-foreground px-1 py-0.5 rounded font-mono text-sm">{children}</code>
                  ) : (
                    <code className={className}>{children}</code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="bg-gray-900 border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono text-sm">
                    {children}
                  </pre>
                ),
                ul: ({ children }) => <ul className="text-foreground mb-4 pl-6 space-y-2 list-disc">{children}</ul>,
                ol: ({ children }) => <ol className="text-foreground mb-4 pl-6 space-y-2 list-decimal">{children}</ol>,
                li: ({ children }) => <li className="text-foreground">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted-foreground pl-4 italic text-muted-foreground mb-4">
                    {children}
                  </blockquote>
                )
              }}
            >
              {currentContent.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Footer with preference toggle - more compact for accordion */}
      <div className="border-t border-border px-6 py-3 bg-background/50">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={savePreference}
            onChange={toggleSavePreference}
            className="accent-accent-primary"
          />
          <span>Remember my preferred level for all patterns</span>
        </label>
      </div>
    </div>
  )
}

// Sidebar implementation with vertical stacked layout
function SidebarOverlay({ content, onClose }: { content: EducationalContent; onClose: () => void }) {
  const [isEntering, setIsEntering] = React.useState(true)
  const [isExiting, setIsExiting] = React.useState(false)

  // Trigger entrance animation on mount
  React.useEffect(() => {
    const timer = setTimeout(() => setIsEntering(false), 50) // Small delay to ensure initial render
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsExiting(true)
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose()
    }, 300) // Match animation duration
  }

  const [currentLevel, setCurrentLevel] = React.useState<EducationalLevel>(() => {
    // Load saved preference or default to intuitive
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('educational-level-preference')
        if (saved && ['intuitive', 'conceptual', 'technical'].includes(saved)) {
          return saved as EducationalLevel
        }
      } catch (error) {
        console.warn('Failed to load preference:', error)
      }
    }
    return 'intuitive'
  })

  const [savePreference, setSavePreference] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)

  // AIDEV-NOTE: Reset scroll position when tab changes
  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [currentLevel])

  const switchLevel = (level: EducationalLevel) => {
    setCurrentLevel(level)
    if (savePreference && typeof window !== 'undefined') {
      try {
        localStorage.setItem('educational-level-preference', level)
      } catch (error) {
        console.warn('Failed to save preference:', error)
      }
    }
  }

  const toggleSavePreference = () => {
    const newSaveState = !savePreference
    setSavePreference(newSaveState)
    
    if (newSaveState && typeof window !== 'undefined') {
      try {
        localStorage.setItem('educational-level-preference', currentLevel)
      } catch (error) {
        console.warn('Failed to save preference:', error)
      }
    } else if (!newSaveState && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('educational-level-preference')
      } catch (error) {
        console.warn('Failed to clear preference:', error)
      }
    }
  }

  const levelConfig = {
    intuitive: { label: 'Intuitive', hint: 'Beginner', icon: '🌱' },
    conceptual: { label: 'Conceptual', hint: 'Intermediate', icon: '🧠' },
    technical: { label: 'Technical', hint: 'Advanced', icon: '⚙️' }
  }

  const currentContent = content.layers[currentLevel]

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div 
        data-testid="sidebar-backdrop"
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40 transition-opacity duration-300 ${
          isExiting ? 'opacity-0' : isEntering ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose} 
      />
      
      {/* Sidebar panel */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-96 bg-background border-l border-border z-50 flex flex-col transition-transform duration-300 ${
        isExiting ? 'translate-x-full' : isEntering ? 'translate-x-full' : 'translate-x-0'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border bg-background/50">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-lg">🎓</span>
            <h3 className="text-foreground font-mono uppercase text-sm md:text-base">
              {content.title}
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-muted-foreground hover:text-foreground" aria-label="Close educational overlay">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Vertical level navigation */}
        <div className="p-4 border-b border-border bg-background/50">
          <div className="space-y-2">
            {Object.entries(levelConfig).map(([level, config]) => (
              <button
                key={level}
                onClick={() => switchLevel(level as EducationalLevel)}
                className={`w-full text-left p-3 rounded-md font-mono text-sm transition-all duration-200 ${
                  currentLevel === level
                    ? 'bg-accent-primary text-accent-primary-foreground shadow-lg'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{config.icon}</span>
                  <div>
                    <div className="font-semibold uppercase">{config.label}</div>
                    <div className="text-xs opacity-75">{config.hint}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content area - scrollable */}
        <div ref={contentRef} className="flex-1 p-4 overflow-auto">
          <div>
            <h4 className="text-foreground font-mono text-lg mb-3 border-b border-border pb-2">
              {currentContent.title}
            </h4>
            <div className="text-foreground leading-relaxed text-sm prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Custom styling for markdown elements to match technical aesthetic
                  h1: ({ children }) => <h1 className="text-foreground font-mono text-lg mb-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-foreground font-mono text-base mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-foreground font-mono text-sm mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-foreground mb-3 leading-relaxed">{children}</p>,
                  strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                  code: ({ children, className }) => {
                    const isInline = !className
                    return isInline ? (
                      <code className="bg-muted text-foreground px-1 py-0.5 rounded font-mono text-xs">{children}</code>
                    ) : (
                      <code className={className}>{children}</code>
                    )
                  },
                  pre: ({ children }) => (
                    <pre className="bg-gray-900 border border-border rounded-lg p-3 overflow-x-auto mb-3 font-mono text-xs">
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => <ul className="text-foreground mb-3 pl-4 space-y-1 list-disc">{children}</ul>,
                  ol: ({ children }) => <ol className="text-foreground mb-3 pl-4 space-y-1 list-decimal">{children}</ol>,
                  li: ({ children }) => <li className="text-foreground">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-muted-foreground pl-3 italic text-muted-foreground mb-3">
                      {children}
                    </blockquote>
                  )
                }}
              >
                {currentContent.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Footer with preference toggle */}
        <div className="border-t border-border p-4 bg-background/50">
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={savePreference}
              onChange={toggleSavePreference}
              className="accent-accent-primary mt-0.5"
            />
            <span>Remember my preferred level for all patterns</span>
          </label>
        </div>
      </div>
    </>
  )
}