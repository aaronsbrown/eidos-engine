"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { patternGenerators } from "@/components/pattern-generators"

export default function PatternGeneratorShowcase() {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(patternGenerators[0].id)
  const [dimensions, setDimensions] = useState({ width: 534, height: 300 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlValues, setControlValues] = useState<Record<string, Record<string, number | string | boolean>>>({})

  const selectedPattern = patternGenerators.find(p => p.id === selectedPatternId) || patternGenerators[0]
  const PatternComponent = selectedPattern.component

  // Initialize default control values for patterns that have controls
  const initializeControlValues = (patternId: string) => {
    const pattern = patternGenerators.find(p => p.id === patternId)
    if (!pattern?.controls) return {}
    
    const defaults: Record<string, number | string | boolean> = {}
    pattern.controls.forEach(control => {
      defaults[control.id] = control.defaultValue
    })
    return defaults
  }

  // Get current control values for the selected pattern
  const getCurrentControlValues = () => {
    if (!controlValues[selectedPatternId]) {
      const defaults = initializeControlValues(selectedPatternId)
      setControlValues(prev => ({ ...prev, [selectedPatternId]: defaults }))
      return defaults
    }
    return controlValues[selectedPatternId]
  }

  // Handle control changes
  const handleControlChange = (controlId: string, value: number | string | boolean) => {
    setControlValues(prev => ({
      ...prev,
      [selectedPatternId]: {
        ...prev[selectedPatternId],
        [controlId]: value
      }
    }))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      setDimensions({ width: window.innerWidth - 40, height: window.innerHeight - 120 })
    } else {
      setDimensions({ width: 534, height: 300 })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Technical Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Header */}
      <header className="relative border-b border-gray-300 p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-3 h-3 bg-yellow-400 border border-gray-400"></div>
            <h1 className="text-xl font-mono tracking-wider uppercase">Pattern Generator System</h1>
            <div className="text-xs font-mono text-gray-500 bg-white border border-gray-300 px-2 py-1">
              v1.0.0
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="text-xs font-mono text-muted-foreground border border-border px-2 py-1 bg-background">
              [{String(patternGenerators.findIndex(p => p.id === selectedPatternId) + 1).padStart(2, '0')}/{String(patternGenerators.length).padStart(2, '0')}]
            </div>
            <Button 
              onClick={toggleFullscreen}
              variant="outline" 
              size="sm"
              className="font-mono text-xs border-gray-400 hover:border-yellow-400 hover:bg-yellow-50"
            >
              {isFullscreen ? "EXIT_FULLSCREEN" : "FULLSCREEN"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Left Sidebar - Pattern Selection & Specifications */}
        <aside className="w-64 border-r border-border p-6 bg-background/50 backdrop-blur-sm space-y-6">
          {/* Pattern Selection */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400"></div>
              <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Pattern Selection</h2>
            </div>
            <div className="space-y-1">
              {patternGenerators.map((pattern, index) => (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedPatternId(pattern.id)}
                  className={`w-full text-left p-3 border transition-all font-mono text-xs ${
                    selectedPatternId === pattern.id
                      ? "bg-yellow-100 dark:bg-yellow-950/30 border-yellow-400 text-foreground"
                      : "bg-background border-border hover:border-muted-foreground text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="uppercase tracking-wider">{pattern.name}</span>
                    <span className="text-muted-foreground/60">{(index + 1).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="text-muted-foreground/80 mt-1">{pattern.id}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Specifications */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400"></div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Specifications</h3>
            </div>
            <div className="border border-border p-3 bg-background space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">TYPE:</span>
                <span className="text-foreground uppercase">{selectedPattern.id}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">SIZE:</span>
                <span className="text-foreground">{dimensions.width} × {dimensions.height}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">TECHNOLOGY:</span>
                <span className="text-foreground uppercase">
                  {selectedPattern.id === 'brownian-motion' ? 'WEBGL_2.0' : 'CANVAS_2D'}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">FPS:</span>
                <span className="text-foreground">60</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">STATUS:</span>
                <span className="text-green-600 dark:text-green-400">ACTIVE</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Pattern Display */}
        <main className="flex-1 p-6 relative">
          {/* Technical annotation boxes */}
          <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground space-y-1">
            <div className="border border-border bg-background px-2 py-1">VIEWPORT_01</div>
          </div>
          <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground space-y-1">
            <div className="border border-border bg-background px-2 py-1">REAL_TIME</div>
          </div>

          <div className="flex flex-col items-center justify-center min-h-full">

            {/* Pattern Container with technical frame */}
            <div className="relative">
              {/* Corner markers */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-400"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-yellow-400"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-yellow-400"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-400"></div>
              

              <div 
                className="border-2 border-border bg-background shadow-lg"
                style={{ 
                  width: dimensions.width, 
                  height: dimensions.height 
                }}
              >
                <PatternComponent 
                  width={dimensions.width} 
                  height={dimensions.height}
                  className="w-full h-full"
                  controls={selectedPattern.controls}
                  controlValues={getCurrentControlValues()}
                  onControlChange={handleControlChange}
                />
              </div>
            </div>

            {/* Pattern Navigation with technical styling */}
            <div className="flex items-center space-x-6 mt-12">
              <Button
                onClick={() => {
                  const currentIndex = patternGenerators.findIndex(p => p.id === selectedPatternId)
                  const prevIndex = currentIndex === 0 ? patternGenerators.length - 1 : currentIndex - 1
                  setSelectedPatternId(patternGenerators[prevIndex].id)
                }}
                variant="outline"
                size="sm"
                className="font-mono text-xs border-border hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
              >
                ← PREV
              </Button>
              
              <div className="text-xs font-mono text-muted-foreground border border-border bg-background px-3 py-2">
                {(patternGenerators.findIndex(p => p.id === selectedPatternId) + 1).toString().padStart(2, '0')} / {patternGenerators.length.toString().padStart(2, '0')}
              </div>
              
              <Button
                onClick={() => {
                  const currentIndex = patternGenerators.findIndex(p => p.id === selectedPatternId)
                  const nextIndex = currentIndex === patternGenerators.length - 1 ? 0 : currentIndex + 1
                  setSelectedPatternId(patternGenerators[nextIndex].id)
                }}
                variant="outline"
                size="sm"
                className="font-mono text-xs border-border hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
              >
                NEXT →
              </Button>
            </div>
          </div>

          {/* Bottom technical annotations */}
          <div className="absolute bottom-4 left-4 text-xs font-mono text-muted-foreground">
            <div className="border border-border bg-background px-2 py-1">PATTERN_GENERATOR_SYSTEM_v1.0</div>
          </div>
          <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground">
            <div className="border border-border bg-background px-2 py-1">
              {new Date().toISOString().split('T')[0]}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Viewport & Simulation Parameters */}
        <aside className="w-80 border-l border-border p-6 space-y-6 bg-background/50 backdrop-blur-sm">
          {/* Viewport Controls */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400"></div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Viewport</h3>
            </div>
            <div className="space-y-4">
              <div className="border border-border p-3 bg-background">
                <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">Width</label>
                <input
                  type="range"
                  min="320"
                  max="1280"
                  value={dimensions.width}
                  onChange={(e) => setDimensions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                  className="w-full accent-yellow-400"
                />
                <div className="text-xs font-mono text-muted-foreground mt-1 text-right">{dimensions.width}px</div>
              </div>
              <div className="border border-border p-3 bg-background">
                <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">Height</label>
                <input
                  type="range"
                  min="180"
                  max="720"
                  value={dimensions.height}
                  onChange={(e) => setDimensions(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                  className="w-full accent-yellow-400"
                />
                <div className="text-xs font-mono text-muted-foreground mt-1 text-right">{dimensions.height}px</div>
              </div>
            </div>
          </div>

          {/* Simulation Parameters */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400"></div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                {selectedPattern.controls ? "Simulation Parameters" : "Pattern Controls"}
              </h3>
            </div>
            {selectedPattern.controls ? (
              <div className="grid grid-cols-2 gap-4">
                {selectedPattern.controls.map((control) => {
                  const currentValue = getCurrentControlValues()[control.id] ?? control.defaultValue
                  
                  if (control.type === 'range') {
                    return (
                      <div key={control.id} className={control.id === 'jitterAmount' || control.id === 'colorScheme' ? 'col-span-2' : ''}>
                        <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">{control.label}</label>
                        <input
                          type="range"
                          min={control.min}
                          max={control.max}
                          step={control.step}
                          value={currentValue as number}
                          onChange={(e) => handleControlChange(control.id, control.step && control.step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
                          className="w-full accent-yellow-400"
                        />
                        <div className="text-xs font-mono text-muted-foreground mt-1 text-right">
                          {control.step && control.step < 1 
                            ? (currentValue as number).toFixed(control.step.toString().split('.')[1]?.length || 1)
                            : currentValue
                          }{control.id.includes('Speed') || control.id.includes('brightness') || control.id.includes('colorIntensity') ? '×' : control.id.includes('Size') ? 'px' : ''}
                        </div>
                      </div>
                    )
                  } else if (control.type === 'select') {
                    return (
                      <div key={control.id} className="col-span-2">
                        <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">{control.label}</label>
                        <select
                          value={currentValue as string}
                          onChange={(e) => handleControlChange(control.id, e.target.value)}
                          className="w-full border border-border p-2 text-xs font-mono bg-background text-foreground"
                        >
                          {control.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )
                  } else if (control.type === 'checkbox') {
                    return (
                      <div key={control.id} className="col-span-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentValue as boolean}
                            onChange={(e) => handleControlChange(control.id, e.target.checked)}
                            className="w-4 h-4 accent-yellow-400"
                          />
                          <span className="text-xs font-mono text-muted-foreground uppercase">{control.label}</span>
                        </label>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            ) : (
              <div className="border border-border p-3 bg-background">
                <div className="text-xs font-mono text-muted-foreground mb-3 uppercase">No Controls Available</div>
                <div className="text-xs text-muted-foreground/60">This pattern does not have interactive controls</div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
