// AIDEV-NOTE: Behavioral tests for floating preset panel focused on library management
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FloatingPresetPanel } from './floating-preset-panel'
import { PatternControl } from '../pattern-generators/types'

// Mock the preset manager hook
const mockUsePresetManager = jest.fn()
jest.mock('@/lib/hooks/use-preset-manager', () => ({
  usePresetManager: () => mockUsePresetManager()
}))

describe('Floating Preset Panel - Library Management', () => {
  const mockPatternControls: PatternControl[] = [
    { id: 'pixelSize', type: 'range', min: 1, max: 20, defaultValue: 8, label: 'Pixel Size' }
  ]

  const defaultProps = {
    patternId: 'pixelated-noise',
    controlValues: { pixelSize: 10 },
    onControlValuesChange: jest.fn(),
    patternControls: mockPatternControls,
    onClose: jest.fn()
  }

  const mockPresets = [
    {
      id: 'preset-1',
      name: 'Test Preset 1',
      createdAt: '2024-01-01T12:00:00Z',
      parameters: { pixelSize: 12 }
    },
    {
      id: 'preset-2', 
      name: 'Test Preset 2',
      createdAt: '2024-01-02T12:00:00Z',
      parameters: { pixelSize: 15 }
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Panel Structure', () => {
    test('displays "Preset Manager" title', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      expect(screen.getByText('Preset Manager')).toBeInTheDocument()
    })

    test('displays import button', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      expect(screen.getByText('Import Preset JSON')).toBeInTheDocument()
    })

    test('displays pattern ID in footer', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      expect(screen.getByText('Pattern: pixelated-noise')).toBeInTheDocument()
    })
  })

  describe('Preset Library Display', () => {
    test('shows preset library section when presets exist', () => {
      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      expect(screen.getByText('Preset Library:')).toBeInTheDocument()
      expect(screen.getByText('Test Preset 1')).toBeInTheDocument()
      expect(screen.getByText('Test Preset 2')).toBeInTheDocument()
    })

    test('displays preset creation dates', () => {
      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      expect(screen.getByText('1/1/2024')).toBeInTheDocument()
      expect(screen.getByText('1/2/2024')).toBeInTheDocument()
    })

    test('shows edit, export, and delete buttons for each preset', () => {
      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      // Should have 2 edit buttons (one per preset)
      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.querySelector('svg') // Edit2 icon
      )
      expect(editButtons).toHaveLength(2)

      // Should have 2 export buttons
      const exportButtons = screen.getAllByText('Export')
      expect(exportButtons).toHaveLength(2)

      // Should have 2 delete buttons  
      const deleteButtons = screen.getAllByText('Delete')
      expect(deleteButtons).toHaveLength(2)
    })
  })

  describe('Rename Functionality', () => {
    test('clicking edit button enters rename mode', () => {
      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.querySelector('svg')
      )
      
      fireEvent.click(editButtons[0])

      // Should show input field with current name
      const nameInput = screen.getByDisplayValue('Test Preset 1')
      expect(nameInput).toBeInTheDocument()
      expect(nameInput).toHaveFocus()

      // Should show Save and Cancel buttons
      expect(screen.getByText('Save')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    test('can save renamed preset by clicking Save button', async () => {
      const mockRenamePreset = jest.fn().mockResolvedValue(true)
      
      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: mockRenamePreset,
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.querySelector('svg')
      )
      
      fireEvent.click(editButtons[0])

      const nameInput = screen.getByDisplayValue('Test Preset 1')
      fireEvent.change(nameInput, { target: { value: 'Renamed Preset' } })

      const saveButton = screen.getByText('Save')
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockRenamePreset).toHaveBeenCalledWith('preset-1', 'Renamed Preset')
      })
    })

    test('can save renamed preset by pressing Enter', async () => {
      const mockRenamePreset = jest.fn().mockResolvedValue(true)
      
      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: mockRenamePreset,
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.querySelector('svg')
      )
      
      fireEvent.click(editButtons[0])

      const nameInput = screen.getByDisplayValue('Test Preset 1')
      fireEvent.change(nameInput, { target: { value: 'Enter Renamed' } })
      fireEvent.keyDown(nameInput, { key: 'Enter' })

      await waitFor(() => {
        expect(mockRenamePreset).toHaveBeenCalledWith('preset-1', 'Enter Renamed')
      })
    })

    test('can cancel rename by clicking Cancel button', () => {
      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.querySelector('svg')
      )
      
      fireEvent.click(editButtons[0])

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      // Should return to normal view
      expect(screen.getByText('Test Preset 1')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('Test Preset 1')).not.toBeInTheDocument()
    })

    test('can cancel rename by pressing Escape', () => {
      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.querySelector('svg')
      )
      
      fireEvent.click(editButtons[0])

      const nameInput = screen.getByDisplayValue('Test Preset 1')
      fireEvent.keyDown(nameInput, { key: 'Escape' })

      // Should return to normal view
      expect(screen.getByText('Test Preset 1')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('Test Preset 1')).not.toBeInTheDocument()
    })

    test('save button is disabled when input is empty', () => {
      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.querySelector('svg')
      )
      
      fireEvent.click(editButtons[0])

      const nameInput = screen.getByDisplayValue('Test Preset 1')
      fireEvent.change(nameInput, { target: { value: '' } })

      const saveButton = screen.getByText('Save')
      expect(saveButton).toBeDisabled()
    })

    test('user cannot save preset when system is busy', () => {
      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: true, // System is processing other operations
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      // User starts editing a preset name
      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.querySelector('svg')
      )
      fireEvent.click(editButtons[0])

      // User should not be able to save when system is busy
      const saveButtons = screen.queryAllByText(/save/i)
      if (saveButtons.length > 0) {
        expect(saveButtons[0]).toBeDisabled()
      }
    })
  })

  describe('Delete Functionality', () => {
    test('clicking delete shows confirmation dialog', () => {
      const mockConfirm = jest.fn().mockReturnValue(false)
      window.confirm = mockConfirm

      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])

      expect(mockConfirm).toHaveBeenCalledWith('Delete this preset?')
    })

    test('deletes preset when user confirms', async () => {
      const mockDeletePreset = jest.fn().mockResolvedValue(true)
      const mockConfirm = jest.fn().mockReturnValue(true)
      window.confirm = mockConfirm

      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: false,
        error: null,
        deletePreset: mockDeletePreset,
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(mockDeletePreset).toHaveBeenCalledWith('preset-1')
      })
    })
  })

  describe('User Interaction', () => {
    test('user can close preset panel', () => {
      const mockOnClose = jest.fn()

      mockUsePresetManager.mockReturnValue({
        presets: mockPresets,
        isLoading: false,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} onClose={mockOnClose} />)

      // User clicks the close button
      const closeButton = screen.getByLabelText(/close presets/i)
      fireEvent.click(closeButton)

      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    test('displays error message when error exists', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        isLoading: false,
        error: 'Test error message',
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    test('user sees error messages when operations fail', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        isLoading: false,
        error: 'Test error message',
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      // User can see error messages when operations fail
      expect(screen.getByText('Test error message')).toBeInTheDocument()
      
      // Error message has appropriate styling/context to indicate it's an error
      const errorElement = screen.getByText('Test error message')
      expect(errorElement.closest('.text-red-500')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    test('displays loading indicator when loading', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        isLoading: true,
        error: null,
        deletePreset: jest.fn(),
        renamePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      expect(screen.getByText('Working...')).toBeInTheDocument()
    })
  })
})