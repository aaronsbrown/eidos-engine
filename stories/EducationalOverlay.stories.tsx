import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import { EducationalOverlay, type OverlayType } from '@/components/ui/educational-overlay'
import { getEducationalContentSync } from '@/lib/educational-content-loader'
import { Button } from '@/components/ui/button'
import CellularAutomatonGenerator from '@/components/pattern-generators/cellular-automaton-generator'

const meta: Meta<typeof EducationalOverlay> = {
  title: 'Educational System/Educational Overlay Prototypes',
  component: EducationalOverlay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Educational overlay system prototypes for pattern visualizations. Three different UI approaches: Modal, Accordion, and Sidebar.'
      }
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// AIDEV-NOTE: Interactive prototype playground for comparing overlay approaches
export const PrototypePlayground: Story = {
  render: () => {
    const [overlayType, setOverlayType] = useState<OverlayType>('accordion')
    const [isVisible, setIsVisible] = useState(false)

    return (
      <div className="min-h-screen bg-gray-950 p-4">
        {/* Simulated pattern area */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4">
          <h2 className="text-yellow-400 font-mono mb-2">CELLULAR AUTOMATON PATTERN</h2>
          <div className="bg-black h-64 rounded border border-gray-700 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="mb-2">🔢 Pattern visualization would render here</div>
              <div className="text-sm">Rule 30 • Generation 127 • Cell Size: 2px</div>
            </div>
          </div>
        </div>

        {/* Control panel */}
        <div className="bg-gray-900 border border-yellow-400 rounded-lg p-4 mb-4">
          <h3 className="text-yellow-400 font-mono mb-4">EDUCATIONAL OVERLAY PROTOTYPES</h3>
          
          <div className="flex gap-4 mb-4">
            <Button
              variant={overlayType === 'accordion' ? 'default' : 'outline'}
              onClick={() => setOverlayType('accordion')}
            >
              Accordion Panel
            </Button>
            <Button
              variant={overlayType === 'sidebar' ? 'default' : 'outline'}
              onClick={() => setOverlayType('sidebar')}
            >
              Sidebar Panel
            </Button>
          </div>

          <Button
            variant="secondary"
            onClick={() => setIsVisible(true)}
            className="bg-yellow-400 text-black hover:bg-yellow-300"
          >
            🎓 Show Educational Content ({overlayType})
          </Button>
          
          <div className="mt-2 text-sm text-gray-400">
            {overlayType === 'accordion' && "✨ Accordion: Expands beneath pattern + horizontal tabs"}
            {overlayType === 'sidebar' && "✨ Sidebar: Vertical stacked levels + mobile responsive"}
          </div>
        </div>

        {/* Current overlay type indicator */}
        <div className="text-center text-gray-400 text-sm mb-4">
          Current prototype: <span className="text-yellow-400 font-mono uppercase">{overlayType}</span>
        </div>

        {/* Educational overlay */}
        <EducationalOverlay
          type={overlayType}
          content={getEducationalContentSync('cellular-automata')}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      </div>
    )
  }
}


export const AccordionOnly: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(false)

    return (
      <div className="min-h-screen bg-gray-950 p-4">
        {/* Simulated pattern with controls */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-yellow-400 font-mono">CELLULAR AUTOMATON</h2>
            <Button 
              onClick={() => setIsVisible(!isVisible)}
              variant={isVisible ? "outline" : "secondary"}
              className={!isVisible ? "bg-yellow-400 text-black hover:bg-yellow-300" : ""}
            >
              {isVisible ? '📚 Hide Learning' : '🎓 Let\'s Learn!'}
            </Button>
          </div>
          
          <div className="bg-black h-64 rounded border border-gray-700 flex items-center justify-center mb-4">
            <div className="text-gray-400 text-center">
              <div className="mb-2">🔢 Cellular Automata Pattern</div>
              <div className="text-sm">Rule 30 • Generation 127 • Cell Size: 2px</div>
            </div>
          </div>

          {/* Simulated controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm font-mono">RULE</label>
              <div className="bg-gray-700 rounded px-2 py-1 text-yellow-400 font-mono">30</div>
            </div>
            <div>
              <label className="text-gray-400 text-sm font-mono">CELL SIZE</label>
              <div className="bg-gray-700 rounded px-2 py-1 text-yellow-400 font-mono">2px</div>
            </div>
          </div>
        </div>
        
        <EducationalOverlay
          type="accordion"
          content={getEducationalContentSync('cellular-automata')}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      </div>
    )
  }
}

export const SidebarOnly: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(false)

    return (
      <div className="min-h-screen bg-gray-950 p-4">
        {/* Main content area that would be partially covered by sidebar */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mr-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-yellow-400 font-mono">CELLULAR AUTOMATON</h2>
            <Button 
              onClick={() => setIsVisible(true)}
              variant="secondary"
              className="bg-yellow-400 text-black hover:bg-yellow-300"
            >
              🎓 Learn More
            </Button>
          </div>
          
          <div className="bg-black h-80 rounded border border-gray-700 flex items-center justify-center mb-4">
            <div className="text-gray-400 text-center">
              <div className="mb-2">🔢 Cellular Automata Pattern</div>
              <div className="text-sm">Rule 30 • Generation 127 • Cell Size: 2px</div>
            </div>
          </div>

          {/* Simulated controls grid */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400 text-sm font-mono">RULE</label>
              <div className="bg-gray-700 rounded px-2 py-1 text-yellow-400 font-mono">30</div>
            </div>
            <div>
              <label className="text-gray-400 text-sm font-mono">CELL SIZE</label>
              <div className="bg-gray-700 rounded px-2 py-1 text-yellow-400 font-mono">2px</div>
            </div>
            <div>
              <label className="text-gray-400 text-sm font-mono">SPEED</label>
              <div className="bg-gray-700 rounded px-2 py-1 text-yellow-400 font-mono">0.3</div>
            </div>
          </div>

          <div className="mt-4 text-gray-400 text-sm">
            💡 Sidebar demo: Pattern remains interactive while educational content is open
          </div>
        </div>
        
        <EducationalOverlay
          type="sidebar"
          content={getEducationalContentSync('cellular-automata')}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      </div>
    )
  }
}

// AIDEV-NOTE: Comprehensive playground with live CA pattern and responsive overlay selection
export const LivePatternPlayground: Story = {
  render: () => {
    const [isEducationalVisible, setIsEducationalVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    
    // Responsive sizing and mobile detection
    const [containerWidth, setContainerWidth] = useState(800)
    
    useEffect(() => {
      const checkSize = () => {
        setIsMobile(window.innerWidth < 768)
        // Calculate container width based on viewport, leaving padding
        const viewportWidth = window.innerWidth
        const availableWidth = Math.max(300, viewportWidth - 64) // 64px total padding
        setContainerWidth(Math.min(800, availableWidth))
      }
      checkSize()
      window.addEventListener('resize', checkSize)
      return () => window.removeEventListener('resize', checkSize)
    }, [])

    // CA control state
    const [controlValues, setControlValues] = useState({
      cellSize: 2,
      animationSpeed: 0.15,
      initialCondition: 'center',
      resetTrigger: 0,
      rulePrev: false,
      ruleNext: false
    })

    const [currentRule, setCurrentRule] = useState(30)

    const handleControlChange = (controlId: string, value: any) => {
      if (controlId === 'rule') {
        // CA component is telling us the rule changed
        setCurrentRule(value)
      } else if (controlId === 'rulePrev') {
        // CA component is resetting button state or user clicked prev
        setControlValues(prev => ({ ...prev, rulePrev: value }))
      } else if (controlId === 'ruleNext') {
        // CA component is resetting button state or user clicked next
        setControlValues(prev => ({ ...prev, ruleNext: value }))
      } else if (controlId === 'resetTrigger') {
        setControlValues(prev => ({ ...prev, resetTrigger: prev.resetTrigger + 1 }))
      } else {
        setControlValues(prev => ({ ...prev, [controlId]: value }))
      }
    }

    const overlayType: OverlayType = isMobile ? 'sidebar' : 'accordion'

    return (
      <div className="min-h-screen bg-gray-950 p-4">
        {/* Pattern Display Area */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-yellow-400 font-mono text-lg">1D CELLULAR AUTOMATA</h2>
              <div className="text-gray-400 text-sm font-mono">
                Rule {currentRule} | {isMobile ? 'Mobile' : 'Desktop'} Layout
              </div>
            </div>
            <Button 
              onClick={() => setIsEducationalVisible(!isEducationalVisible)}
              variant={isEducationalVisible ? "outline" : "secondary"}
              className={!isEducationalVisible ? "bg-yellow-400 text-black hover:bg-yellow-300" : ""}
            >
              {isEducationalVisible ? '📚 Hide Learning' : '🎓 Let\'s Learn!'}
            </Button>
          </div>
          
          {/* Live CA Pattern - Responsive */}
          <div className="border border-gray-700 rounded overflow-hidden">
            <div className="w-full bg-black flex items-center justify-center">
              <CellularAutomatonGenerator
                width={containerWidth}
                height={Math.floor(containerWidth / 2)}
                controlValues={controlValues}
                onControlChange={handleControlChange}
                className="max-w-full"
              />
            </div>
          </div>

          {/* Working Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="text-gray-400 text-sm font-mono block mb-1">CELL SIZE</label>
              <input
                type="range"
                min="1"
                max="8"
                value={controlValues.cellSize}
                onChange={(e) => handleControlChange('cellSize', parseInt(e.target.value))}
                className="w-full accent-yellow-400"
              />
              <div className="text-yellow-400 font-mono text-sm">{controlValues.cellSize}px</div>
            </div>
            
            <div>
              <label className="text-gray-400 text-sm font-mono block mb-1">SPEED</label>
              <input
                type="range"
                min="0.02"
                max="0.5"
                step="0.02"
                value={controlValues.animationSpeed}
                onChange={(e) => handleControlChange('animationSpeed', parseFloat(e.target.value))}
                className="w-full accent-yellow-400"
              />
              <div className="text-yellow-400 font-mono text-sm">{controlValues.animationSpeed.toFixed(2)}</div>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-mono block mb-1">INITIAL</label>
              <select
                value={controlValues.initialCondition}
                onChange={(e) => handleControlChange('initialCondition', e.target.value)}
                className="w-full bg-gray-700 text-yellow-400 font-mono text-sm rounded px-2 py-1"
              >
                <option value="single">SINGLE_LEFT</option>
                <option value="center">SINGLE_CENTER</option>
                <option value="random">RANDOM_SEED</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-mono block mb-1">RULE {currentRule}</label>
              <div className="flex gap-1 mb-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Trigger the button press by toggling the state
                    setControlValues(prev => ({ ...prev, rulePrev: true }))
                  }}
                  className="text-xs flex-1"
                  disabled={currentRule <= 0}
                >
                  ← PREV
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Trigger the button press by toggling the state
                    setControlValues(prev => ({ ...prev, ruleNext: true }))
                  }}
                  className="text-xs flex-1"
                  disabled={currentRule >= 255}
                >
                  NEXT →
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleControlChange('resetTrigger', Date.now())}
                className="text-xs w-full"
              >
                RESET
              </Button>
            </div>
          </div>

          <div className="mt-3 text-center text-gray-400 text-sm">
            💡 Live Demo: Adjust controls while reading educational content • {isMobile ? 'Sidebar overlay' : 'Accordion expansion'} based on screen size
          </div>
        </div>
        
        {/* Responsive Educational Overlay */}
        <EducationalOverlay
          type={overlayType}
          content={getEducationalContentSync('cellular-automata')}
          isVisible={isEducationalVisible}
          onClose={() => setIsEducationalVisible(false)}
        />
      </div>
    )
  }
}