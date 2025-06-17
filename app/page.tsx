"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { patternGenerators } from "@/components/pattern-generators"

export default function PatternGeneratorShowcase() {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(patternGenerators[0].id)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [isFullscreen, setIsFullscreen] = useState(false)

  const selectedPattern = patternGenerators.find(p => p.id === selectedPatternId) || patternGenerators[0]
  const PatternComponent = selectedPattern.component

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      setDimensions({ width: window.innerWidth - 40, height: window.innerHeight - 120 })
    } else {
      setDimensions({ width: 800, height: 600 })
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
        {/* Pattern Selection Sidebar */}
        <aside className="w-80 border-r border-gray-300 p-6 space-y-6 bg-white/50 backdrop-blur-sm">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400"></div>
              <h2 className="text-sm font-mono uppercase tracking-wider text-gray-700">Pattern Selection</h2>
            </div>
            <div className="space-y-1">
              {patternGenerators.map((pattern, index) => (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedPatternId(pattern.id)}
                  className={`w-full text-left p-3 border transition-all font-mono text-xs ${
                    selectedPatternId === pattern.id
                      ? "bg-yellow-100 border-yellow-400 text-gray-900"
                      : "bg-white border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="uppercase tracking-wider">{pattern.name}</span>
                    <span className="text-gray-400">{(index + 1).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="text-gray-500 mt-1">{pattern.id}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Controls */}
          <div className="border-t border-gray-300 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400"></div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-gray-700">Parameters</h3>
            </div>
            <div className="space-y-4">
              <div className="border border-gray-300 p-3 bg-white">
                <label className="block text-xs font-mono text-gray-600 mb-2 uppercase">Width</label>
                <input
                  type="range"
                  min="200"
                  max="1200"
                  value={dimensions.width}
                  onChange={(e) => setDimensions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                  className="w-full accent-yellow-400"
                />
                <div className="text-xs font-mono text-gray-500 mt-1 text-right">{dimensions.width}px</div>
              </div>
              <div className="border border-gray-300 p-3 bg-white">
                <label className="block text-xs font-mono text-gray-600 mb-2 uppercase">Height</label>
                <input
                  type="range"
                  min="200"
                  max="800"
                  value={dimensions.height}
                  onChange={(e) => setDimensions(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                  className="w-full accent-yellow-400"
                />
                <div className="text-xs font-mono text-gray-500 mt-1 text-right">{dimensions.height}px</div>
              </div>
            </div>
          </div>

          {/* Pattern Info */}
          <div className="border-t border-gray-300 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400"></div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-gray-700">Specifications</h3>
            </div>
            <div className="border border-gray-300 p-3 bg-white space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-600">TYPE:</span>
                <span className="text-gray-900 uppercase">{selectedPattern.id}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-600">SIZE:</span>
                <span className="text-gray-900">{dimensions.width} × {dimensions.height}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-600">FPS:</span>
                <span className="text-gray-900">60</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-600">STATUS:</span>
                <span className="text-green-600">ACTIVE</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Pattern Display */}
        <main className="flex-1 p-6 relative">
          {/* Technical annotation boxes */}
          <div className="absolute top-4 left-4 text-xs font-mono text-gray-500 space-y-1">
            <div className="border border-gray-300 bg-white px-2 py-1">VIEWPORT_01</div>
          </div>
          <div className="absolute top-4 right-4 text-xs font-mono text-gray-500 space-y-1">
            <div className="border border-gray-300 bg-white px-2 py-1">REAL_TIME</div>
          </div>

          <div className="flex flex-col items-center justify-center min-h-full">
            {/* Pattern Title with technical styling */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-mono uppercase tracking-widest text-gray-900 mb-2">
                {selectedPattern.name}
              </h2>
              <div className="flex items-center justify-center space-x-4 text-xs font-mono text-gray-500">
                <span className="border border-gray-300 bg-white px-2 py-1">GENERATIVE_PATTERN</span>
                <span className="border border-gray-300 bg-white px-2 py-1">60FPS_ANIMATION</span>
                <span className="border border-gray-300 bg-white px-2 py-1">CANVAS_RENDER</span>
              </div>
            </div>

            {/* Pattern Container with technical frame */}
            <div className="relative">
              {/* Corner markers */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-400"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-yellow-400"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-yellow-400"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-400"></div>
              
              {/* Dimension labels */}
              <div className="absolute -top-6 left-0 text-xs font-mono text-gray-500">
                {dimensions.width}px
              </div>
              <div className="absolute -left-12 top-0 text-xs font-mono text-gray-500 -rotate-90 origin-center">
                {dimensions.height}px
              </div>

              <div 
                className="border-2 border-gray-400 bg-white shadow-lg"
                style={{ 
                  width: dimensions.width, 
                  height: dimensions.height 
                }}
              >
                <PatternComponent 
                  width={dimensions.width} 
                  height={dimensions.height}
                  className="w-full h-full"
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
                className="font-mono text-xs border-gray-400 hover:border-yellow-400 hover:bg-yellow-50"
              >
                ← PREV
              </Button>
              
              <div className="text-xs font-mono text-gray-500 border border-gray-300 bg-white px-3 py-2">
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
                className="font-mono text-xs border-gray-400 hover:border-yellow-400 hover:bg-yellow-50"
              >
                NEXT →
              </Button>
            </div>
          </div>

          {/* Bottom technical annotations */}
          <div className="absolute bottom-4 left-4 text-xs font-mono text-gray-500">
            <div className="border border-gray-300 bg-white px-2 py-1">PATTERN_GENERATOR_SYSTEM_v1.0</div>
          </div>
          <div className="absolute bottom-4 right-4 text-xs font-mono text-gray-500">
            <div className="border border-gray-300 bg-white px-2 py-1">
              {new Date().toISOString().split('T')[0]}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
