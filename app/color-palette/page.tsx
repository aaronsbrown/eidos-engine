import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function ColorPalettePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-mono uppercase tracking-wide mb-2">
            Color Palette Overview
          </h1>
          <p className="text-muted-foreground">
            Visual inspection of the new unified theming system
          </p>
        </div>

        {/* New Accent System */}
        <section className="space-y-4">
          <h2 className="text-xl font-mono uppercase tracking-wide border-b border-border pb-2">
            New Unified Accent System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-accent-primary rounded border border-border flex items-center justify-center">
                <span className="text-accent-primary-foreground font-mono text-sm">
                  accent-primary
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Main yellow accent (#FACC15)
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-16 bg-accent-primary-strong rounded border border-border flex items-center justify-center">
                <span className="text-accent-primary-foreground font-mono text-sm">
                  accent-primary-strong
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Strong emphasis (#EAB308)
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-16 bg-accent-primary-subtle rounded border border-border flex items-center justify-center">
                <span className="text-foreground font-mono text-sm">
                  accent-primary-subtle
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Light backgrounds (#FEFCE8)
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-16 bg-background rounded border border-border flex items-center justify-center">
                <span className="text-accent-primary-foreground font-mono text-sm">
                  accent-primary-foreground
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Text on yellow backgrounds
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Controls */}
        <section className="space-y-4">
          <h2 className="text-xl font-mono uppercase tracking-wide border-b border-border pb-2">
            Interactive Controls
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-mono uppercase tracking-wide">
                Slider Example (using new --control-thumb and --control-track)
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="50" 
                className="range-slider w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: 'var(--control-track)',
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-8 rounded border border-border flex items-center px-3">
                  <div className="w-4 h-4 rounded-full bg-accent-primary mr-2"></div>
                  <span className="text-sm font-mono">Control Thumb Color</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-8 rounded border border-border flex items-center px-3">
                  <div className="w-4 h-4 rounded-full bg-[var(--control-track)] mr-2"></div>
                  <span className="text-sm font-mono">Control Track Color</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Status Colors */}
        <section className="space-y-4">
          <h2 className="text-xl font-mono uppercase tracking-wide border-b border-border pb-2">
            Status Colors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-12 bg-background rounded border border-border flex items-center px-4">
                <span className="text-success-foreground font-mono text-sm uppercase tracking-wide">
                  ✓ Active / Success
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                success-foreground (green-600/400)
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-12 bg-destructive rounded border border-border flex items-center px-4">
                <span className="text-white font-mono text-sm uppercase tracking-wide">
                  ✗ Destructive / Error
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                destructive (existing)
              </p>
            </div>
          </div>
        </section>

        {/* Existing Design Tokens */}
        <section className="space-y-4">
          <h2 className="text-xl font-mono uppercase tracking-wide border-b border-border pb-2">
            Existing Design Tokens (Preserved)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-12 bg-background rounded border border-border flex items-center px-3">
                <span className="text-foreground font-mono text-sm">background / foreground</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-12 bg-muted rounded border border-border flex items-center px-3">
                <span className="text-muted-foreground font-mono text-sm">muted / muted-foreground</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-12 bg-card rounded border border-border flex items-center px-3">
                <span className="text-card-foreground font-mono text-sm">card / card-foreground</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-12 bg-primary rounded border border-border flex items-center px-3">
                <span className="text-primary-foreground font-mono text-sm">primary / primary-foreground</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-12 bg-secondary rounded border border-border flex items-center px-3">
                <span className="text-secondary-foreground font-mono text-sm">secondary / secondary-foreground</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-12 bg-accent rounded border border-border flex items-center px-3">
                <span className="text-accent-foreground font-mono text-sm">accent / accent-foreground</span>
              </div>
            </div>
          </div>
        </section>

        {/* Theme Toggle Demo */}
        <section className="space-y-4">
          <h2 className="text-xl font-mono uppercase tracking-wide border-b border-border pb-2">
            Theme Toggle Test
          </h2>
          <div className="bg-card rounded border border-border p-4">
            <p className="text-card-foreground font-mono text-sm mb-4">
              Toggle between light and dark mode to see all colors adapt automatically.
              The new accent system maintains the same yellow color in both themes.
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="bg-accent-primary text-accent-primary-foreground px-3 py-1 rounded font-mono text-sm">
                Primary Button
              </button>
              <button className="bg-accent-primary-strong text-accent-primary-foreground px-3 py-1 rounded font-mono text-sm">
                Strong Button
              </button>
              <button className="bg-accent-primary-subtle text-foreground px-3 py-1 rounded font-mono text-sm border border-border">
                Subtle Button
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}