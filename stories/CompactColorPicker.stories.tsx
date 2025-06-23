import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import CompactColorPicker from '@/components/ui/compact-color-picker'

const meta: Meta<typeof CompactColorPicker> = {
  title: 'UI Components/Compact Color Picker',
  component: CompactColorPicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Compact color picker with portal-based popup, debounced updates, and precise positioning. Designed for technical UI with monospace aesthetics.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'color' },
      description: 'Current hex color value'
    },
    onChange: { 
      action: 'color changed',
      description: 'Callback when color changes (debounced 50ms)'
    },
    label: {
      control: { type: 'text' },
      description: 'Label displayed above the color picker'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// Default color picker
export const Default: Story = {
  args: {
    value: '#ff6b35',
    label: 'Primary Color',
    onChange: (color: string) => console.log('Color changed:', color)
  }
}

// Interactive example with state
export const Interactive: Story = {
  render: () => {
    const [color, setColor] = useState('#3b82f6')
    
    return (
      <div className="space-y-4 max-w-sm">
        <CompactColorPicker
          value={color}
          onChange={setColor}
          label="Interactive Color"
        />
        <div className="text-sm font-mono">
          <div>Current value: <span className="text-accent-primary">{color.toUpperCase()}</span></div>
          <div 
            className="mt-2 w-full h-8 border rounded"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing real-time color updates with state management and visual feedback.'
      }
    }
  }
}

// Multiple pickers (Four-pole gradient simulation)
export const MultiplePickers: Story = {
  render: () => {
    const [colors, setColors] = useState({
      topLeft: '#ff0000',
      topRight: '#00ff00',
      bottomLeft: '#0000ff',
      bottomRight: '#ffff00'
    })
    
    const updateColor = (key: string, value: string) => {
      setColors(prev => ({ ...prev, [key]: value }))
    }
    
    return (
      <div className="space-y-6 max-w-md">
        <div className="text-center">
          <h3 className="text-sm font-semibold mb-2">Four-Pole Gradient Colors</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Tests portal positioning with multiple color pickers
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <CompactColorPicker
            value={colors.topLeft}
            onChange={(color) => updateColor('topLeft', color)}
            label="Top Left"
          />
          <CompactColorPicker
            value={colors.topRight}
            onChange={(color) => updateColor('topRight', color)}
            label="Top Right"
          />
          <CompactColorPicker
            value={colors.bottomLeft}
            onChange={(color) => updateColor('bottomLeft', color)}
            label="Bottom Left"
          />
          <CompactColorPicker
            value={colors.bottomRight}
            onChange={(color) => updateColor('bottomRight', color)}
            label="Bottom Right"
          />
        </div>
        
        {/* Preview gradient */}
        <div 
          className="w-full h-24 border rounded"
          style={{
            background: `linear-gradient(135deg, ${colors.topLeft} 0%, ${colors.topRight} 25%, ${colors.bottomLeft} 75%, ${colors.bottomRight} 100%)`
          }}
        />
        
        <div className="text-xs font-mono space-y-1">
          <div>TL: <span className="text-accent-primary">{colors.topLeft}</span></div>
          <div>TR: <span className="text-accent-primary">{colors.topRight}</span></div>
          <div>BL: <span className="text-accent-primary">{colors.bottomLeft}</span></div>
          <div>BR: <span className="text-accent-primary">{colors.bottomRight}</span></div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple color pickers in a grid layout, testing portal positioning and interaction isolation. Simulates the four-pole gradient pattern interface.'
      }
    }
  }
}

// Color variations showcase
export const ColorVariations: Story = {
  render: () => {
    const presetColors = [
      { label: 'Red', value: '#ef4444' },
      { label: 'Orange', value: '#f97316' },
      { label: 'Yellow', value: '#eab308' },
      { label: 'Green', value: '#22c55e' },
      { label: 'Blue', value: '#3b82f6' },
      { label: 'Purple', value: '#a855f7' },
      { label: 'Pink', value: '#ec4899' },
      { label: 'Cyan', value: '#06b6d4' }
    ]
    
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold">Color Preset Variations</h3>
          <p className="text-xs text-muted-foreground">
            Different color values to test picker behavior
          </p>
        </div>
        
        <div className="grid grid-cols-4 gap-3 max-w-2xl">
          {presetColors.map((preset) => (
            <CompactColorPicker
              key={preset.label}
              value={preset.value}
              onChange={(color) => console.log(`${preset.label} changed:`, color)}
              label={preset.label}
            />
          ))}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Different color presets to test the picker with various hues and saturation levels.'
      }
    }
  }
}

// Edge cases and positioning
export const EdgeCases: Story = {
  render: () => {
    return (
      <div className="space-y-8">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold">Edge Case Testing</h3>
          <p className="text-xs text-muted-foreground">
            Tests portal positioning near viewport edges
          </p>
        </div>
        
        {/* Top edge */}
        <div>
          <h4 className="text-xs font-medium mb-2">Top Edge</h4>
          <div className="flex justify-center">
            <CompactColorPicker
              value="#ff0000"
              onChange={(color) => console.log('Top edge:', color)}
              label="Top Position"
            />
          </div>
        </div>
        
        {/* Left and right edges */}
        <div>
          <h4 className="text-xs font-medium mb-2">Left & Right Edges</h4>
          <div className="flex justify-between">
            <CompactColorPicker
              value="#00ff00"
              onChange={(color) => console.log('Left edge:', color)}
              label="Left Edge"
            />
            <CompactColorPicker
              value="#0000ff"
              onChange={(color) => console.log('Right edge:', color)}
              label="Right Edge"
            />
          </div>
        </div>
        
        {/* Long label test */}
        <div>
          <h4 className="text-xs font-medium mb-2">Long Label</h4>
          <div className="max-w-xs">
            <CompactColorPicker
              value="#ff00ff"
              onChange={(color) => console.log('Long label:', color)}
              label="Very Long Label That Might Overflow Container"
            />
          </div>
        </div>
        
        {/* Invalid color handling */}
        <div>
          <h4 className="text-xs font-medium mb-2">Edge Values</h4>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            <CompactColorPicker
              value="#000000"
              onChange={(color) => console.log('Black:', color)}
              label="Black"
            />
            <CompactColorPicker
              value="#ffffff"
              onChange={(color) => console.log('White:', color)}
              label="White"
            />
            <CompactColorPicker
              value="#808080"
              onChange={(color) => console.log('Gray:', color)}
              label="Gray"
            />
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests edge cases including viewport positioning, long labels, and extreme color values (black, white, gray).'
      }
    }
  }
}

// Responsive behavior
export const ResponsiveBehavior: Story = {
  render: () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold">Responsive Layout</h3>
          <p className="text-xs text-muted-foreground">
            Color picker adapts to different container sizes
          </p>
        </div>
        
        {/* Small container */}
        <div>
          <h4 className="text-xs font-medium mb-2">Small Container (150px)</h4>
          <div className="border rounded p-2" style={{ width: '150px' }}>
            <CompactColorPicker
              value="#e11d48"
              onChange={(color) => console.log('Small container:', color)}
              label="Small"
            />
          </div>
        </div>
        
        {/* Medium container */}
        <div>
          <h4 className="text-xs font-medium mb-2">Medium Container (250px)</h4>
          <div className="border rounded p-3" style={{ width: '250px' }}>
            <CompactColorPicker
              value="#059669"
              onChange={(color) => console.log('Medium container:', color)}
              label="Medium Size"
            />
          </div>
        </div>
        
        {/* Large container */}
        <div>
          <h4 className="text-xs font-medium mb-2">Large Container (400px)</h4>
          <div className="border rounded p-4" style={{ width: '400px' }}>
            <CompactColorPicker
              value="#7c3aed"
              onChange={(color) => console.log('Large container:', color)}
              label="Large Container"
            />
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests how the color picker behaves in containers of different sizes, ensuring portal positioning works correctly.'
      }
    }
  }
}

// Performance and debouncing demo
export const DebounceDemo: Story = {
  render: () => {
    const [updateCount, setUpdateCount] = useState(0)
    const [lastUpdate, setLastUpdate] = useState<string>('')
    
    const handleChange = (color: string) => {
      setUpdateCount(prev => prev + 1)
      setLastUpdate(new Date().toLocaleTimeString())
      console.log('Debounced update:', color)
    }
    
    return (
      <div className="space-y-4 max-w-sm">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold">Debounce Behavior</h3>
          <p className="text-xs text-muted-foreground">
            Updates are debounced by 50ms to prevent excessive re-renders
          </p>
        </div>
        
        <CompactColorPicker
          value="#8b5cf6"
          onChange={handleChange}
          label="Debounced Updates"
        />
        
        <div className="text-xs font-mono space-y-1 p-3 bg-muted/20 rounded">
          <div>Update count: <span className="text-accent-primary">{updateCount}</span></div>
          <div>Last update: <span className="text-accent-primary">{lastUpdate}</span></div>
          <div className="text-muted-foreground mt-2">
            Move the color picker handles quickly to see debounced updates
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the debouncing behavior that prevents excessive updates during rapid color changes.'
      }
    }
  }
}