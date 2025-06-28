// AIDEV-NOTE: Basic TourManager for exploring Driver.js API and styling
import { driver, DriveStep, Config } from 'driver.js'
import { TourPreferencesManager } from './tour-preferences'

export interface TourStep {
  element: string
  popover: {
    title: string
    description: string
    side?: 'left' | 'right' | 'top' | 'bottom'
    align?: 'start' | 'center' | 'end'
  }
}

export interface TourConfig {
  steps: TourStep[]
  showProgress?: boolean
  allowClose?: boolean
  overlayClickNext?: boolean
}

export class TourManager {
  private driverInstance: ReturnType<typeof driver> | null = null

  constructor() {
    // AIDEV-NOTE: Will initialize with custom styling for technical aesthetic
  }

  startTour(config: TourConfig): void {
    const driverConfig: Config = {
      showProgress: config.showProgress ?? true,
      allowClose: config.allowClose ?? true,
      overlayClickNext: config.overlayClickNext ?? false,
      animate: true,
      smoothScroll: true,
      // AIDEV-NOTE: Custom styling options for technical blueprint aesthetic
      popoverClass: 'driver-popover-custom',
      progressText: '{{current}} of {{total}}',
      nextBtnText: 'NEXT',
      prevBtnText: 'PREV', 
      doneBtnText: 'DONE',
      // AIDEV-NOTE: Track tour completion and skipping
      onDestroyed: (element, step, options) => {
        if (options?.isLast) {
          // Tour completed
          TourPreferencesManager.markTourCompleted()
        } else {
          // Tour was skipped/closed early
          TourPreferencesManager.markTourSkipped()
        }
      },
      steps: config.steps.map(step => ({
        element: step.element,
        popover: {
          title: step.popover.title,
          description: step.popover.description,
          side: step.popover.side || 'bottom',
          align: step.popover.align || 'start',
        }
      }))
    }

    this.driverInstance = driver(driverConfig)
    this.driverInstance.drive()
  }

  destroy(): void {
    if (this.driverInstance) {
      this.driverInstance.destroy()
      this.driverInstance = null
    }
  }

  // AIDEV-NOTE: Check if tour should be shown based on user preferences
  static shouldShowTour(): boolean {
    return TourPreferencesManager.shouldShowTour()
  }

  // AIDEV-NOTE: Force reset tour preferences (for testing)
  static resetTourPreferences(): void {
    TourPreferencesManager.resetTourPreferences()
  }

  // AIDEV-NOTE: Basic mobile tour flow for testing 
  static getMobileTourConfig(): TourConfig {
    return {
      steps: [
        {
          element: '[data-testid="pattern-dropdown-selector"]',
          popover: {
            title: 'Pattern Selection',
            description: 'Choose from various generative patterns. Tap to see all available options.',
            side: 'bottom'
          }
        },
        {
          element: '[data-testid="progressive-disclosure-panel"]',
          popover: {
            title: 'Progressive Controls',
            description: 'Essential controls are always visible. Tap to expand and see advanced parameters.',
            side: 'top'
          }
        },
        {
          element: '[data-tour="mobile-learn-button"]',
          popover: {
            title: 'Educational Content',
            description: 'Access 3-tier learning approach: intuitive, conceptual, and mathematical explanations.',
            side: 'left'
          }
        }
      ],
      showProgress: true,
      allowClose: true,
      overlayClickNext: false
    }
  }

  // AIDEV-NOTE: Basic desktop tour flow for testing
  static getDesktopTourConfig(): TourConfig {
    return {
      steps: [
        {
          element: '[data-tour="pattern-selector"]',
          popover: {
            title: 'Pattern Selection',
            description: 'Choose from various generative patterns organized by category.',
            side: 'right'
          }
        },
        {
          element: '[data-tour="controls-panel"]',
          popover: {
            title: 'Real-time Controls',
            description: 'Adjust parameters to see immediate visual changes.',
            side: 'left'
          }
        },
        {
          element: '[data-tour="learn-button"]',
          popover: {
            title: 'Educational Content',
            description: 'Access 3-tier learning approach: intuitive, conceptual, and mathematical.',
            side: 'bottom'
          }
        },
        {
          element: '[data-tour="preset-dropdown"]',
          popover: {
            title: 'Preset Management',
            description: 'Save current settings with the bookmark button, load saved presets from the dropdown, or open the full preset manager for import/export functionality.',
            side: 'bottom'
          }
        }
      ],
      showProgress: true,
      allowClose: true,
      overlayClickNext: false
    }
  }
}