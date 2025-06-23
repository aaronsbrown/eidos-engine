import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import CollapsibleControlGroup from '@/components/ui/collapsible-control-group'
import type { PatternControl } from '@/components/pattern-generators/types'

// Mock control configurations for testing
const mockBasicControls: PatternControl[] = [
  {
    id: 'speed',
    label: 'Animation Speed',
    type: 'range',
    min: 0.1,
    max: 5,
    step: 0.1,
    defaultValue: 2
  },
  {
    id: 'size',
    label: 'Element Size',
    type: 'range',
    min: 1,
    max: 20,
    step: 1,
    defaultValue: 8
  },
  {
    id: 'enabled',
    label: 'Enable Animation',
    type: 'checkbox',
    defaultValue: true
  }
]

const mockAdvancedControls: PatternControl[] = [
  {
    id: 'complexity',
    label: 'Complexity Level',
    type: 'range',
    min: 1,
    max: 10,
    step: 1,
    defaultValue: 5
  },
  {
    id: 'mode',
    label: 'Render Mode',
    type: 'select',
    defaultValue: 'smooth',
    options: [
      { value: 'smooth', label: 'Smooth' },
      { value: 'pixelated', label: 'Pixelated' },
      { value: 'wireframe', label: 'Wireframe' }
    ]
  },
  {
    id: 'primaryColor',
    label: 'Primary Color',
    type: 'color',
    defaultValue: '#ff6b35'
  },
  {
    id: 'secondaryColor',
    label: 'Secondary Color',
    type: 'color',
    defaultValue: '#3b82f6'
  },
  {
    id: 'reset',
    label: 'RESET PARAMETERS',
    type: 'button',
    defaultValue: false
  }
]

const mockColorControls: PatternControl[] = [
  {
    id: 'hue',
    label: 'Hue Shift',
    type: 'range',
    min: 0,
    max: 360,
    step: 1,
    defaultValue: 180
  },
  {
    id: 'saturation',
    label: 'Saturation',
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 75
  },
  {
    id: 'brightness',
    label: 'Brightness',
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50
  },
  {
    id: 'autoRotate',
    label: 'Auto Rotate Hue',
    type: 'checkbox',
    defaultValue: false
  }
]

const meta: Meta<typeof CollapsibleControlGroup> = {
  title: 'UI Components/Collapsible Control Group',
  component: CollapsibleControlGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Accessible collapsible control group with smooth animations, keyboard navigation, and ARIA support. Organizes related controls with expand/collapse functionality.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Group title displayed in the header'
    },
    controls: {
      control: false,
      description: 'Array of controls to render in the group'
    },
    controlValues: {
      control: false,
      description: 'Current values for all controls'
    },
    onControlChange: { 
      action: 'control changed',
      description: 'Callback when any control value changes'
    },
    defaultCollapsed: {
      control: { type: 'boolean' },
      description: 'Whether the group starts collapsed'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// Default expanded state
export const Default: Story = {
  render: () => {
    const [values, setValues] = useState({
      speed: 2,
      size: 8,
      enabled: true
    })
    
    return (
      <div className="space-y-4 max-w-md">
        <CollapsibleControlGroup
          title="Basic Controls"
          controls={mockBasicControls}
          controlValues={values}
          onControlChange={(controlId, value) => {
            setValues(prev => ({ ...prev, [controlId]: value }))
            console.log('Control changed:', controlId, value)
          }}
          defaultCollapsed={false}
        />
        
        <div className="text-sm font-mono p-3 bg-muted/20 rounded">
          <div className="font-semibold mb-2">Current Values:</div>
          <div>Speed: <span className="text-accent-primary">{values.speed}</span></div>
          <div>Size: <span className="text-accent-primary">{values.size}</span></div>
          <div>Enabled: <span className="text-accent-primary">{values.enabled.toString()}</span></div>
        </div>
      </div>
    )
  }
}

// Default collapsed state
export const Collapsed: Story = {
  args: {
    title: 'Advanced Settings',
    controls: mockAdvancedControls,
    controlValues: {
      complexity: 5,
      mode: 'smooth',
      primaryColor: '#ff6b35',
      secondaryColor: '#3b82f6',
      reset: false
    },
    onControlChange: (controlId: string, value: number | string | boolean) => 
      console.log('Control changed:', controlId, value),
    defaultCollapsed: true
  }
}

// Interactive state management
export const Interactive: Story = {
  render: () => {
    const [values, setValues] = useState({
      speed: 2,
      size: 8,
      enabled: true
    })
    
    const handleControlChange = (controlId: string, value: number | string | boolean) => {
      setValues(prev => ({ ...prev, [controlId]: value }))
      console.log('Control changed:', controlId, value)
    }
    
    return (
      <div className="space-y-4 max-w-md">
        <CollapsibleControlGroup
          title="Interactive Controls"
          controls={mockBasicControls}
          controlValues={values}
          onControlChange={handleControlChange}
          defaultCollapsed={false}
        />
        
        <div className="text-sm font-mono p-3 bg-muted/20 rounded">
          <div className="font-semibold mb-2">Current Values:</div>
          <div>Speed: <span className="text-accent-primary">{values.speed}</span></div>
          <div>Size: <span className="text-accent-primary">{values.size}</span></div>
          <div>Enabled: <span className="text-accent-primary">{values.enabled.toString()}</span></div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with real state management showing live value updates.'
      }
    }
  }
}

// Multiple groups
export const MultipleGroups: Story = {
  render: () => {
    const [basicValues, setBasicValues] = useState({
      speed: 2,
      size: 8,
      enabled: true
    })
    
    const [colorValues, setColorValues] = useState({
      hue: 180,
      saturation: 75,
      brightness: 50,
      autoRotate: false
    })
    
    const [advancedValues, setAdvancedValues] = useState({
      complexity: 5,
      mode: 'smooth',
      primaryColor: '#ff6b35',
      secondaryColor: '#3b82f6',
      reset: false
    })
    
    return (
      <div className="space-y-4 max-w-lg">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Multiple Control Groups</h3>
          <p className="text-sm text-muted-foreground">
            Organized settings with independent expand/collapse states
          </p>
        </div>
        
        <CollapsibleControlGroup
          title="Basic Settings"
          controls={mockBasicControls}
          controlValues={basicValues}
          onControlChange={(id, value) => setBasicValues(prev => ({ ...prev, [id]: value }))}
          defaultCollapsed={false}
        />
        
        <CollapsibleControlGroup
          title="Color Controls"
          controls={mockColorControls}
          controlValues={colorValues}
          onControlChange={(id, value) => setColorValues(prev => ({ ...prev, [id]: value }))}
          defaultCollapsed={true}
        />
        
        <CollapsibleControlGroup
          title="Advanced Settings"
          controls={mockAdvancedControls}
          controlValues={advancedValues}
          onControlChange={(id, value) => setAdvancedValues(prev => ({ ...prev, [id]: value }))}
          defaultCollapsed={true}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple collapsible groups demonstrating organization of different control categories with independent states.'
      }
    }
  }
}

// All control types showcase
export const AllControlTypes: Story = {
  args: {
    title: 'All Control Types',
    controls: [
      {
        id: 'integerRange',
        label: 'Integer Range',
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50
      },
      {
        id: 'decimalRange',
        label: 'Decimal Range',
        type: 'range',
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.75
      },
      {
        id: 'colorPicker',
        label: 'Color Selection',
        type: 'color',
        defaultValue: '#8b5cf6'
      },
      {
        id: 'dropdown',
        label: 'Dropdown Menu',
        type: 'select',
        defaultValue: 'option2',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' }
        ]
      },
      {
        id: 'toggle',
        label: 'Enable Feature',
        type: 'checkbox',
        defaultValue: true
      },
      {
        id: 'action',
        label: 'TRIGGER ACTION',
        type: 'button',
        defaultValue: false
      }
    ],
    controlValues: {
      integerRange: 50,
      decimalRange: 0.75,
      colorPicker: '#8b5cf6',
      dropdown: 'option2',
      toggle: true,
      action: false
    },
    onControlChange: (controlId: string, value: number | string | boolean) => 
      console.log('Control changed:', controlId, value),
    defaultCollapsed: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive showcase of all supported control types: range (integer/decimal), color, select, checkbox, and button.'
      }
    }
  }
}

// Accessibility demonstration
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Accessibility Features</h3>
        <p className="text-sm text-muted-foreground">
          Keyboard navigation, ARIA support, and focus management
        </p>
      </div>
      
      <CollapsibleControlGroup
        title="Accessible Control Group"
        controls={mockBasicControls}
        controlValues={{
          speed: 2,
          size: 8,
          enabled: true
        }}
        onControlChange={(controlId, value) => console.log('Control changed:', controlId, value)}
        defaultCollapsed={false}
      />
      
      <div className="text-sm space-y-4 p-4 bg-muted/20 rounded">
        <h4 className="font-semibold">Accessibility Features:</h4>
        
        <div>
          <h5 className="font-medium">Keyboard Navigation:</h5>
          <ul className="list-disc list-inside text-xs mt-1 space-y-1">
            <li>Tab to focus the header button</li>
            <li>Space or Enter to toggle expansion</li>
            <li>Tab through controls when expanded</li>
            <li>Escape to collapse (when focused inside)</li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium">ARIA Support:</h5>
          <ul className="list-disc list-inside text-xs mt-1 space-y-1">
            <li><code>aria-expanded</code> on header button</li>
            <li><code>aria-controls</code> linking to content</li>
            <li><code>role="region"</code> on collapsible area</li>
            <li><code>aria-labelledby</code> for content labeling</li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium">Visual Indicators:</h5>
          <ul className="list-disc list-inside text-xs mt-1 space-y-1">
            <li>Focus ring on interactive elements</li>
            <li>Smooth rotation animation on chevron</li>
            <li>Clear expand/collapse states</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates comprehensive accessibility features including keyboard navigation, ARIA attributes, and focus management.'
      }
    }
  }
}

// Empty state
export const EmptyState: Story = {
  args: {
    title: 'Empty Group',
    controls: [],
    controlValues: {},
    onControlChange: (controlId: string, value: number | string | boolean) => 
      console.log('Control changed:', controlId, value),
    defaultCollapsed: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the empty state when no controls are provided.'
      }
    }
  }
}

// Long title and content
export const LongContent: Story = {
  args: {
    title: 'Very Long Group Title That Might Cause Layout Issues',
    controls: [
      {
        id: 'control1',
        label: 'Control With Extremely Long Label That Tests Text Wrapping',
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50
      },
      {
        id: 'control2',
        label: 'Another Long Control Label',
        type: 'select',
        defaultValue: 'very-long-option-value',
        options: [
          { value: 'short', label: 'Short' },
          { value: 'medium-length-option', label: 'Medium Length Option' },
          { value: 'very-long-option-value', label: 'Very Long Option Value That Tests Dropdown Width' }
        ]
      }
    ],
    controlValues: {
      control1: 50,
      control2: 'very-long-option-value'
    },
    onControlChange: (controlId: string, value: number | string | boolean) => 
      console.log('Control changed:', controlId, value),
    defaultCollapsed: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests layout handling with long titles and control labels to ensure proper text wrapping and responsive behavior.'
      }
    }
  }
}