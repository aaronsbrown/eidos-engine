// AIDEV-NOTE: Behavioral tests for pattern state preservation across layout switches (Issue #80)
// AIDEV-NOTE: Tests focus on user behavior per G-8 rule: pattern selection and control value persistence
import { render, screen, act, fireEvent } from '@testing-library/react'
import { useEffect, useState } from 'react'
import { PatternStateProvider, usePatternState } from '../pattern-state-context'
import { patternGenerators } from '@/components/pattern-generators'

// Test component that simulates layout switching behavior
const TestLayoutSwitcher = ({ 
  currentLayout, 
  onPatternSelect, 
  onControlChange,
  testId = 'layout-switcher'
}: { 
  currentLayout: 'mobile' | 'desktop'
  onPatternSelect?: (patternId: string) => void
  onControlChange?: (controlId: string, value: number | string | boolean) => void
  testId?: string
}) => {
  const {
    selectedPatternId,
    controlValues,
    setSelectedPatternId,
    updateControlValue,
    initializePattern
  } = usePatternState()

  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize pattern on mount (simulates layout component mounting)
  useEffect(() => {
    if (!isInitialized && selectedPatternId) {
      initializePattern(selectedPatternId, currentLayout)
      setIsInitialized(true)
    }
  }, [selectedPatternId, currentLayout, initializePattern, isInitialized])

  const currentControlValues = controlValues[selectedPatternId] || {}

  const handlePatternSelect = (patternId: string) => {
    setSelectedPatternId(patternId)
    onPatternSelect?.(patternId)
  }

  const handleControlChange = (controlId: string, value: number | string | boolean) => {
    updateControlValue(selectedPatternId, controlId, value)
    onControlChange?.(controlId, value)
  }

  return (
    <div data-testid={testId}>
      <div data-testid="current-layout">{currentLayout}</div>
      <div data-testid="selected-pattern">{selectedPatternId}</div>
      <div data-testid="control-values">{JSON.stringify(currentControlValues)}</div>
      
      {/* Simulate pattern selector */}
      <select 
        data-testid="pattern-selector"
        value={selectedPatternId}
        onChange={(e) => handlePatternSelect(e.target.value)}
      >
        {patternGenerators.map(pattern => (
          <option key={pattern.id} value={pattern.id}>
            {pattern.name}
          </option>
        ))}
      </select>

      {/* Simulate control changes */}
      <button
        data-testid="change-control-btn"
        onClick={() => handleControlChange('testControl', Math.random())}
      >
        Change Control
      </button>
    </div>
  )
}

// Component that simulates the main page switching between layouts
const TestMainPage = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [patternChangeCount, setPatternChangeCount] = useState(0)
  const [controlChangeCount, setControlChangeCount] = useState(0)

  return (
    <PatternStateProvider>
      <div>
        <button
          data-testid="toggle-layout-btn"
          onClick={() => setIsMobile(!isMobile)}
        >
          Switch to {isMobile ? 'Desktop' : 'Mobile'}
        </button>
        
        <div data-testid="pattern-change-count">{patternChangeCount}</div>
        <div data-testid="control-change-count">{controlChangeCount}</div>

        {isMobile ? (
          <TestLayoutSwitcher
            currentLayout="mobile"
            testId="mobile-layout"
            onPatternSelect={() => setPatternChangeCount(c => c + 1)}
            onControlChange={() => setControlChangeCount(c => c + 1)}
          />
        ) : (
          <TestLayoutSwitcher
            currentLayout="desktop"
            testId="desktop-layout"
            onPatternSelect={() => setPatternChangeCount(c => c + 1)}
            onControlChange={() => setControlChangeCount(c => c + 1)}
          />
        )}
      </div>
    </PatternStateProvider>
  )
}

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => store[key] = value,
    removeItem: (key: string) => delete store[key],
    clear: () => store = {}
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('Pattern State Context - Layout Switching Behavior', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    jest.clearAllMocks()
  })

  describe('Pattern Selection Persistence', () => {
    it('preserves selected pattern when switching from mobile to desktop', async () => {
      render(<TestMainPage />)
      
      // Verify initial desktop layout
      expect(screen.getByTestId('desktop-layout')).toBeInTheDocument()
      
      // Select a different pattern
      const newPatternId = patternGenerators[1]?.id || 'thomas-attractor'
      await act(async () => {
        fireEvent.change(screen.getByTestId('pattern-selector'), {
          target: { value: newPatternId }
        })
      })
      
      expect(screen.getByTestId('selected-pattern')).toHaveTextContent(newPatternId)
      
      // Switch to mobile layout
      await act(async () => {
        fireEvent.click(screen.getByTestId('toggle-layout-btn'))
      })
      
      // Verify mobile layout renders and pattern is preserved
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
      expect(screen.getByTestId('selected-pattern')).toHaveTextContent(newPatternId)
    })

    it('preserves selected pattern when switching from desktop to mobile', async () => {
      render(<TestMainPage />)
      
      // Start with desktop, select a pattern
      const selectedPatternId = patternGenerators[2]?.id || 'aizawa-attractor'
      await act(async () => {
        fireEvent.change(screen.getByTestId('pattern-selector'), {
          target: { value: selectedPatternId }
        })
      })
      
      expect(screen.getByTestId('selected-pattern')).toHaveTextContent(selectedPatternId)
      
      // Switch to mobile
      await act(async () => {
        fireEvent.click(screen.getByTestId('toggle-layout-btn'))
      })
      
      // Verify pattern is preserved in mobile layout
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
      expect(screen.getByTestId('selected-pattern')).toHaveTextContent(selectedPatternId)
    })
  })

  describe('Control Values Persistence', () => {
    it('preserves control values when switching layouts', async () => {
      render(<TestMainPage />)
      
      // Start with desktop layout
      expect(screen.getByTestId('desktop-layout')).toBeInTheDocument()
      
      // Make control changes
      await act(async () => {
        fireEvent.click(screen.getByTestId('change-control-btn'))
      })
      
      const controlsAfterChange = screen.getByTestId('control-values').textContent
      expect(controlsAfterChange).not.toBe('{}')
      
      // Switch to mobile layout
      await act(async () => {
        fireEvent.click(screen.getByTestId('toggle-layout-btn'))
      })
      
      // Verify control values are preserved
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
      expect(screen.getByTestId('control-values')).toHaveTextContent(controlsAfterChange || '')
    })

    it('maintains separate control values for different patterns', async () => {
      render(<TestMainPage />)
      
      const pattern1Id = patternGenerators[0]?.id || 'lorenz-attractor'
      const pattern2Id = patternGenerators[1]?.id || 'thomas-attractor'
      
      // Select first pattern and modify controls
      await act(async () => {
        fireEvent.change(screen.getByTestId('pattern-selector'), {
          target: { value: pattern1Id }
        })
      })
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('change-control-btn'))
      })
      
      const pattern1Controls = screen.getByTestId('control-values').textContent
      
      // Select second pattern and modify controls
      await act(async () => {
        fireEvent.change(screen.getByTestId('pattern-selector'), {
          target: { value: pattern2Id }
        })
      })
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('change-control-btn'))
      })
      
      const pattern2Controls = screen.getByTestId('control-values').textContent
      
      // Switch layouts and verify each pattern maintains its values
      await act(async () => {
        fireEvent.click(screen.getByTestId('toggle-layout-btn'))
      })
      
      // Check first pattern
      await act(async () => {
        fireEvent.change(screen.getByTestId('pattern-selector'), {
          target: { value: pattern1Id }
        })
      })
      
      expect(screen.getByTestId('control-values')).toHaveTextContent(pattern1Controls || '')
      
      // Check second pattern
      await act(async () => {
        fireEvent.change(screen.getByTestId('pattern-selector'), {
          target: { value: pattern2Id }
        })
      })
      
      expect(screen.getByTestId('control-values')).toHaveTextContent(pattern2Controls || '')
    })
  })

  describe('Rapid Layout Switching', () => {
    it('handles rapid layout switches without data loss', async () => {
      render(<TestMainPage />)
      
      // Select a pattern and modify controls
      const testPatternId = patternGenerators[1]?.id || 'thomas-attractor'
      await act(async () => {
        fireEvent.change(screen.getByTestId('pattern-selector'), {
          target: { value: testPatternId }
        })
      })
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('change-control-btn'))
      })
      
      const initialControlValues = screen.getByTestId('control-values').textContent
      
      // Rapidly switch layouts multiple times
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          fireEvent.click(screen.getByTestId('toggle-layout-btn'))
        })
      }
      
      // Verify data is still preserved
      expect(screen.getByTestId('selected-pattern')).toHaveTextContent(testPatternId)
      expect(screen.getByTestId('control-values')).toHaveTextContent(initialControlValues || '')
    })
  })

  describe('LocalStorage Persistence', () => {
    it('persists state across component remount', async () => {
      const { unmount } = render(<TestMainPage />)
      
      // Set up initial state
      const testPatternId = patternGenerators[2]?.id || 'aizawa-attractor'
      await act(async () => {
        fireEvent.change(screen.getByTestId('pattern-selector'), {
          target: { value: testPatternId }
        })
      })
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('change-control-btn'))
      })
      
      const controlValues = screen.getByTestId('control-values').textContent
      
      // Unmount and remount component
      unmount()
      render(<TestMainPage />)
      
      // Verify state is restored from localStorage
      expect(screen.getByTestId('selected-pattern')).toHaveTextContent(testPatternId)
      expect(screen.getByTestId('control-values')).toHaveTextContent(controlValues || '')
    })
  })

  describe('Error Handling', () => {
    it('gracefully handles invalid pattern IDs', async () => {
      render(<TestMainPage />)
      
      // Try to select an invalid pattern
      await act(async () => {
        fireEvent.change(screen.getByTestId('pattern-selector'), {
          target: { value: 'invalid-pattern-id' }
        })
      })
      
      // Should not crash and should maintain valid state
      expect(screen.getByTestId('desktop-layout')).toBeInTheDocument()
    })

    it('handles localStorage errors gracefully', async () => {
      // Mock localStorage to throw errors
      const originalSetItem = mockLocalStorage.setItem
      mockLocalStorage.setItem = jest.fn(() => {
        throw new Error('Storage full')
      })
      
      render(<TestMainPage />)
      
      // Operations should still work without localStorage
      await act(async () => {
        fireEvent.click(screen.getByTestId('change-control-btn'))
      })
      
      expect(screen.getByTestId('desktop-layout')).toBeInTheDocument()
      
      // Restore original function
      mockLocalStorage.setItem = originalSetItem
    })
  })
})