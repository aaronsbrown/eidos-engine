// AIDEV-NOTE: Integration tests for PatternGeneratorShowcase - Issue #12
import { render, screen } from '@testing-library/react'
import PatternGeneratorShowcase from './page'
import { ThemeProvider } from '@/lib/theme-context'

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
)

// Mock the mobile detection hook
const mockUseMobileDetection = jest.fn()
jest.mock('@/components/hooks/useMobileDetection', () => ({
  useMobileDetection: () => mockUseMobileDetection()
}))

// Mock the layout components to avoid complex rendering
jest.mock('@/components/mobile', () => ({
  MobileLayoutWrapper: () => <div data-testid="mobile-layout">Mobile Layout</div>
}))

jest.mock('@/components/desktop', () => ({
  DesktopLayout: () => <div data-testid="desktop-layout">Desktop Layout</div>
}))

describe('PatternGeneratorShowcase - Integration Tests', () => {
  beforeEach(() => {
    // Default to desktop
    mockUseMobileDetection.mockReturnValue({
      isMobile: false,
      isDesktop: true,
      viewport: { width: 1024, height: 768 }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Layout Selection Based on Device', () => {
    it('renders desktop layout when user is on desktop', () => {
      render(<PatternGeneratorShowcase />, { wrapper: TestWrapper })
      
      expect(screen.getByTestId('desktop-layout')).toBeInTheDocument()
      expect(screen.queryByTestId('mobile-layout')).not.toBeInTheDocument()
    })

    it('renders mobile layout when user is on mobile device', () => {
      mockUseMobileDetection.mockReturnValue({
        isMobile: true,
        isDesktop: false,
        viewport: { width: 375, height: 667 }
      })

      render(<PatternGeneratorShowcase />, { wrapper: TestWrapper })
      
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
      expect(screen.queryByTestId('desktop-layout')).not.toBeInTheDocument()
    })

    it('renders mobile layout when user is on tablet device (mobile-first approach)', () => {
      // AIDEV-NOTE: Updated for Issue #70 - tablets now use mobile layout 
      mockUseMobileDetection.mockReturnValue({
        isMobile: true,  // Tablets are now considered mobile (≤1023px)
        isDesktop: false,
        viewport: { width: 768, height: 1024 }
      })

      render(<PatternGeneratorShowcase />, { wrapper: TestWrapper })
      
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
      expect(screen.queryByTestId('desktop-layout')).not.toBeInTheDocument()
    })
  })

  describe('Theme Provider Integration', () => {
    it('provides theme context to child components', () => {
      render(<PatternGeneratorShowcase />, { wrapper: TestWrapper })
      
      // The component should render without theme-related errors
      expect(screen.getByTestId('desktop-layout')).toBeInTheDocument()
    })
  })

  describe('Device Detection Integration', () => {
    it('uses useMobileDetection hook for device detection', () => {
      render(<PatternGeneratorShowcase />, { wrapper: TestWrapper })
      
      expect(mockUseMobileDetection).toHaveBeenCalled()
    })

    it('responds to device type from hook', () => {
      // Test desktop
      render(<PatternGeneratorShowcase />, { wrapper: TestWrapper })
      expect(screen.getByTestId('desktop-layout')).toBeInTheDocument()

      // Test mobile (no need to unmount, just re-render)
      mockUseMobileDetection.mockReturnValue({
        isMobile: true,
        isDesktop: false,
        viewport: { width: 375, height: 667 }
      })

      render(<PatternGeneratorShowcase />, { wrapper: TestWrapper })
      expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
    })
  })
})