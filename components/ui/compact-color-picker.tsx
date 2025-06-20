"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { HexColorPicker } from "react-colorful"

interface CompactColorPickerProps {
  value: string
  onChange: (color: string) => void
  label: string
}

export default function CompactColorPicker({ value, onChange, label }: CompactColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localColor, setLocalColor] = useState(value)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced onChange to prevent rapid updates
  const handleColorChange = useCallback((newColor: string) => {
    setLocalColor(newColor)
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Set new timeout to update parent after delay
    timeoutRef.current = setTimeout(() => {
      onChange(newColor)
    }, 50) // 50ms debounce
  }, [onChange])

  // Sync local color when prop changes (from external sources)
  useEffect(() => {
    setLocalColor(value)
  }, [value])

  return (
    <div className="flex flex-col h-full">
      <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase">{label}</label>
      <div className="flex-1 flex flex-col justify-center relative">
        {/* Color preview button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-8 border-2 border-yellow-400/20 rounded cursor-pointer relative"
          style={{ backgroundColor: localColor }}
        >
          <div className="absolute inset-0 border-2 border-yellow-400/20 rounded pointer-events-none"></div>
        </button>
        
        {/* Dropdown color picker */}
        {isOpen && (
          <>
            {/* Backdrop to close picker */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            {/* Color picker popup */}
            <div className="absolute top-full left-0 z-50 mt-2 p-3 bg-background border-2 border-yellow-400/20 rounded shadow-lg">
              <div className="[&_.react-colorful]:!w-32 [&_.react-colorful]:!h-32 [&_.react-colorful\_\_saturation]:!rounded [&_.react-colorful\_\_hue]:!rounded [&_.react-colorful\_\_pointer]:!border-2 [&_.react-colorful\_\_pointer]:!border-yellow-400">
                <HexColorPicker 
                  color={localColor} 
                  onChange={handleColorChange}
                />
              </div>
              <div className="mt-2 text-xs font-mono text-center text-muted-foreground">
                {localColor.toUpperCase()}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="text-xs font-mono text-muted-foreground mt-1 text-center uppercase">
        {localColor.toUpperCase()}
      </div>
    </div>
  )
}