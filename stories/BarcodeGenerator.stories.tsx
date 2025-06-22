import type { Meta, StoryObj } from '@storybook/react'
import BarcodeGenerator from '@/components/pattern-generators/barcode-generator'

const meta: Meta<typeof BarcodeGenerator> = {
  title: 'Pattern Generators/Barcode Generator',
  component: BarcodeGenerator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'range', min: 200, max: 800, step: 50 },
    },
    height: {
      control: { type: 'range', min: 100, max: 400, step: 25 },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default barcode
export const Default: Story = {
  args: {
    width: 400,
    height: 200,
    controlValues: {
      scrollSpeed: 2,
      barDensity: 0.6,
      scannerSpeed: 2,
      scannerOpacity: 0.6,
      colorScheme: 'classic',
      showScanner: true,
    },
  },
}

// Interactive controls - demonstrates parameter adjustment
export const Interactive: Story = {
  args: {
    width: 500,
    height: 250,
    controlValues: {
      scrollSpeed: 3,
      barDensity: 0.7,
      scannerSpeed: 2.5,
      scannerOpacity: 0.8,
      colorScheme: 'classic',
      showScanner: true,
    },
  },
}

// Different color schemes showcase
export const ColorSchemes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <h3 className="text-sm font-mono mb-2">CLASSIC</h3>
        <BarcodeGenerator
          width={250}
          height={150}
          controlValues={{
            scrollSpeed: 1,
            barDensity: 0.7,
            scannerSpeed: 1.5,
            scannerOpacity: 0.5,
            colorScheme: 'classic',
            showScanner: true,
          }}
        />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-mono mb-2">INVERTED</h3>
        <BarcodeGenerator
          width={250}
          height={150}
          controlValues={{
            scrollSpeed: 1,
            barDensity: 0.7,
            scannerSpeed: 1.5,
            scannerOpacity: 0.5,
            colorScheme: 'inverted',
            showScanner: true,
          }}
        />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-mono mb-2">BLUE</h3>
        <BarcodeGenerator
          width={250}
          height={150}
          controlValues={{
            scrollSpeed: 1,
            barDensity: 0.7,
            scannerSpeed: 1.5,
            scannerOpacity: 0.5,
            colorScheme: 'blue',
            showScanner: true,
          }}
        />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-mono mb-2">AMBER</h3>
        <BarcodeGenerator
          width={250}
          height={150}
          controlValues={{
            scrollSpeed: 1,
            barDensity: 0.7,
            scannerSpeed: 1.5,
            scannerOpacity: 0.5,
            colorScheme: 'amber',
            showScanner: true,
          }}
        />
      </div>
    </div>
  ),
}

// Performance test - no scanner for better performance
export const HighPerformance: Story = {
  args: {
    width: 600,
    height: 300,
    controlValues: {
      scrollSpeed: 5,
      barDensity: 0.8,
      scannerSpeed: 0,
      scannerOpacity: 0,
      colorScheme: 'classic',
      showScanner: false,
    },
  },
}