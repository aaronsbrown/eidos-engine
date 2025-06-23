import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import CustomSelect from '@/components/ui/custom-select'
import type { SelectOption } from '@/components/ui/custom-select'

// Mock option sets for testing
const basicOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
]

const colorSchemeOptions: SelectOption[] = [
  { value: 'classic', label: 'Classic' },
  { value: 'inverted', label: 'Inverted' },
  { value: 'blue', label: 'Blue' },
  { value: 'amber', label: 'Amber' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' }
]

const numericOptions: SelectOption[] = [
  { value: 1, label: 'Low (1)' },
  { value: 5, label: 'Medium (5)' },
  { value: 10, label: 'High (10)' },
  { value: 20, label: 'Maximum (20)' }
]

const longTextOptions: SelectOption[] = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium Length Option' },
  { value: 'long', label: 'Very Long Option Text That Might Cause Layout Issues' },
  { value: 'longer', label: 'Extremely Long Option Text That Definitely Will Test Text Wrapping And Overflow Behavior' }
]

const technicalOptions: SelectOption[] = [
  { value: 'webgl2', label: 'WebGL 2.0' },
  { value: 'canvas2d', label: 'Canvas 2D' },
  { value: 'svg', label: 'SVG' },
  { value: 'css3d', label: 'CSS 3D Transforms' },
  { value: 'threejs', label: 'Three.js' },
  { value: 'p5js', label: 'p5.js' }
]

const meta: Meta<typeof CustomSelect> = {
  title: 'UI Components/Custom Select',
  component: CustomSelect,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Native HTML select with custom styling and technical aesthetic. Features 44px touch targets, proper mobile behavior, and accessibility support.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'HTML id attribute for the select element'
    },
    value: {
      control: false,
      description: 'Currently selected value (string or number)'
    },
    options: {
      control: false,
      description: 'Array of option objects with value and label'
    },
    onChange: { 
      action: 'option selected',
      description: 'Callback when selection changes'
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text when no option is selected'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the select is disabled'
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// Default select
export const Default: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState<string | number>('option2')
    
    return (
      <div className="space-y-4 max-w-sm">
        <CustomSelect
          value={selectedValue}
          options={basicOptions}
          onChange={setSelectedValue}
          placeholder="Choose an option..."
        />
        
        <div className="text-sm font-mono p-3 bg-muted/20 rounded">
          <div>Selected: <span className="text-accent-primary">{selectedValue || 'None'}</span></div>
          <div>Type: <span className="text-accent-primary">{typeof selectedValue}</span></div>
        </div>
      </div>
    )
  }
}

// No selection state
export const NoSelection: Story = {
  args: {
    value: '',
    options: basicOptions,
    onChange: (value) => console.log('Selected:', value),
    placeholder: 'Select an option...'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the placeholder state when no option is selected.'
      }
    }
  }
}

// Interactive example with state management
export const Interactive: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState<string | number>('classic')
    
    return (
      <div className="space-y-4 max-w-sm">
        <CustomSelect
          value={selectedValue}
          options={colorSchemeOptions}
          onChange={setSelectedValue}
          placeholder="Choose color scheme..."
        />
        
        <div className="text-sm font-mono p-3 bg-muted/20 rounded">
          <div>Selected value: <span className="text-accent-primary">{selectedValue || 'None'}</span></div>
          <div>Type: <span className="text-accent-primary">{typeof selectedValue}</span></div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with real state management showing selected value and type.'
      }
    }
  }
}

// Numeric values
export const NumericValues: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState<string | number>(5)
    
    return (
      <div className="space-y-4 max-w-sm">
        <CustomSelect
          value={selectedValue}
          options={numericOptions}
          onChange={setSelectedValue}
          placeholder="Select level..."
        />
        
        <div className="text-sm font-mono p-3 bg-muted/20 rounded">
          <div>Selected value: <span className="text-accent-primary">{selectedValue}</span></div>
          <div>Type: <span className="text-accent-primary">{typeof selectedValue}</span></div>
          <div>Is number: <span className="text-accent-primary">{typeof selectedValue === 'number' ? 'Yes' : 'No'}</span></div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates handling of numeric option values with proper type conversion.'
      }
    }
  }
}

// Disabled state
export const Disabled: Story = {
  args: {
    value: 'option2',
    options: basicOptions,
    onChange: (value) => console.log('Selected:', value),
    placeholder: 'Select option...',
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the disabled state with reduced opacity and no interaction.'
      }
    }
  }
}

// Long text options
export const LongTextOptions: Story = {
  args: {
    value: 'medium',
    options: longTextOptions,
    onChange: (value) => console.log('Selected:', value),
    placeholder: 'Choose option...'
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests handling of options with very long text content to ensure proper layout.'
      }
    }
  }
}

// Technical options (real use case)
export const TechnicalOptions: Story = {
  render: () => {
    const [technology, setTechnology] = useState<string | number>('webgl2')
    
    return (
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">
            Rendering Technology
          </label>
          <CustomSelect
            id="technology-select"
            value={technology}
            options={technicalOptions}
            onChange={setTechnology}
            placeholder="Select rendering technology..."
          />
        </div>
        
        <div className="text-sm font-mono p-3 bg-muted/20 rounded">
          <div>Current technology: <span className="text-accent-primary">{technology}</span></div>
          <div className="text-xs text-muted-foreground mt-2">
            This mimics the pattern generator technology selection interface
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-world example showing technical option selection with proper labeling and feedback.'
      }
    }
  }
}

// Multiple selects in form layout
export const MultipleSelects: Story = {
  render: () => {
    const [formState, setFormState] = useState({
      colorScheme: 'classic',
      quality: 10,
      technology: 'webgl2'
    })
    
    const updateFormField = (field: string) => (value: string | number) => {
      setFormState(prev => ({ ...prev, [field]: value }))
    }
    
    return (
      <div className="space-y-6 max-w-md">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Form with Multiple Selects</h3>
          <p className="text-sm text-muted-foreground">
            Tests layout with multiple select components
          </p>
        </div>
        
        <div className="grid gap-4">
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">
              Color Scheme
            </label>
            <CustomSelect
              value={formState.colorScheme}
              options={colorSchemeOptions}
              onChange={updateFormField('colorScheme')}
              placeholder="Choose color scheme..."
            />
          </div>
          
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">
              Quality Level
            </label>
            <CustomSelect
              value={formState.quality}
              options={numericOptions}
              onChange={updateFormField('quality')}
              placeholder="Select quality..."
            />
          </div>
          
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">
              Technology
            </label>
            <CustomSelect
              value={formState.technology}
              options={technicalOptions}
              onChange={updateFormField('technology')}
              placeholder="Choose technology..."
            />
          </div>
        </div>
        
        <div className="text-sm font-mono p-3 bg-muted/20 rounded">
          <div className="font-semibold mb-2">Form State:</div>
          <div>Color: <span className="text-accent-primary">{formState.colorScheme}</span></div>
          <div>Quality: <span className="text-accent-primary">{formState.quality}</span></div>
          <div>Tech: <span className="text-accent-primary">{formState.technology}</span></div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple select components in a form layout showing real-world usage patterns.'
      }
    }
  }
}

// Empty options state
export const EmptyOptions: Story = {
  args: {
    value: '',
    options: [],
    onChange: (value) => console.log('Selected:', value),
    placeholder: 'No options available'
  },
  parameters: {
    docs: {
      description: {
        story: 'Edge case with no options available - shows placeholder only.'
      }
    }
  }
}

// Responsive behavior
export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Responsive Layout</h3>
        <p className="text-sm text-muted-foreground">
          Select adapts to different container widths
        </p>
      </div>
      
      {/* Narrow container */}
      <div>
        <h4 className="text-sm font-medium mb-2">Narrow Container (200px)</h4>
        <div className="border rounded p-3" style={{ width: '200px' }}>
          <CustomSelect
            value="classic"
            options={colorSchemeOptions}
            onChange={(value) => console.log('Narrow:', value)}
            placeholder="Choose..."
          />
        </div>
      </div>
      
      {/* Medium container */}
      <div>
        <h4 className="text-sm font-medium mb-2">Medium Container (350px)</h4>
        <div className="border rounded p-3" style={{ width: '350px' }}>
          <CustomSelect
            value="medium"
            options={longTextOptions}
            onChange={(value) => console.log('Medium:', value)}
            placeholder="Select option..."
          />
        </div>
      </div>
      
      {/* Wide container */}
      <div>
        <h4 className="text-sm font-medium mb-2">Wide Container (500px)</h4>
        <div className="border rounded p-3" style={{ width: '500px' }}>
          <CustomSelect
            value="webgl2"
            options={technicalOptions}
            onChange={(value) => console.log('Wide:', value)}
            placeholder="Choose rendering technology..."
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tests responsive behavior in containers of different widths.'
      }
    }
  }
}

// Mobile touch behavior
export const MobileTouchDemo: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Mobile Touch Optimization</h3>
        <p className="text-sm text-muted-foreground">
          44px minimum touch targets for mobile accessibility
        </p>
      </div>
      
      <CustomSelect
        value="classic"
        options={colorSchemeOptions}
        onChange={(value) => console.log('Mobile touch:', value)}
        placeholder="Touch-friendly select..."
      />
      
      <div className="text-sm space-y-2 p-4 bg-muted/20 rounded">
        <h4 className="font-semibold">Mobile Features:</h4>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li>Minimum 44px height for touch targets</li>
          <li>Native HTML select for proper mobile overlay</li>
          <li>touch-manipulation CSS for responsive touch</li>
          <li>Proper focus states for keyboard navigation</li>
          <li>Monospace font for technical aesthetic</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile'
    },
    docs: {
      description: {
        story: 'Optimized for mobile touch interaction with proper touch targets and native behavior.'
      }
    }
  }
}