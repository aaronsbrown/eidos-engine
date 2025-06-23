// AIDEV-NOTE: Behavioral tests for floating preset panel streamlined save UI
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FloatingPresetPanel } from './floating-preset-panel'
import { PatternControl } from '../pattern-generators/types'

// Mock the preset manager hook
const mockUsePresetManager = jest.fn()
jest.mock('@/lib/hooks/use-preset-manager', () => ({
  usePresetManager: () => mockUsePresetManager()
}))

describe('Floating Preset Panel - Streamlined Save UI', () => {
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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Save UI Always Visible', () => {
    test('save input field is immediately visible when panel opens', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: false,
        error: null,
        savePreset: jest.fn(),
        loadPreset: jest.fn(),
        deletePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      // Save input should be immediately visible (no need to click a button first)
      const nameInput = screen.getByPlaceholderText('Preset name...')
      expect(nameInput).toBeInTheDocument()
      expect(nameInput).toHaveFocus() // autoFocus should make it focused
    })

    test('save button is immediately visible when panel opens', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: false,
        error: null,
        savePreset: jest.fn(),
        loadPreset: jest.fn(),
        deletePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      // Save button should be immediately visible
      const saveButton = screen.getByRole('button', { name: /save current as preset/i })
      expect(saveButton).toBeInTheDocument()
    })

    test('no toggle button exists to show/hide save UI', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: false,
        error: null,
        savePreset: jest.fn(),
        loadPreset: jest.fn(),
        deletePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      // The save button should exist and be the actual save button (not a toggle)
      const saveButton = screen.getByRole('button', { name: /save current as preset/i })
      expect(saveButton).toBeInTheDocument()
      
      // Key test: There should only be the close button and save button
      // (No separate "show save UI" toggle button)
      const buttons = screen.getAllByRole('button')
      const buttonTexts = buttons.map(btn => btn.textContent)
      
      // Should find the actual save button (not a toggle to show save UI)
      expect(buttonTexts).toContain('💾 Save Current as Preset')
      
      // Should have close button, save button, and import button
      expect(buttons.length).toBe(3) // Close (✕), Save (💾), Import
    })
  })

  describe('Streamlined Save Workflow', () => {
    test('user can immediately start typing preset name', async () => {
      const mockSavePreset = jest.fn().mockResolvedValue(true)
      
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: false,
        error: null,
        savePreset: mockSavePreset,
        loadPreset: jest.fn(),
        deletePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Preset name...')
      
      // User can immediately type without any preliminary clicks
      fireEvent.change(nameInput, { target: { value: 'My New Preset' } })
      
      expect(nameInput).toHaveValue('My New Preset')
    })

    test('user can save preset by pressing Enter', async () => {
      const mockSavePreset = jest.fn().mockResolvedValue(true)
      
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: false,
        error: null,
        savePreset: mockSavePreset,
        loadPreset: jest.fn(),
        deletePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Preset name...')
      
      // Type a name
      fireEvent.change(nameInput, { target: { value: 'Quick Save' } })
      
      // Press Enter to save
      fireEvent.keyDown(nameInput, { key: 'Enter' })
      
      await waitFor(() => {
        expect(mockSavePreset).toHaveBeenCalledWith('Quick Save')
      })
    })

    test('user can save preset by clicking save button', async () => {
      const mockSavePreset = jest.fn().mockResolvedValue(true)
      
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: false,
        error: null,
        savePreset: mockSavePreset,
        loadPreset: jest.fn(),
        deletePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Preset name...')
      const saveButton = screen.getByRole('button', { name: /save current as preset/i })
      
      // Type a name
      fireEvent.change(nameInput, { target: { value: 'Button Save' } })
      
      // Click save button
      fireEvent.click(saveButton)
      
      await waitFor(() => {
        expect(mockSavePreset).toHaveBeenCalledWith('Button Save')
      })
    })

    test('input field clears after successful save', async () => {
      const mockSavePreset = jest.fn().mockResolvedValue(true)
      
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: false,
        error: null,
        savePreset: mockSavePreset,
        loadPreset: jest.fn(),
        deletePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Preset name...')
      
      // Type and save
      fireEvent.change(nameInput, { target: { value: 'Clear After Save' } })
      fireEvent.keyDown(nameInput, { key: 'Enter' })
      
      // Input should be cleared after successful save
      await waitFor(() => {
        expect(nameInput).toHaveValue('')
      })
    })

    test('save input stays visible after saving for consecutive saves', async () => {
      const mockSavePreset = jest.fn().mockResolvedValue(true)
      
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: false,
        error: null,
        savePreset: mockSavePreset,
        loadPreset: jest.fn(),
        deletePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Preset name...')
      const saveButton = screen.getByRole('button', { name: /save current as preset/i })
      
      // Save first preset
      fireEvent.change(nameInput, { target: { value: 'First Preset' } })
      fireEvent.click(saveButton)
      
      await waitFor(() => {
        expect(mockSavePreset).toHaveBeenCalledWith('First Preset')
      })
      
      // Input and button should still be visible for next save
      expect(nameInput).toBeInTheDocument()
      expect(saveButton).toBeInTheDocument()
      
      // Save second preset immediately
      fireEvent.change(nameInput, { target: { value: 'Second Preset' } })
      fireEvent.click(saveButton)
      
      await waitFor(() => {
        expect(mockSavePreset).toHaveBeenCalledWith('Second Preset')
      })
    })
  })

  describe('Save Button State', () => {
    test('save button is disabled when input is empty', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: false,
        error: null,
        savePreset: jest.fn(),
        loadPreset: jest.fn(),
        deletePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const saveButton = screen.getByRole('button', { name: /save current as preset/i })
      
      // Should be disabled when input is empty
      expect(saveButton).toBeDisabled()
    })

    test('save button is enabled when input has text', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: false,
        error: null,
        savePreset: jest.fn(),
        loadPreset: jest.fn(),
        deletePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Preset name...')
      const saveButton = screen.getByRole('button', { name: /save current as preset/i })
      
      // Type some text
      fireEvent.change(nameInput, { target: { value: 'Valid Name' } })
      
      // Button should now be enabled
      expect(saveButton).not.toBeDisabled()
    })

    test('save button is disabled when loading', () => {
      mockUsePresetManager.mockReturnValue({
        presets: [],
        activePresetId: null,
        isLoading: true, // Loading state
        error: null,
        savePreset: jest.fn(),
        loadPreset: jest.fn(),
        deletePreset: jest.fn(),
        clearError: jest.fn(),
        exportPreset: jest.fn(),
        importPreset: jest.fn()
      })

      render(<FloatingPresetPanel {...defaultProps} />)

      const nameInput = screen.getByPlaceholderText('Preset name...')
      const saveButton = screen.getByRole('button', { name: /save current as preset/i })
      
      // Type text
      fireEvent.change(nameInput, { target: { value: 'Loading Test' } })
      
      // Button should still be disabled due to loading state
      expect(saveButton).toBeDisabled()
    })
  })
})