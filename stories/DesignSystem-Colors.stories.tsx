import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Design System/Color Swatches',
  parameters: {
    layout: 'padded',
  },
}

export default meta

// Color swatch component
const ColorSwatch = ({ 
  name, 
  cssVar, 
  description,
  className = ''
}: { 
  name: string
  cssVar: string
  description?: string
  className?: string
}) => (
  <div className="flex flex-col space-y-2">
    <div
      className={`w-20 h-20 rounded-lg border border-border shadow-sm ${className}`}
      style={{ backgroundColor: `var(${cssVar})` }}
    />
    <div className="text-xs font-mono">
      <div className="font-semibold text-foreground">{name}</div>
      <div className="text-muted-foreground">{cssVar}</div>
      {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
    </div>
  </div>
)

// Primary color palette
export const PrimaryColors: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">Primary Colors</h2>
        <div className="grid grid-cols-6 gap-4">
          <ColorSwatch 
            name="Background" 
            cssVar="--background" 
            description="Main app background"
          />
          <ColorSwatch 
            name="Foreground" 
            cssVar="--foreground" 
            description="Primary text color"
          />
          <ColorSwatch 
            name="Primary" 
            cssVar="--primary" 
            description="Primary action color"
          />
          <ColorSwatch 
            name="Primary FG" 
            cssVar="--primary-foreground" 
            description="Text on primary"
          />
          <ColorSwatch 
            name="Secondary" 
            cssVar="--secondary" 
            description="Secondary elements"
          />
          <ColorSwatch 
            name="Secondary FG" 
            cssVar="--secondary-foreground" 
            description="Text on secondary"
          />
        </div>
      </div>
    </div>
  ),
}

// Accent colors - the yellow system
export const AccentColors: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">Unified Yellow Accent System</h2>
        <div className="grid grid-cols-4 gap-4">
          <ColorSwatch 
            name="Accent Primary" 
            cssVar="--accent-primary" 
            description="Main yellow accent"
          />
          <ColorSwatch 
            name="Accent Strong" 
            cssVar="--accent-primary-strong" 
            description="Darker emphasis"
          />
          <ColorSwatch 
            name="Accent Subtle" 
            cssVar="--accent-primary-subtle" 
            description="Light background"
          />
          <ColorSwatch 
            name="Accent FG" 
            cssVar="--accent-primary-foreground" 
            description="Text on yellow"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold font-mono uppercase tracking-wide mb-4">Interactive Controls</h3>
        <div className="grid grid-cols-3 gap-4">
          <ColorSwatch 
            name="Control Thumb" 
            cssVar="--control-thumb" 
            description="Slider thumbs"
          />
          <ColorSwatch 
            name="Control Track" 
            cssVar="--control-track" 
            description="Slider tracks"
          />
          <ColorSwatch 
            name="Control Active" 
            cssVar="--control-track-active" 
            description="Active track state"
          />
        </div>
      </div>
    </div>
  ),
}

// UI element colors
export const UIColors: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">UI Element Colors</h2>
        <div className="grid grid-cols-6 gap-4">
          <ColorSwatch 
            name="Card" 
            cssVar="--card" 
            description="Card background"
          />
          <ColorSwatch 
            name="Card FG" 
            cssVar="--card-foreground" 
            description="Card text"
          />
          <ColorSwatch 
            name="Popover" 
            cssVar="--popover" 
            description="Popover background"
          />
          <ColorSwatch 
            name="Muted" 
            cssVar="--muted" 
            description="Muted background"
          />
          <ColorSwatch 
            name="Muted FG" 
            cssVar="--muted-foreground" 
            description="Muted text"
          />
          <ColorSwatch 
            name="Accent" 
            cssVar="--accent" 
            description="General accent"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold font-mono uppercase tracking-wide mb-4">Borders & Inputs</h3>
        <div className="grid grid-cols-5 gap-4">
          <ColorSwatch 
            name="Border" 
            cssVar="--border" 
            description="General borders"
          />
          <ColorSwatch 
            name="Input" 
            cssVar="--input" 
            description="Input backgrounds"
          />
          <ColorSwatch 
            name="Ring" 
            cssVar="--ring" 
            description="Focus rings"
          />
          <ColorSwatch 
            name="Form Border" 
            cssVar="--border-form" 
            description="Form element borders"
          />
          <ColorSwatch 
            name="Focus Ring" 
            cssVar="--focus-ring" 
            description="Form focus rings"
          />
        </div>
      </div>
    </div>
  ),
}

// State colors
export const StateColors: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">State Colors</h2>
        <div className="grid grid-cols-4 gap-4">
          <ColorSwatch 
            name="Destructive" 
            cssVar="--destructive" 
            description="Error/danger state"
          />
          <ColorSwatch 
            name="Success FG" 
            cssVar="--success-foreground" 
            description="Success text color"
          />
          <ColorSwatch 
            name="Disabled BG" 
            cssVar="--disabled-background" 
            description="Disabled background"
          />
          <ColorSwatch 
            name="Disabled Border" 
            cssVar="--disabled-border" 
            description="Disabled borders"
          />
        </div>
      </div>
    </div>
  ),
}

// Chart colors
export const ChartColors: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibred font-mono uppercase tracking-wide mb-4">Chart Colors</h2>
        <div className="grid grid-cols-5 gap-4">
          <ColorSwatch 
            name="Chart 1" 
            cssVar="--chart-1" 
            description="Data series 1"
          />
          <ColorSwatch 
            name="Chart 2" 
            cssVar="--chart-2" 
            description="Data series 2"
          />
          <ColorSwatch 
            name="Chart 3" 
            cssVar="--chart-3" 
            description="Data series 3"
          />
          <ColorSwatch 
            name="Chart 4" 
            cssVar="--chart-4" 
            description="Data series 4"
          />
          <ColorSwatch 
            name="Chart 5" 
            cssVar="--chart-5" 
            description="Data series 5"
          />
        </div>
      </div>
    </div>
  ),
}

// All colors overview
export const AllColors: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold font-mono uppercase tracking-wide mb-2">
          Pattern Generator Design System
        </h1>
        <p className="text-muted-foreground font-mono">
          Complete color palette using OKLCH color space with automatic light/dark themes
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-lg border border-border">
          <h3 className="font-mono uppercase tracking-wide mb-4 text-sm font-semibted">Core Colors</h3>
          <div className="grid grid-cols-3 gap-3">
            <ColorSwatch name="Background" cssVar="--background" />
            <ColorSwatch name="Foreground" cssVar="--foreground" />
            <ColorSwatch name="Primary" cssVar="--primary" />
            <ColorSwatch name="Secondary" cssVar="--secondary" />
            <ColorSwatch name="Muted" cssVar="--muted" />
            <ColorSwatch name="Accent" cssVar="--accent-primary" />
          </div>
        </div>
        
        <div className="p-6 rounded-lg border border-border">
          <h3 className="font-mono uppercase tracking-wide mb-4 text-sm font-semibold">Interactive Elements</h3>
          <div className="grid grid-cols-3 gap-3">
            <ColorSwatch name="Border" cssVar="--border" />
            <ColorSwatch name="Input" cssVar="--input" />
            <ColorSwatch name="Ring" cssVar="--ring" />
            <ColorSwatch name="Control" cssVar="--control-thumb" />
            <ColorSwatch name="Success" cssVar="--success-foreground" />
            <ColorSwatch name="Destructive" cssVar="--destructive" />
          </div>
        </div>
      </div>
      
      <div className="p-4 rounded-lg bg-muted">
        <p className="text-sm font-mono text-muted-foreground text-center">
          Colors automatically adapt between light and dark themes using CSS custom properties
        </p>
      </div>
    </div>
  ),
}