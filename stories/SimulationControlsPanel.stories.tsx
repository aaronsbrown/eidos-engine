import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SimulationControlsPanel } from '@/components/ui/simulation-controls-panel'
import type { PatternControl } from '@/components/pattern-generators/types'

// Mock control configurations for different patterns
const mockBarcodeControls: PatternControl[] = [
  {
    id: 'scrollSpeed',
    label: 'Scroll Speed',
    type: 'range',
    min: 0.1,
    max: 5,
    step: 0.1,
    defaultValue: 2
  },
  {
    id: 'barDensity',
    label: 'Bar Density',
    type: 'range',
    min: 0.1,
    max: 1,
    step: 0.1,
    defaultValue: 0.6
  },
  {
    id: 'colorScheme',
    label: 'Color Scheme',
    type: 'select',
    defaultValue: 'classic',
    options: [
      { value: 'classic', label: 'Classic' },
      { value: 'inverted', label: 'Inverted' },
      { value: 'blue', label: 'Blue' },
      { value: 'amber', label: 'Amber' }
    ]
  },
  {
    id: 'showScanner',
    label: 'Show Scanner',
    type: 'checkbox',
    defaultValue: true
  }
]

const mockCellularAutomatonControls: PatternControl[] = [
  {
    id: 'rule',
    label: 'Rule',
    type: 'range',
    min: 0,
    max: 255,
    step: 1,
    defaultValue: 30
  },
  {
    id: 'rulePrev',
    label: 'PREV',
    type: 'button',
    defaultValue: false
  },
  {
    id: 'ruleNext',
    label: 'NEXT',
    type: 'button',
    defaultValue: false
  },
  {
    id: 'cellSize',
    label: 'Cell Size',
    type: 'range',
    min: 1,
    max: 10,
    step: 1,
    defaultValue: 4
  },
  {
    id: 'speed',
    label: 'Evolution Speed',
    type: 'range',
    min: 1,
    max: 20,
    step: 1,
    defaultValue: 5
  },
  {
    id: 'reset',
    label: 'RESET',
    type: 'button',
    defaultValue: false
  }
]

const mockFourPoleGradientControls: PatternControl[] = [
  {
    id: 'topLeft',
    label: 'Top Left',
    type: 'color',
    defaultValue: '#ff0000'
  },
  {
    id: 'topRight',
    label: 'Top Right',
    type: 'color',
    defaultValue: '#00ff00'
  },
  {
    id: 'bottomLeft',
    label: 'Bottom Left',
    type: 'color',
    defaultValue: '#0000ff'
  },
  {
    id: 'bottomRight',
    label: 'Bottom Right',
    type: 'color',
    defaultValue: '#ffff00'
  },
  {
    id: 'blendMode',
    label: 'Blend Mode',
    type: 'select',
    defaultValue: 'smooth',
    options: [
      { value: 'smooth', label: 'Smooth' },
      { value: 'linear', label: 'Linear' },
      { value: 'radial', label: 'Radial' }
    ]
  },
  {
    id: 'intensity',
    label: 'Intensity',
    type: 'range',
    min: 0,
    max: 2,
    step: 0.1,
    defaultValue: 1
  }
]

const meta: Meta<typeof SimulationControlsPanel> = {
  title: 'UI Components/Simulation Controls Panel',
  component: SimulationControlsPanel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Control panel for pattern parameters with special layouts for specific patterns like cellular automaton navigation and four-pole gradient color grids.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    patternId: {
      control: { type: 'select' },
      options: ['barcode-generator', 'cellular-automaton', 'four-pole-gradient', 'particle-system'],
      description: 'Pattern ID determines special layout handling'
    },
    controls: {
      control: false,
      description: 'Array of pattern controls defining the UI elements'
    },
    currentValues: {
      control: false,
      description: 'Current values for all controls'
    },
    onControlChange: { 
      action: 'control changed',
      description: 'Callback when control value changes'
    },
    sidebarWidth: {
      control: { type: 'range', min: 200, max: 800, step: 50 },
      description: 'Width affects responsive grid layout'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// Default pattern controls
export const Default: Story = {
  render: () => {
    const [values, setValues] = useState({
      scrollSpeed: 2,
      barDensity: 0.6,
      colorScheme: 'classic',
      showScanner: true
    })
    
    return (
      <div className="space-y-4 max-w-md">
        <SimulationControlsPanel
          patternId="barcode-generator"
          controls={mockBarcodeControls}
          currentValues={values}
          onControlChange={(controlId, value) => {
            setValues(prev => ({ ...prev, [controlId]: value }))
            console.log('Control changed:', controlId, value)
          }}
          sidebarWidth={400}
        />
        
        <div className="text-sm font-mono p-3 bg-muted/20 rounded">
          <div className="font-semibold mb-2">Current Values:</div>
          <div>Scroll Speed: <span className="text-accent-primary">{values.scrollSpeed}×</span></div>
          <div>Bar Density: <span className="text-accent-primary">{values.barDensity}</span></div>
          <div>Color Scheme: <span className="text-accent-primary">{values.colorScheme}</span></div>
          <div>Show Scanner: <span className="text-accent-primary">{values.showScanner.toString()}</span></div>
        </div>
      </div>
    )
  }
}

// No controls state
export const NoControls: Story = {
  args: {
    patternId: 'static-pattern',
    controls: [],
    currentValues: {},
    onControlChange: (controlId: string, value: number | string | boolean) => 
      console.log('Control changed:', controlId, value),
    sidebarWidth: 400
  }
}

// Cellular Automaton with special navigation
export const CellularAutomaton: Story = {
  args: {
    patternId: 'cellular-automaton',
    controls: mockCellularAutomatonControls,
    currentValues: {
      rule: 30,
      rulePrev: false,
      ruleNext: false,
      cellSize: 4,
      speed: 5,
      reset: false
    },
    onControlChange: (controlId: string, value: number | string | boolean) => 
      console.log('Control changed:', controlId, value),
    sidebarWidth: 400
  },
  parameters: {
    docs: {
      description: {
        story: 'Cellular automaton pattern shows special navigation with PREV/NEXT buttons and current rule display at the top.'
      }
    }
  }
}

// Four-pole gradient with 2x2 color grid
export const FourPoleGradient: Story = {
  args: {
    patternId: 'four-pole-gradient',
    controls: mockFourPoleGradientControls,
    currentValues: {
      topLeft: '#ff0000',
      topRight: '#00ff00', 
      bottomLeft: '#0000ff',
      bottomRight: '#ffff00',
      blendMode: 'smooth',
      intensity: 1
    },
    onControlChange: (controlId: string, value: number | string | boolean) => 
      console.log('Control changed:', controlId, value),
    sidebarWidth: 400
  },
  parameters: {
    docs: {
      description: {
        story: 'Four-pole gradient pattern displays color pickers in a special 2x2 grid layout with other controls below.'
      }
    }
  }
}

// Responsive layout testing
export const ResponsiveLayout: Story = {
  render: () => {
    const [narrowValues, setNarrowValues] = useState({
      scrollSpeed: 2,
      barDensity: 0.6,
      colorScheme: 'classic',
      showScanner: true
    })
    
    const [mediumValues, setMediumValues] = useState({
      scrollSpeed: 3,
      barDensity: 0.7,
      colorScheme: 'blue',
      showScanner: true
    })
    
    const [wideValues, setWideValues] = useState({
      scrollSpeed: 1.5,
      barDensity: 0.8,
      colorScheme: 'amber',
      showScanner: false
    })
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Responsive Grid Layouts</h3>
          <p className="text-sm text-muted-foreground">Control panel adapts based on sidebar width - try moving the sliders!</p>
        </div>
        
        <div className="grid gap-6">
          {/* Narrow sidebar */}
          <div>
            <h4 className="text-sm font-medium mb-2">Narrow Sidebar (300px) - Single Column</h4>
            <div className="border rounded p-4" style={{ width: '300px' }}>
              <SimulationControlsPanel
                patternId="barcode-generator"
                controls={mockBarcodeControls}
                currentValues={narrowValues}
                onControlChange={(controlId, value) => {
                  setNarrowValues(prev => ({ ...prev, [controlId]: value }))
                  console.log('Narrow panel control changed:', controlId, value)
                }}
                sidebarWidth={300}
              />
            </div>
          </div>
          
          {/* Medium sidebar */}
          <div>
            <h4 className="text-sm font-medium mb-2">Medium Sidebar (450px) - Two Columns</h4>
            <div className="border rounded p-4" style={{ width: '450px' }}>
              <SimulationControlsPanel
                patternId="barcode-generator"
                controls={mockBarcodeControls}
                currentValues={mediumValues}
                onControlChange={(controlId, value) => {
                  setMediumValues(prev => ({ ...prev, [controlId]: value }))
                  console.log('Medium panel control changed:', controlId, value)
                }}
                sidebarWidth={450}
              />
            </div>
          </div>
          
          {/* Wide sidebar */}
          <div>
            <h4 className="text-sm font-medium mb-2">Wide Sidebar (600px) - Three Columns</h4>
            <div className="border rounded p-4" style={{ width: '600px' }}>
              <SimulationControlsPanel
                patternId="barcode-generator"
                controls={mockBarcodeControls}
                currentValues={wideValues}
                onControlChange={(controlId, value) => {
                  setWideValues(prev => ({ ...prev, [controlId]: value }))
                  console.log('Wide panel control changed:', controlId, value)
                }}
                sidebarWidth={600}
              />
            </div>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the control panel layout adapts to different sidebar widths with responsive grid columns. Each panel has independent interactive controls.'
      }
    }
  }
}

// All control types showcase
export const AllControlTypes: Story = {
  render: () => {
    const [values, setValues] = useState({
      range1: 50,
      range2: 0.75,
      color1: '#ff6b35',
      select1: 'mode2',
      checkbox1: true,
      button1: false
    })
    
    const controls: PatternControl[] = [
      {
        id: 'range1',
        label: 'Integer Range',
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50
      },
      {
        id: 'range2',
        label: 'Decimal Range',
        type: 'range',
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.75
      },
      {
        id: 'color1',
        label: 'Primary Color',
        type: 'color',
        defaultValue: '#ff6b35'
      },
      {
        id: 'select1',
        label: 'Mode Selection',
        type: 'select',
        defaultValue: 'mode2',
        options: [
          { value: 'mode1', label: 'Mode 1' },
          { value: 'mode2', label: 'Mode 2' },
          { value: 'mode3', label: 'Mode 3' }
        ]
      },
      {
        id: 'checkbox1',
        label: 'Enable Feature',
        type: 'checkbox',
        defaultValue: true
      },
      {
        id: 'button1',
        label: 'RESET VALUES',
        type: 'button',
        defaultValue: false
      }
    ]
    
    return (
      <div className="space-y-4 max-w-lg">
        <SimulationControlsPanel
          patternId="comprehensive-pattern"
          controls={controls}
          currentValues={values}
          onControlChange={(controlId, value) => {
            setValues(prev => ({ ...prev, [controlId]: value }))
            console.log('Control changed:', controlId, value)
          }}
          sidebarWidth={500}
        />
        
        <div className="text-sm font-mono p-3 bg-muted/20 rounded">
          <div className="font-semibold mb-2">Current Values:</div>
          <div>Integer Range: <span className="text-accent-primary">{values.range1}</span></div>
          <div>Decimal Range: <span className="text-accent-primary">{values.range2.toFixed(2)}</span></div>
          <div>Color: <span className="text-accent-primary">{values.color1}</span></div>
          <div>Mode: <span className="text-accent-primary">{values.select1}</span></div>
          <div>Feature: <span className="text-accent-primary">{values.checkbox1.toString()}</span></div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive showcase of all supported control types: range (integer/decimal), color, select, checkbox, and button. Watch the values update in real-time!'
      }
    }
  }
}

// Edge cases and error states
export const EdgeCases: Story = {
  args: {
    patternId: 'edge-case-pattern',
    controls: [
      {
        id: 'extreme-range',
        label: 'Extreme Range',
        type: 'range',
        min: -1000,
        max: 1000,
        step: 0.001,
        defaultValue: -500.555
      },
      {
        id: 'empty-select',
        label: 'Empty Select',
        type: 'select',
        defaultValue: '',
        options: []
      },
      {
        id: 'long-label',
        label: 'Very Long Label That Might Cause Layout Issues',
        type: 'checkbox',
        defaultValue: false
      }
    ],
    currentValues: {
      'extreme-range': -500.555,
      'empty-select': '',
      'long-label': false
    },
    onControlChange: (controlId: string, value: number | string | boolean) => 
      console.log('Control changed:', controlId, value),
    sidebarWidth: 350
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests edge cases like extreme values, empty options, and long labels to ensure robust UI handling.'
      }
    }
  }
}