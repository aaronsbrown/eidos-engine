import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'padded',
  },
}

export default meta

// Typography specimen component
const TypographySpecimen = ({ 
  title, 
  className, 
  children,
  description 
}: { 
  title: string
  className: string
  children: React.ReactNode
  description?: string
}) => (
  <div className="mb-6 p-4 border border-border rounded-lg">
    <div className="flex justify-between items-baseline mb-2">
      <h3 className="text-sm font-mono uppercase tracking-wide text-muted-foreground">{title}</h3>
      <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{className}</code>
    </div>
    {description && (
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
    )}
    <div className={className}>
      {children}
    </div>
  </div>
)

// Font families showcase
export const FontFamilies: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">Font Families</h2>
        
        <TypographySpecimen
          title="Geist Sans"
          className="font-sans text-lg"
          description="Primary font for general text content"
        >
          The quick brown fox jumps over the lazy dog. ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Geist Mono" 
          className="font-mono text-lg"
          description="Monospace font for technical content, labels, and UI elements"
        >
          The quick brown fox jumps over the lazy dog. ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
        </TypographySpecimen>
      </div>
    </div>
  ),
}

// Standard text styles
export const StandardStyles: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">Standard Text Styles</h2>
        
        <TypographySpecimen
          title="Heading 1"
          className="text-4xl font-bold"
          description="Main page titles"
        >
          Pattern Generator System
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Heading 2"
          className="text-2xl font-semibold"
          description="Section headings"
        >
          Design System Documentation
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Heading 3"
          className="text-xl font-medium"
          description="Subsection headings"
        >
          Typography Specimens
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Body Text"
          className="text-base"
          description="Standard paragraph text"
        >
          This is the standard body text used throughout the application. It should be easily readable and provide good contrast against the background while maintaining the technical aesthetic of the design system.
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Small Text"
          className="text-sm"
          description="Secondary information and captions"
        >
          This is smaller text used for captions, metadata, and secondary information that supports the main content.
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Extra Small Text"
          className="text-xs"
          description="Fine print and minimal details"
        >
          This is extra small text used for fine print, technical details, and minimal UI elements.
        </TypographySpecimen>
      </div>
    </div>
  ),
}

// Technical/Blueprint styles
export const TechnicalStyles: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">Technical Blueprint Styles</h2>
        
        <TypographySpecimen
          title="Mono Uppercase"
          className="font-mono uppercase tracking-wide"
          description="Labels and technical identifiers"
        >
          PATTERN CONTROLS
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Mono Uppercase Small"
          className="font-mono uppercase tracking-wide text-sm"
          description="Small labels and form elements"
        >
          FREQUENCY RANGE
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Mono Regular"
          className="font-mono text-sm"
          description="Technical values and parameters"
        >
          amplitude: 0.85 | frequency: 2.4 | phase: 1.2
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Code Block"
          className="font-mono text-sm bg-muted p-3 rounded border"
          description="Code snippets and technical specifications"
        >
          {`interface PatternControl {
  id: string
  type: 'range' | 'color' | 'checkbox'
  defaultValue: number | string | boolean
}`}
        </TypographySpecimen>
      </div>
    </div>
  ),
}

// Mobile typography
export const MobileTypography: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">Mobile Typography Scale</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Responsive typography utilities optimized for mobile readability and touch interfaces
        </p>
        
        <TypographySpecimen
          title="Mobile Header"
          className="mobile-text-header"
          description="18px - Mobile page headers and primary navigation"
        >
          PATTERN GENERATOR
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Mobile Pattern Name"
          className="mobile-text-pattern"
          description="16px - Pattern names and main content"
        >
          Lorenz Attractor
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Mobile Label"
          className="mobile-text-label"
          description="14px - Control labels and form elements"
        >
          AMPLITUDE
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Mobile Value"
          className="mobile-text-value"
          description="14px - Input values and parameters"
        >
          0.85
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Mobile Small"
          className="mobile-text-small"
          description="12px - Secondary information and captions"
        >
          Range: 0.1 - 2.0
        </TypographySpecimen>
      </div>
    </div>
  ),
}

// Color variations
export const ColorVariations: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">Text Color Variations</h2>
        
        <TypographySpecimen
          title="Foreground"
          className="text-foreground text-lg"
          description="Primary text color - maximum contrast"
        >
          This is the primary text color with maximum contrast against the background.
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Muted Foreground"
          className="text-muted-foreground text-lg"
          description="Secondary text color - reduced emphasis"
        >
          This is muted text used for secondary information and reduced emphasis content.
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Accent Primary"
          className="text-accent-primary text-lg font-semibold"
          description="Yellow accent color for highlights and emphasis"
        >
          This text uses the primary yellow accent color for emphasis and highlights.
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Success"
          className="text-success-foreground text-lg"
          description="Success state color for positive feedback"
        >
          This text indicates success states and positive feedback.
        </TypographySpecimen>
        
        <TypographySpecimen
          title="Destructive"
          className="text-destructive text-lg"
          description="Error/warning color for alerts and validation"
        >
          This text indicates errors, warnings, and validation messages.
        </TypographySpecimen>
      </div>
    </div>
  ),
}

// Complete typography system
export const TypographySystem: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-mono uppercase tracking-wide mb-2">
          Typography System
        </h1>
        <p className="text-muted-foreground font-mono">
          Technical blueprint aesthetic with Geist font family
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Desktop Scale */}
        <div className="p-6 rounded-lg border border-border">
          <h3 className="font-mono uppercase tracking-wide mb-4 text-sm font-semibold">Desktop Scale</h3>
          <div className="space-y-4">
            <div className="text-4xl font-bold">Heading 1</div>
            <div className="text-2xl font-semibold">Heading 2</div>
            <div className="text-xl font-medium">Heading 3</div>
            <div className="text-base">Body text</div>
            <div className="text-sm">Small text</div>
            <div className="text-xs">Extra small</div>
          </div>
        </div>
        
        {/* Mobile Scale */}
        <div className="p-6 rounded-lg border border-border">
          <h3 className="font-mono uppercase tracking-wide mb-4 text-sm font-semibold">Mobile Scale</h3>
          <div className="space-y-4">
            <div className="mobile-text-header">MOBILE HEADER</div>
            <div className="mobile-text-pattern">Mobile Pattern</div>
            <div className="mobile-text-label">MOBILE LABEL</div>
            <div className="mobile-text-value">Mobile Value</div>
            <div className="mobile-text-small">Mobile small</div>
          </div>
        </div>
      </div>
      
      {/* Technical Styles */}
      <div className="p-6 rounded-lg border border-border">
        <h3 className="font-mono uppercase tracking-wide mb-4 text-sm font-semibold">Technical Blueprint Elements</h3>
        <div className="space-y-3">
          <div className="font-mono uppercase tracking-wide text-accent-primary">SYSTEM STATUS: ACTIVE</div>
          <div className="font-mono text-sm">parameter_value: 1.2847 | status: optimal</div>
          <div className="font-mono text-xs text-muted-foreground">// Technical annotation</div>
        </div>
      </div>
      
      <div className="p-4 rounded-lg bg-muted">
        <p className="text-sm font-mono text-muted-foreground text-center">
          Typography automatically scales and adapts between desktop and mobile breakpoints
        </p>
      </div>
    </div>
  ),
}