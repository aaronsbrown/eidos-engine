import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import MobileHeader from '@/components/mobile/mobile-header'
import type { MobileHeaderProps } from '@/components/mobile/mobile-header'

const meta: Meta<typeof MobileHeader> = {
  title: 'Mobile Components/Mobile Header',
  component: MobileHeader,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
      },
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        component: 'Mobile-optimized header with technical aesthetic. Features pattern counter, minimal design, and touch-friendly 44px button targets.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Main header title'
    },
    patternCount: {
      control: false,
      description: 'Current and total pattern count for counter display'
    },
    onMenuToggle: { 
      action: 'menu toggle',
      description: 'Callback when menu button is clicked'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// Default mobile header
export const Default: Story = {
  args: {
    title: 'PATTERN GENERATOR',
    patternCount: { current: 3, total: 9 },
    onMenuToggle: () => console.log('Menu toggled')
  }
}

// Long title truncation
export const LongTitle: Story = {
  args: {
    title: 'VERY LONG PATTERN GENERATOR TITLE THAT SHOULD TRUNCATE',
    patternCount: { current: 1, total: 5 },
    onMenuToggle: () => console.log('Menu toggled')
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests title truncation behavior when the title is too long for the available space.'
      }
    }
  }
}

// Empty title fallback
export const EmptyTitle: Story = {
  args: {
    title: '',
    patternCount: { current: 2, total: 7 },
    onMenuToggle: () => console.log('Menu toggled')
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows fallback behavior when no title is provided - displays default "PATTERN GENERATOR".'
      }
    }
  }
}

// Pattern counter variations
export const CounterVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Pattern Counter Variations</h3>
        <p className="text-sm text-muted-foreground">
          Different counter states with zero-padding
        </p>
      </div>
      
      <div className="space-y-2">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Single digits</div>
          <MobileHeader
            title="PATTERN GENERATOR"
            patternCount={{ current: 3, total: 9 }}
            onMenuToggle={() => console.log('Menu toggled - single digits')}
          />
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1">Double digits</div>
          <MobileHeader
            title="PATTERN GENERATOR"
            patternCount={{ current: 15, total: 23 }}
            onMenuToggle={() => console.log('Menu toggled - double digits')}
          />
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1">First pattern</div>
          <MobileHeader
            title="PATTERN GENERATOR"
            patternCount={{ current: 1, total: 12 }}
            onMenuToggle={() => console.log('Menu toggled - first')}
          />
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1">Last pattern</div>
          <MobileHeader
            title="PATTERN GENERATOR"
            patternCount={{ current: 8, total: 8 }}
            onMenuToggle={() => console.log('Menu toggled - last')}
          />
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1">Zero state (handled gracefully)</div>
          <MobileHeader
            title="PATTERN GENERATOR"
            patternCount={{ current: 0, total: 0 }}
            onMenuToggle={() => console.log('Menu toggled - zero state')}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various pattern counter states demonstrating zero-padding and edge cases.'
      }
    }
  }
}

// Interactive menu toggle
export const InteractiveMenu: Story = {
  render: () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [toggleCount, setToggleCount] = useState(0)
    
    const handleMenuToggle = () => {
      setMenuOpen(!menuOpen)
      setToggleCount(prev => prev + 1)
      console.log('Menu toggled - count:', toggleCount + 1)
    }
    
    return (
      <div className="space-y-4">
        <MobileHeader
          title="INTERACTIVE DEMO"
          patternCount={{ current: 4, total: 10 }}
          onMenuToggle={handleMenuToggle}
        />
        
        <div className="p-4 bg-muted/20 rounded font-mono text-sm">
          <div>Menu state: <span className="text-accent-primary">{menuOpen ? 'OPEN' : 'CLOSED'}</span></div>
          <div>Toggle count: <span className="text-accent-primary">{toggleCount}</span></div>
          <div className="text-xs text-muted-foreground mt-2">
            Click the menu button to see state changes
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing menu toggle state management and click tracking.'
      }
    }
  }
}

// Responsive behavior across viewports
export const ResponsiveDemo: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Responsive Behavior</h3>
        <p className="text-sm text-muted-foreground">
          Header adapts to different screen sizes
        </p>
      </div>
      
      <MobileHeader
        title="RESPONSIVE PATTERN GENERATOR"
        patternCount={{ current: 7, total: 15 }}
        onMenuToggle={() => console.log('Responsive menu toggle')}
      />
      
      <div className="text-xs font-mono space-y-2 p-4 bg-muted/20 rounded">
        <h4 className="font-semibold">Responsive Features:</h4>
        <ul className="space-y-1">
          <li>• Typography scales: mobile-typography-small for counter</li>
          <li>• Title text scales: text-sm md:text-base</li>
          <li>• Consistent 44px touch targets on mobile</li>
          <li>• Backdrop blur for depth and layering</li>
          <li>• Fixed 48px height for predictable layout</li>
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
        story: 'Demonstrates responsive typography and layout adjustments across different viewport sizes.'
      }
    }
  }
}

// Accessibility and touch targets
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-6">
      <MobileHeader
        title="ACCESSIBILITY DEMO"
        patternCount={{ current: 2, total: 6 }}
        onMenuToggle={() => console.log('Accessible menu toggle')}
      />
      
      <div className="text-sm space-y-4 p-4 bg-muted/20 rounded">
        <h4 className="font-semibold">Accessibility Features:</h4>
        
        <div>
          <h5 className="font-medium">Touch Targets:</h5>
          <ul className="list-disc list-inside text-xs mt-1 space-y-1">
            <li>Menu button: 44px minimum size (iOS/Android guidelines)</li>
            <li>Proper spacing to prevent accidental taps</li>
            <li>Visual feedback on hover/press states</li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium">Semantic HTML:</h5>
          <ul className="list-disc list-inside text-xs mt-1 space-y-1">
            <li><code>&lt;header&gt;</code> element for page structure</li>
            <li><code>&lt;h1&gt;</code> for main page title</li>
            <li><code>aria-label</code> on pattern counter</li>
            <li><code>aria-label</code> on menu button</li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium">Keyboard Support:</h5>
          <ul className="list-disc list-inside text-xs mt-1 space-y-1">
            <li>Tab navigation to menu button</li>
            <li>Space/Enter to activate menu</li>
            <li>Focus indicators visible</li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium">Technical Details:</h5>
          <ul className="list-disc list-inside text-xs mt-1 space-y-1">
            <li>Z-index management for layering</li>
            <li>Backdrop blur for visual depth</li>
            <li>Monospace font for technical aesthetic</li>
            <li>Zero-padded counter format (01/09)</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive accessibility features including touch targets, semantic HTML, and keyboard navigation.'
      }
    }
  }
}

// Edge cases and error states
export const EdgeCases: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Edge Cases</h3>
        <p className="text-sm text-muted-foreground">
          Testing unusual states and error conditions
        </p>
      </div>
      
      <div className="space-y-2">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Negative numbers (clamped to 0)</div>
          <MobileHeader
            title="NEGATIVE TEST"
            patternCount={{ current: -5, total: -2 }}
            onMenuToggle={() => console.log('Negative numbers')}
          />
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1">Large numbers</div>
          <MobileHeader
            title="LARGE NUMBERS"
            patternCount={{ current: 999, total: 1000 }}
            onMenuToggle={() => console.log('Large numbers')}
          />
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1">Current &gt; Total</div>
          <MobileHeader
            title="INVALID STATE"
            patternCount={{ current: 8, total: 5 }}
            onMenuToggle={() => console.log('Invalid state')}
          />
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1">Special characters in title</div>
          <MobileHeader
            title="SPECIAL_CHARS@#$%^&*()"
            patternCount={{ current: 1, total: 1 }}
            onMenuToggle={() => console.log('Special characters')}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Edge cases including negative numbers, large values, invalid states, and special characters.'
      }
    }
  }
}

// Layout in different contexts
export const LayoutContexts: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Layout Contexts</h3>
        <p className="text-sm text-muted-foreground">
          Header in different container contexts
        </p>
      </div>
      
      {/* Narrow container */}
      <div>
        <h4 className="text-sm font-medium mb-2">Narrow Container (250px)</h4>
        <div className="border rounded overflow-hidden" style={{ width: '250px' }}>
          <MobileHeader
            title="NARROW LAYOUT"
            patternCount={{ current: 1, total: 3 }}
            onMenuToggle={() => console.log('Narrow container')}
          />
        </div>
      </div>
      
      {/* Medium container */}
      <div>
        <h4 className="text-sm font-medium mb-2">Medium Container (400px)</h4>
        <div className="border rounded overflow-hidden" style={{ width: '400px' }}>
          <MobileHeader
            title="MEDIUM LAYOUT TEST"
            patternCount={{ current: 5, total: 12 }}
            onMenuToggle={() => console.log('Medium container')}
          />
        </div>
      </div>
      
      {/* Wide container */}
      <div>
        <h4 className="text-sm font-medium mb-2">Wide Container (600px)</h4>
        <div className="border rounded overflow-hidden" style={{ width: '600px' }}>
          <MobileHeader
            title="WIDE LAYOUT WITH MORE SPACE"
            patternCount={{ current: 8, total: 15 }}
            onMenuToggle={() => console.log('Wide container')}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tests header layout behavior in containers of different widths to ensure responsive text handling.'
      }
    }
  }
}