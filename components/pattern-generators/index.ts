import BarcodeGenerator from "./barcode-generator"
import FrequencySpectrumGenerator from "./frequency-spectrum-generator"
import NoiseFieldGenerator from "./noise-field-generator"
import PixelatedNoiseGenerator from "./pixelated-noise-generator"
import BrownianMotionGenerator from "./brownian-motion-generator"
import type { PatternGenerator } from "./types"

export const patternGenerators: PatternGenerator[] = [
  {
    id: "barcode",
    name: "Barcode Scanner",
    component: BarcodeGenerator,
  },
  {
    id: "frequency",
    name: "Frequency Spectrum",
    component: FrequencySpectrumGenerator,
  },
  {
    id: "noise",
    name: "Noise Field",
    component: NoiseFieldGenerator,
  },
  {
    id: "pixelated-noise",
    name: "Pixelated Noise",
    component: PixelatedNoiseGenerator,
    controls: [
      {
        id: "pixelSize",
        label: "Pixel Size",
        type: "range",
        min: 2,
        max: 32,
        step: 1,
        defaultValue: 8,
      },
      {
        id: "noiseScale",
        label: "Noise Scale",
        type: "range",
        min: 0.01,
        max: 0.5,
        step: 0.01,
        defaultValue: 0.1,
      },
      {
        id: "animationSpeed",
        label: "Animation Speed",
        type: "range",
        min: 0.001,
        max: 0.1,
        step: 0.001,
        defaultValue: 0.02,
      },
      {
        id: "colorIntensity",
        label: "Color Intensity",
        type: "range",
        min: 0.1,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: "colorScheme",
        label: "Color Scheme",
        type: "select",
        defaultValue: "retro",
        options: [
          { value: "retro", label: "RETRO_PALETTE" },
          { value: "monochrome", label: "MONOCHROME" },
          { value: "cyan", label: "CYAN_MATRIX" },
          { value: "amber", label: "AMBER_TERMINAL" },
        ],
      },
    ],
  },
  {
    id: "brownian-motion",
    name: "Brownian Motion",
    component: BrownianMotionGenerator,
    controls: [
      {
        id: "particleCount",
        label: "Particle Count",
        type: "range",
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 12,
      },
      {
        id: "speed",
        label: "Speed",
        type: "range",
        min: 0.1,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: "brightness",
        label: "Brightness",
        type: "range",
        min: 0.5,
        max: 5.0,
        step: 0.1,
        defaultValue: 2.0,
      },
      {
        id: "trailLength",
        label: "Trail Length",
        type: "range",
        min: 2,
        max: 15,
        step: 1,
        defaultValue: 8,
      },
      {
        id: "jitterAmount",
        label: "Brownian Jitter",
        type: "range",
        min: 0.01,
        max: 0.2,
        step: 0.01,
        defaultValue: 0.05,
      },
    ],
  },
]

export { BarcodeGenerator, FrequencySpectrumGenerator, NoiseFieldGenerator, PixelatedNoiseGenerator, BrownianMotionGenerator }
export type { PatternGenerator, PatternGeneratorProps } from "./types"
