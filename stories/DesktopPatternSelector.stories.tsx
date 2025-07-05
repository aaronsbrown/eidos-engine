// AIDEV-NOTE: Storybook stories for testing different desktop pattern selector approaches
// Explores ScrollArea + accordion vs simple scroll vs current pagination
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DesktopPatternSelector } from '@/components/desktop/desktop-pattern-selector'

const meta: Meta<typeof DesktopPatternSelector> = {
  title: 'Desktop/Pattern Selector Experiments',
  component: DesktopPatternSelector,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Experimental desktop pattern selector component testing different UX approaches to replace the current pagination system. The goal is to find a solution that eliminates height calculation issues while providing better UX.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['accordion', 'simple-scroll', 'pagination-current'],
      description: 'Different UX approaches to test'
    },
    selectedPatternId: {
      control: { type: 'text' },
      description: 'Currently selected pattern ID'
    }
  }
}

export default meta
type Story = StoryObj<typeof DesktopPatternSelector>

// Interactive story with state management
export const AccordionApproach: Story = {
  render: () => {
    const [selectedPatternId, setSelectedPatternId] = useState('lorenz-attractor')
    
    return (
      <div className="w-64 h-96 border border-border bg-background">
        <DesktopPatternSelector
          selectedPatternId={selectedPatternId}
          onPatternSelect={setSelectedPatternId}
          variant="accordion"
          className="h-full p-4"
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Category-based accordion approach. Each category can be expanded/collapsed. Uses ScrollArea for natural overflow handling. No height calculations needed.'
      }
    }
  }
}

export const SimpleScrollApproach: Story = {
  render: () => {
    const [selectedPatternId, setSelectedPatternId] = useState('thomas-attractor')
    
    return (
      <div className="w-64 h-96 border border-border bg-background">
        <DesktopPatternSelector
          selectedPatternId={selectedPatternId}
          onPatternSelect={setSelectedPatternId}
          variant="simple-scroll"
          className="h-full p-4"
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple scrollable list with category dividers. All patterns visible, organized by category. Uses ScrollArea for smooth scrolling.'
      }
    }
  }
}

export const CurrentPaginationApproach: Story = {
  render: () => {
    const [selectedPatternId, setSelectedPatternId] = useState('aizawa-attractor')
    
    return (
      <div className="w-64 h-96 border border-border bg-background">
        <DesktopPatternSelector
          selectedPatternId={selectedPatternId}
          onPatternSelect={setSelectedPatternId}
          variant="pagination-current"
          className="h-full p-4"
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Simplified version of current pagination approach for comparison. Shows only 5 patterns with limited navigation.'
      }
    }
  }
}

// Side-by-side comparison
export const Comparison: Story = {
  render: () => {
    const [selectedPatternId, setSelectedPatternId] = useState('noise-field')
    
    return (
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-sm font-mono uppercase tracking-wider">Accordion Approach</h3>
          <div className="w-64 h-96 border border-border bg-background">
            <DesktopPatternSelector
              selectedPatternId={selectedPatternId}
              onPatternSelect={setSelectedPatternId}
              variant="accordion"
              className="h-full p-4"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-sm font-mono uppercase tracking-wider">Simple Scroll</h3>
          <div className="w-64 h-96 border border-border bg-background">
            <DesktopPatternSelector
              selectedPatternId={selectedPatternId}
              onPatternSelect={setSelectedPatternId}
              variant="simple-scroll"
              className="h-full p-4"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-sm font-mono uppercase tracking-wider">Current Pagination</h3>
          <div className="w-64 h-96 border border-border bg-background">
            <DesktopPatternSelector
              selectedPatternId={selectedPatternId}
              onPatternSelect={setSelectedPatternId}
              variant="pagination-current"
              className="h-full p-4"
            />
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of all three approaches. Notice how the accordion and simple scroll approaches show more patterns and eliminate the need for height calculations.'
      }
    }
  }
}

// Test with different container heights
export const ResponsiveHeight: Story = {
  render: () => {
    const [selectedPatternId, setSelectedPatternId] = useState('cellular-automaton')
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-sm font-mono uppercase tracking-wider">Short Container (200px)</h3>
          <div className="w-64 h-48 border border-border bg-background">
            <DesktopPatternSelector
              selectedPatternId={selectedPatternId}
              onPatternSelect={setSelectedPatternId}
              variant="simple-scroll"
              className="h-full p-4"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-sm font-mono uppercase tracking-wider">Tall Container (600px)</h3>
          <div className="w-64 h-[600px] border border-border bg-background">
            <DesktopPatternSelector
              selectedPatternId={selectedPatternId}
              onPatternSelect={setSelectedPatternId}
              variant="accordion"
              className="h-full p-4"
            />
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing how the ScrollArea approach adapts to different container heights. Notice how it gracefully handles both constrained and generous space.'
      }
    }
  }
}

// Clean pattern cards (no numbers, no duplicate IDs)
export const CleanPatternCards: Story = {
  render: () => {
    const [selectedPatternId, setSelectedPatternId] = useState('four-pole-gradient')
    
    return (
      <div className="w-64 h-96 border border-border bg-background">
        <DesktopPatternSelector
          selectedPatternId={selectedPatternId}
          onPatternSelect={setSelectedPatternId}
          variant="simple-scroll"
          className="h-full p-4"
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus on the cleaned-up pattern cards: removed pattern numbers and duplicate IDs as suggested. Cleaner, more focused interface.'
      }
    }
  }
}