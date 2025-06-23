import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ThemeProvider } from '@/lib/theme-context'

// Mock theme context for stories
const MockThemeProvider = ({ 
  children, 
  initialTheme = 'light' 
}: { 
  children: React.ReactNode
  initialTheme?: 'light' | 'dark'
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme)
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    // Apply theme class for visual feedback in Storybook
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }
  
  // Mock the theme context
  const contextValue = {
    theme,
    setTheme,
    toggleTheme
  }
  
  return (
    <div className={theme}>
      {/* Mock provider implementation */}
      <div style={{ 
        minHeight: '200px',
        padding: '20px',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#000000',
        borderRadius: '8px',
        border: `1px solid ${theme === 'dark' ? '#333' : '#e5e5e5'}`
      }}>
        <div style={{ marginBottom: '16px', fontSize: '14px', opacity: 0.7 }}>
          Current theme: <strong>{theme}</strong>
        </div>
{children}
      </div>
    </div>
  )
}

const meta: Meta<typeof ThemeToggle> = {
  title: 'UI Components/Theme Toggle',
  component: ThemeToggle,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Theme toggle button with technical aesthetic. Switches between light and dark modes with visual indicators and proper accessibility.'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockThemeProvider>
        <Story />
      </MockThemeProvider>
    )
  ]
}

export default meta
type Story = StoryObj<typeof meta>

// Default light theme
export const LightTheme: Story = {
  decorators: [
    (Story) => (
      <MockThemeProvider initialTheme="light">
        <Story />
      </MockThemeProvider>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Theme toggle in light mode. Shows "DARK_MODE" button with empty circle indicator.'
      }
    }
  }
}

// Default dark theme
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <MockThemeProvider initialTheme="dark">
        <Story />
      </MockThemeProvider>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Theme toggle in dark mode. Shows "LIGHT_MODE" button with filled circle indicator.'
      }
    }
  }
}

// Interactive theme switching
export const Interactive: Story = {
  render: () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [clickCount, setClickCount] = useState(0)
    
    const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light'
      setTheme(newTheme)
      setClickCount(prev => prev + 1)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
    
    return (
      <div className={theme}>
        <div style={{ 
          minHeight: '300px',
          padding: '24px',
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          color: theme === 'dark' ? '#ffffff' : '#000000',
          borderRadius: '8px',
          border: `1px solid ${theme === 'dark' ? '#333' : '#e5e5e5'}`,
          fontFamily: 'monospace'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Interactive Theme Demo</h3>
            <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '8px' }}>
              Current theme: <strong>{theme}</strong>
            </div>
            <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '16px' }}>
              Toggle count: <strong>{clickCount}</strong>
            </div>
          </div>
          
          {/* Mock ThemeToggle with manual state */}
          <button
            onClick={toggleTheme}
            className="font-mono text-xs relative group border rounded px-3 py-2"
            style={{
              backgroundColor: 'transparent',
              borderColor: theme === 'dark' ? '#555' : '#ccc',
              color: 'inherit'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: theme === 'dark' ? '#facc15' : '#666',
                  borderRadius: '50%'
                }}
              />
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {theme === 'dark' ? 'LIGHT_MODE' : 'DARK_MODE'}
              </span>
              <div style={{ color: theme === 'dark' ? '#aaa' : '#666' }}>
                [{theme === 'dark' ? '●' : '○'}]
              </div>
            </div>
          </button>
          
          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f5f5f5',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            <div>Theme changes are reflected in:</div>
            <ul style={{ marginTop: '8px', paddingLeft: '16px' }}>
              <li>Background colors</li>
              <li>Text colors</li>
              <li>Border colors</li>
              <li>Accent indicators</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive theme toggle demonstration showing real-time theme changes and click tracking.'
      }
    }
  }
}

// Theme states comparison
export const ThemeComparison: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      {/* Light theme side */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#ffffff',
        color: '#000000',
        borderRadius: '8px',
        border: '1px solid #e5e5e5'
      }}>
        <h4 style={{ fontSize: '14px', marginBottom: '16px', fontFamily: 'monospace' }}>
          LIGHT THEME
        </h4>
        <button
          className="font-mono text-xs relative group border rounded px-3 py-2"
          style={{
            backgroundColor: 'transparent',
            borderColor: '#ccc',
            color: '#000000'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#666',
                borderRadius: '50%'
              }}
            />
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              DARK_MODE
            </span>
            <div style={{ color: '#666' }}>
              [○]
            </div>
          </div>
        </button>
        <div style={{ 
          marginTop: '16px', 
          fontSize: '12px', 
          fontFamily: 'monospace',
          opacity: 0.7 
        }}>
          • Empty circle indicator<br/>
          • Shows "DARK_MODE"<br/>
          • Light backgrounds
        </div>
      </div>
      
      {/* Dark theme side */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #333'
      }}>
        <h4 style={{ fontSize: '14px', marginBottom: '16px', fontFamily: 'monospace' }}>
          DARK THEME
        </h4>
        <button
          className="font-mono text-xs relative group border rounded px-3 py-2"
          style={{
            backgroundColor: 'transparent',
            borderColor: '#555',
            color: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#facc15',
                borderRadius: '50%'
              }}
            />
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              LIGHT_MODE
            </span>
            <div style={{ color: '#aaa' }}>
              [●]
            </div>
          </div>
        </button>
        <div style={{ 
          marginTop: '16px', 
          fontSize: '12px', 
          fontFamily: 'monospace',
          opacity: 0.7 
        }}>
          • Filled circle indicator<br/>
          • Shows "LIGHT_MODE"<br/>
          • Dark backgrounds
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of theme toggle appearance in both light and dark modes.'
      }
    }
  }
}

// Accessibility and keyboard navigation
export const AccessibilityDemo: Story = {
  render: () => (
    <div style={{ 
      padding: '24px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Accessibility Features</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <ThemeToggle />
      </div>
      
      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
        <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Keyboard Support:</h4>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          <li>Tab to focus the button</li>
          <li>Space or Enter to toggle theme</li>
          <li>Visual focus indicators</li>
        </ul>
        
        <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Screen Reader Support:</h4>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          <li>Descriptive button text</li>
          <li>Clear state indication</li>
          <li>Proper semantic markup</li>
        </ul>
        
        <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Visual Indicators:</h4>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Color-coded status dot</li>
          <li>Text label changes</li>
          <li>Symbol state indicators [○/●]</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features including keyboard navigation, focus management, and screen reader support.'
      }
    }
  }
}

// Multiple toggles (layout testing)
export const MultipleToggles: Story = {
  render: () => (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e5e5e5'
    }}>
      <h3 style={{ fontSize: '16px', marginBottom: '16px', fontFamily: 'monospace' }}>
        Multiple Theme Toggles
      </h3>
      <p style={{ fontSize: '14px', marginBottom: '20px', opacity: 0.7 }}>
        Tests layout with multiple toggle instances
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div>
          <div style={{ fontSize: '12px', marginBottom: '8px', opacity: 0.6 }}>
            Primary Toggle
          </div>
          <ThemeToggle />
        </div>
        
        <div>
          <div style={{ fontSize: '12px', marginBottom: '8px', opacity: 0.6 }}>
            Secondary Toggle
          </div>
          <ThemeToggle />
        </div>
        
        <div>
          <div style={{ fontSize: '12px', marginBottom: '8px', opacity: 0.6 }}>
            Tertiary Toggle
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        fontSize: '12px', 
        fontFamily: 'monospace',
        opacity: 0.6 
      }}>
        Note: All toggles share the same theme context and will update together
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple theme toggle instances to test layout and synchronization behavior.'
      }
    }
  }
}