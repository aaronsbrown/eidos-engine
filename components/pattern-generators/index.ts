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
  },
  {
    id: "brownian-motion",
    name: "Brownian Motion",
    component: BrownianMotionGenerator,
  },
]

export { BarcodeGenerator, FrequencySpectrumGenerator, NoiseFieldGenerator, PixelatedNoiseGenerator, BrownianMotionGenerator }
export type { PatternGenerator, PatternGeneratorProps } from "./types"
