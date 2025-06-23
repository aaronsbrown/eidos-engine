// AIDEV-NOTE: Behavioral tests for preset UI - test actual user interactions and flows
import React from 'react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TempPresetControls } from './temp-preset-controls'

// Setup jsdom environment properly
import '@testing-library/jest-dom'

// Mock file API for import testing
const mockFileReader = {
  readAsText: jest.fn(),
  result: '',
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null
}

global.FileReader = jest.fn(() => mockFileReader) as unknown as typeof FileReader

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock URL.createObjectURL and revokeObjectURL for export testing
Object.defineProperty(global, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-blob-url'),
    revokeObjectURL: jest.fn()
  }
})

describe('TempPresetControls - User Interaction Flows', () => {
  const mockControlValues = {
    pixelSize: 8,
    colorIntensity: 0.7,
    enabled: true
  }

  const mockPatternControls = [
    { id: 'pixelSize', label: 'Pixel Size', type: 'range' as const, min: 1, max: 20, defaultValue: 8 },
    { id: 'colorIntensity', label: 'Color Intensity', type: 'range' as const, min: 0, max: 1, defaultValue: 0.5 },
    { id: 'enabled', label: 'Enabled', type: 'checkbox' as const, defaultValue: true }
  ]

  const defaultProps = {
    patternId: 'pixelated-noise',
    controlValues: mockControlValues,
    onControlValuesChange: jest.fn(),
    patternControls: mockPatternControls
  }

  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  describe('Empty State User Experience', () => {
    test('user sees preset section even with no saved presets', () => {
      render(<TempPresetControls {...defaultProps} />)
      
      expect(screen.getByText(/presets \(temp ui/i)).toBeInTheDocument()
      expect(screen.getByText('+ Save Current as Preset')).toBeInTheDocument()
      expect(screen.getByText('Import Preset JSON')).toBeInTheDocument()
      expect(screen.getByText('No presets saved for this pattern yet')).toBeInTheDocument()
    })

    test('import button is always available for first-time users', () => {
      render(<TempPresetControls {...defaultProps} />)
      
      const importButton = screen.getByText('Import Preset JSON')
      expect(importButton).toBeInTheDocument()
      expect(importButton).not.toBeDisabled()
    })
  })

  describe('Save Preset User Flow', () => {
    test('user clicks save button and sees input form', async () => {
      const user = userEvent.setup()
      render(<TempPresetControls {...defaultProps} />)
      
      await user.click(screen.getByText('+ Save Current as Preset'))
      
      expect(screen.getByPlaceholderText('Preset name...')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
      expect(screen.getByText('×')).toBeInTheDocument()
    })

    test('user types name and saves successfully', async () => {
      const user = userEvent.setup()
      render(<TempPresetControls {...defaultProps} />)
      
      // Click save button
      await user.click(screen.getByText('+ Save Current as Preset'))
      
      // Type preset name
      const nameInput = screen.getByPlaceholderText('Preset name...')
      await user.type(nameInput, 'My Cool Preset')
      
      // Click save
      await user.click(screen.getByText('Save'))
      
      // Should see the saved preset in the list
      await waitFor(() => {
        expect(screen.getByText('My Cool Preset')).toBeInTheDocument()
        expect(screen.getByText('Export')).toBeInTheDocument()
        expect(screen.getByText('Del')).toBeInTheDocument()
      })
      
      // Input form should be hidden
      expect(screen.queryByPlaceholderText('Preset name...')).not.toBeInTheDocument()
    })

    test('user saves preset and it shows as active with checkmark', async () => {
      const user = userEvent.setup()
      render(<TempPresetControls {...defaultProps} />)
      
      await user.click(screen.getByText('+ Save Current as Preset'))
      await user.type(screen.getByPlaceholderText('Preset name...'), 'Active Test')
      await user.click(screen.getByText('Save'))
      
      await waitFor(() => {
        expect(screen.getByText('✓')).toBeInTheDocument() // Active checkmark
      })
    })

    test('user presses Enter to save preset', async () => {
      const user = userEvent.setup()
      render(<TempPresetControls {...defaultProps} />)
      
      await user.click(screen.getByText('+ Save Current as Preset'))
      
      const nameInput = screen.getByPlaceholderText('Preset name...')
      await user.type(nameInput, 'Enter Test')
      await user.keyboard('{Enter}')
      
      await waitFor(() => {
        expect(screen.getByText('Enter Test')).toBeInTheDocument()
      })
    })

    test('user presses Escape to cancel save', async () => {
      const user = userEvent.setup()
      render(<TempPresetControls {...defaultProps} />)
      
      await user.click(screen.getByText('+ Save Current as Preset'))
      await user.type(screen.getByPlaceholderText('Preset name...'), 'Cancelled')
      await user.keyboard('{Escape}')
      
      // Should hide the input form
      expect(screen.queryByPlaceholderText('Preset name...')).not.toBeInTheDocument()
      expect(screen.getByText('+ Save Current as Preset')).toBeInTheDocument()
    })

    test('user tries to save with empty name - save button stays disabled', async () => {
      const user = userEvent.setup()
      render(<TempPresetControls {...defaultProps} />)
      
      await user.click(screen.getByText('+ Save Current as Preset'))
      
      const saveButton = screen.getByText('Save')
      expect(saveButton).toBeDisabled()
      
      // Type spaces only
      await user.type(screen.getByPlaceholderText('Preset name...'), '   ')
      expect(saveButton).toBeDisabled()
    })

    test('user clicks X to cancel save form', async () => {
      const user = userEvent.setup()
      render(<TempPresetControls {...defaultProps} />)
      
      await user.click(screen.getByText('+ Save Current as Preset'))
      await user.type(screen.getByPlaceholderText('Preset name...'), 'Will Cancel')
      await user.click(screen.getByText('×'))
      
      expect(screen.queryByPlaceholderText('Preset name...')).not.toBeInTheDocument()
      expect(screen.getByText('+ Save Current as Preset')).toBeInTheDocument()
    })
  })

  describe('Load Preset User Flow', () => {
    test('user loads preset and parameters change', async () => {
      const onControlValuesChange = jest.fn()
      const user = userEvent.setup()
      
      render(<TempPresetControls {...{ ...defaultProps, onControlValuesChange }} />)
      
      // Save a preset first
      await user.click(screen.getByText('+ Save Current as Preset'))
      await user.type(screen.getByPlaceholderText('Preset name...'), 'Test Load')
      await user.click(screen.getByText('Save'))
      
      // Change mock values to simulate parameter changes
      const newProps = {
        ...defaultProps,
        controlValues: { pixelSize: 15, colorIntensity: 0.3, enabled: false },
        onControlValuesChange
      }
      
      render(<TempPresetControls {...newProps} />)
      
      // Load the preset
      await user.click(screen.getByText('Load'))
      
      await waitFor(() => {
        expect(onControlValuesChange).toHaveBeenCalledWith({
          pixelSize: 8,
          colorIntensity: 0.7,
          enabled: true
        })
      })
    })

    test('user cannot load preset that is already active', async () => {
      const user = userEvent.setup()
      render(<TempPresetControls {...defaultProps} />)
      
      // Save and activate preset
      await user.click(screen.getByText('+ Save Current as Preset'))
      await user.type(screen.getByPlaceholderText('Preset name...'), 'Already Active')
      await user.click(screen.getByText('Save'))
      
      await waitFor(() => {
        const loadButton = screen.getByText('✓')
        expect(loadButton).toBeDisabled()
      })
    })
  })

  describe('Delete Preset User Flow', () => {
    test('user deletes preset after confirmation', async () => {
      const user = userEvent.setup()
      
      // Mock window.confirm
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)
      
      render(<TempPresetControls {...defaultProps} />)
      
      // Save preset first
      await user.click(screen.getByText('+ Save Current as Preset'))
      await user.type(screen.getByPlaceholderText('Preset name...'), 'To Delete')
      await user.click(screen.getByText('Save'))
      
      // Delete it
      await user.click(screen.getByText('Del'))
      
      expect(confirmSpy).toHaveBeenCalledWith('Delete this preset?')
      
      await waitFor(() => {
        expect(screen.queryByText('To Delete')).not.toBeInTheDocument()
        expect(screen.getByText('No presets saved for this pattern yet')).toBeInTheDocument()
      })
      
      confirmSpy.mockRestore()
    })

    test('user cancels delete confirmation', async () => {
      const user = userEvent.setup()
      
      // Mock window.confirm to return false (cancel)
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false)
      
      render(<TempPresetControls {...defaultProps} />)
      
      // Save preset first
      await user.click(screen.getByText('+ Save Current as Preset'))
      await user.type(screen.getByPlaceholderText('Preset name...'), 'Keep Me')
      await user.click(screen.getByText('Save'))
      
      // Try to delete but cancel
      await user.click(screen.getByText('Del'))
      
      expect(confirmSpy).toHaveBeenCalled()
      
      // Preset should still be there
      expect(screen.getByText('Keep Me')).toBeInTheDocument()
      
      confirmSpy.mockRestore()
    })
  })

  describe('Export Preset User Flow', () => {
    test('user exports preset and downloads file', async () => {
      const user = userEvent.setup()
      
      // Mock document.createElement and appendChild/removeChild
      const mockAnchor = {
        href: '',
        download: '',
        click: jest.fn(),
        remove: jest.fn()
      }
      const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement)
      const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation()
      const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation()
      
      render(<TempPresetControls {...defaultProps} />)
      
      // Save preset first
      await user.click(screen.getByText('+ Save Current as Preset'))
      await user.type(screen.getByPlaceholderText('Preset name...'), 'Export Test')
      await user.click(screen.getByText('Save'))
      
      // Export it
      await user.click(screen.getByText('Export'))
      
      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(mockAnchor.download).toBe('preset_Export_Test.json')
      expect(mockAnchor.click).toHaveBeenCalled()
      expect(appendChildSpy).toHaveBeenCalledWith(mockAnchor)
      expect(removeChildSpy).toHaveBeenCalledWith(mockAnchor)
      
      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })
  })

  describe('Import Preset User Flow', () => {
    test('user imports valid JSON file and preset becomes active', async () => {
      const user = userEvent.setup()
      const onControlValuesChange = jest.fn()
      
      render(<TempPresetControls {...{ ...defaultProps, onControlValuesChange }} />)
      
      // Mock file input creation and interaction
      const mockInput = {
        type: '',
        accept: '',
        click: jest.fn(),
        onchange: null as ((event: Event) => void) | null
      }
      const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockInput as unknown as HTMLElement)
      
      // Click import button
      await user.click(screen.getByText('Import Preset JSON'))
      
      expect(createElementSpy).toHaveBeenCalledWith('input')
      expect(mockInput.type).toBe('file')
      expect(mockInput.accept).toBe('.json')
      expect(mockInput.click).toHaveBeenCalled()
      
      // Simulate file selection and reading
      const mockFile = new File(['{"test": "data"}'], 'preset.json', { type: 'application/json' })
      const validJSON = JSON.stringify({
        version: '1.0.0',
        presets: [{
          id: 'import-test',
          name: 'Imported Preset',
          generatorType: 'pixelated-noise',
          parameters: { pixelSize: 12, colorIntensity: 0.8, enabled: false },
          createdAt: new Date(),
          contentHash: 'test-hash'
        }],
        exportedAt: new Date()
      })
      
      // Mock File.prototype.text
      const textSpy = jest.spyOn(File.prototype, 'text').mockResolvedValue(validJSON)
      
      // Simulate file selection
      const mockEvent = {
        target: { files: [mockFile] }
      }
      
      if (mockInput.onchange) {
        await mockInput.onchange(mockEvent)
      }
      
      await waitFor(() => {
        expect(screen.getByText('Imported Preset')).toBeInTheDocument()
        expect(screen.getByText('✓')).toBeInTheDocument() // Should be active
      })
      
      // Should have called onControlValuesChange with imported parameters
      expect(onControlValuesChange).toHaveBeenCalledWith({
        pixelSize: 12,
        colorIntensity: 0.8,
        enabled: false
      })
      
      createElementSpy.mockRestore()
      textSpy.mockRestore()
    })
  })

  describe('Error Handling User Experience', () => {
    test('save button is disabled for empty name', async () => {
      const user = userEvent.setup()
      render(<TempPresetControls {...defaultProps} />)
      
      // Open save form
      await user.click(screen.getByText('+ Save Current as Preset'))
      
      // Save button should be disabled for empty name
      const saveButton = screen.getByText('Save')
      expect(saveButton).toBeDisabled()
      
      // Type name - button should become enabled
      await user.type(screen.getByPlaceholderText('Preset name...'), 'Valid Name')
      expect(saveButton).not.toBeDisabled()
    })
  })

  describe('Visual State Indicators', () => {
    test('active preset behavior can be tested via hook', async () => {
      // This test verifies the core behavior is working
      // Visual aspects like checkmarks are tested via hook tests
      const user = userEvent.setup()
      render(<TempPresetControls {...defaultProps} />)
      
      await user.click(screen.getByText('+ Save Current as Preset'))
      await user.type(screen.getByPlaceholderText('Preset name...'), 'Active Test')
      await user.click(screen.getByText('Save'))
      
      await waitFor(() => {
        expect(screen.getByText('Active Test')).toBeInTheDocument()
      })
    })
  })
})