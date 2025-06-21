'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string | number
  label: string
}

interface CustomSelectProps {
  id?: string
  value: string | number
  options: SelectOption[]
  onChange: (value: string | number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

// AIDEV-NOTE: Replaced custom dropdown with native HTML select for proper mobile overlay behavior
export default function CustomSelect({
  id,
  value,
  options,
  onChange,
  placeholder = 'Select option...',
  disabled = false,
  className = ''
}: CustomSelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value
    // Convert back to number if the original value was a number
    const convertedValue = typeof options[0]?.value === 'number' ? Number(newValue) : newValue
    onChange(convertedValue)
  }

  return (
    <div className={`relative mt-2 ${className}`}>
      {/* Native Select with Custom Styling */}
      <select
        id={id}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full min-h-[44px] bg-background border border-border rounded-md px-4 py-2 text-left font-mono text-xs focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed hover:border-muted-foreground transition-colors touch-manipulation appearance-none cursor-pointer text-foreground pr-10"
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom Chevron Icon */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}