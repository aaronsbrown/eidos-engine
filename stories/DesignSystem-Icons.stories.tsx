import type { Meta, StoryObj } from '@storybook/react'
import { 
  Bookmark,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  CheckIcon,
  Edit2,
  ExternalLink,
  Download,
  Menu,
  Search,
  X,
  // Suggested replacements for emoji icons
  GraduationCap,
  BookOpen,
  Sprout,
  Brain,
  Settings,
  ArrowUp,
  ArrowDown,
  Sun,
  Moon
} from 'lucide-react'

const meta: Meta = {
  title: 'Design System/Icon Inventory',
  parameters: {
    layout: 'padded',
  },
}

export default meta

// Icon specimen component
const IconSpecimen = ({ 
  icon: Icon, 
  name, 
  usage,
  locations,
  category = 'functional'
}: { 
  icon: React.ComponentType<any>
  name: string
  usage: string
  locations: string[]
  category?: 'functional' | 'navigation' | 'action' | 'status'
}) => (
  <div className="p-4 border border-border rounded-lg">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 flex items-center justify-center border border-border rounded bg-background">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-mono font-semibold text-sm">{name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          category === 'navigation' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
          category === 'action' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
          category === 'status' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        }`}>
          {category}
        </span>
      </div>
    </div>
    <p className="text-sm text-muted-foreground mb-2">{usage}</p>
    <div className="text-xs text-muted-foreground">
      <strong>Used in:</strong>
      <ul className="mt-1 space-y-0.5">
        {locations.map((location, idx) => (
          <li key={idx} className="font-mono">• {location}</li>
        ))}
      </ul>
    </div>
  </div>
)

// Emoji/Unicode icon specimen
const EmojiIconSpecimen = ({ 
  emoji, 
  name, 
  usage,
  locations
}: { 
  emoji: string
  name: string
  usage: string
  locations: string[]
}) => (
  <div className="p-4 border border-border rounded-lg">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 flex items-center justify-center border border-border rounded bg-background text-xl">
        {emoji}
      </div>
      <div>
        <h3 className="font-mono font-semibold text-sm">{name}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          emoji
        </span>
      </div>
    </div>
    <p className="text-sm text-muted-foreground mb-2">{usage}</p>
    <div className="text-xs text-muted-foreground">
      <strong>Used in:</strong>
      <ul className="mt-1 space-y-0.5">
        {locations.map((location, idx) => (
          <li key={idx} className="font-mono">• {location}</li>
        ))}
      </ul>
    </div>
  </div>
)

// Lucide React icons - Navigation
export const NavigationIcons: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">Navigation Icons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <IconSpecimen
            icon={ChevronDown}
            name="ChevronDown"
            usage="Collapse/expand indicators and dropdown arrows"
            locations={[
              'progressive-disclosure-panel.tsx',
              'collapsible-control-group.tsx', 
              'custom-select.tsx',
              'grouped-simulation-controls-panel.tsx',
              'semantic-data-table.tsx'
            ]}
            category="navigation"
          />
          <IconSpecimen
            icon={ChevronUp}
            name="ChevronUp"
            usage="Collapse/expand indicators (expanded state)"
            locations={[
              'progressive-disclosure-panel.tsx',
              'semantic-data-table.tsx'
            ]}
            category="navigation"
          />
          <IconSpecimen
            icon={ChevronRight}
            name="ChevronRight"
            usage="Table row expansion and dropdown navigation"
            locations={[
              'semantic-data-table.tsx',
              'pattern-dropdown-selector.tsx'
            ]}
            category="navigation"
          />
        </div>
      </div>
    </div>
  ),
}

// Action icons
export const ActionIcons: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">Action Icons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <IconSpecimen
            icon={Bookmark}
            name="Bookmark"
            usage="Quick save preset functionality"
            locations={['desktop-layout.tsx']}
            category="action"
          />
          <IconSpecimen
            icon={Edit2}
            name="Edit2"
            usage="Edit preset button"
            locations={['floating-preset-panel.tsx']}
            category="action"
          />
          <IconSpecimen
            icon={Download}
            name="Download"
            usage="Download functionality in data table"
            locations={['semantic-data-table.tsx']}
            category="action"
          />
          <IconSpecimen
            icon={Menu}
            name="Menu"
            usage="Mobile menu toggle button"
            locations={['mobile-header.tsx']}
            category="action"
          />
          <IconSpecimen
            icon={Search}
            name="Search"
            usage="Search functionality in pattern selector"
            locations={['pattern-dropdown-selector.tsx']}
            category="action"
          />
          <IconSpecimen
            icon={X}
            name="X"
            usage="Close buttons for overlays and modals"
            locations={['educational-overlay.tsx']}
            category="action"
          />
        </div>
      </div>
    </div>
  ),
}

// Status icons
export const StatusIcons: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">Status Icons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <IconSpecimen
            icon={CheckIcon}
            name="CheckIcon"
            usage="Checkbox component indicator"
            locations={['checkbox.tsx']}
            category="status"
          />
          <IconSpecimen
            icon={ExternalLink}
            name="ExternalLink"
            usage="External resource links in data table"
            locations={['semantic-data-table.tsx']}
            category="status"
          />
        </div>
      </div>
    </div>
  ),
}

// Current emoji icons that need replacing
export const EmojiIcons: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">🚨 Emoji Icons (Need Replacement)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          These emoji icons clash with the technical blueprint aesthetic and should be replaced with Lucide icons
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <EmojiIconSpecimen
            emoji="🎓"
            name="Graduation Cap"
            usage="Educational content header"
            locations={['educational-overlay.tsx']}
          />
          <EmojiIconSpecimen
            emoji="📚"
            name="Books"
            usage="Hide learning button"
            locations={['desktop-layout.tsx', 'progressive-disclosure-panel.tsx']}
          />
          <EmojiIconSpecimen
            emoji="🌱"
            name="Seedling"
            usage="Intuitive level indicator"
            locations={['educational-overlay.tsx']}
          />
          <EmojiIconSpecimen
            emoji="🧠"
            name="Brain"
            usage="Conceptual level indicator"
            locations={['educational-overlay.tsx']}
          />
          <EmojiIconSpecimen
            emoji="⚙️"
            name="Gear"
            usage="Technical level indicator"
            locations={['educational-overlay.tsx']}
          />
          <EmojiIconSpecimen
            emoji="↑"
            name="Up Arrow"
            usage="Previous pattern navigation"
            locations={['desktop-layout.tsx']}
          />
          <EmojiIconSpecimen
            emoji="↓"
            name="Down Arrow"
            usage="Next pattern navigation"
            locations={['desktop-layout.tsx']}
          />
          <EmojiIconSpecimen
            emoji="●"
            name="Filled Circle"
            usage="Dark mode indicator"
            locations={['theme-toggle.tsx']}
          />
          <EmojiIconSpecimen
            emoji="○"
            name="Empty Circle"
            usage="Light mode indicator"
            locations={['theme-toggle.tsx']}
          />
        </div>
      </div>
    </div>
  ),
}

// Suggested Lucide replacements
export const SuggestedReplacements: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">✨ Suggested Lucide Replacements</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Professional icons that match the technical blueprint aesthetic
        </p>
        
        <div className="space-y-4">
          {/* Educational content replacements */}
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-mono uppercase tracking-wide text-sm font-semibold mb-3 text-accent-primary">Educational Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎓</span>
                  <span className="text-sm font-mono text-muted-foreground">→</span>
                  <GraduationCap className="w-5 h-5 text-accent-primary" />
                </div>
                <div className="text-sm">
                  <div className="font-mono font-semibold">GraduationCap</div>
                  <div className="text-muted-foreground">Educational header</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  <span className="text-sm font-mono text-muted-foreground">→</span>
                  <BookOpen className="w-5 h-5 text-accent-primary" />
                </div>
                <div className="text-sm">
                  <div className="font-mono font-semibold">BookOpen</div>
                  <div className="text-muted-foreground">Hide learning button</div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning level replacements */}
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-mono uppercase tracking-wide text-sm font-semibold mb-3 text-accent-primary">Learning Levels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌱</span>
                  <span className="text-sm font-mono text-muted-foreground">→</span>
                  <Sprout className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-sm">
                  <div className="font-mono font-semibold">Sprout</div>
                  <div className="text-muted-foreground">Intuitive</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧠</span>
                  <span className="text-sm font-mono text-muted-foreground">→</span>
                  <Brain className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-sm">
                  <div className="font-mono font-semibold">Brain</div>
                  <div className="text-muted-foreground">Conceptual</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚙️</span>
                  <span className="text-sm font-mono text-muted-foreground">→</span>
                  <Settings className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-sm">
                  <div className="font-mono font-semibold">Settings</div>
                  <div className="text-muted-foreground">Technical</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation replacements */}
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-mono uppercase tracking-wide text-sm font-semibold mb-3 text-accent-primary">Navigation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xl">↑</span>
                  <span className="text-sm font-mono text-muted-foreground">→</span>
                  <ArrowUp className="w-5 h-5 text-accent-primary" />
                </div>
                <div className="text-sm">
                  <div className="font-mono font-semibold">ArrowUp</div>
                  <div className="text-muted-foreground">Previous pattern</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xl">↓</span>
                  <span className="text-sm font-mono text-muted-foreground">→</span>
                  <ArrowDown className="w-5 h-5 text-accent-primary" />
                </div>
                <div className="text-sm">
                  <div className="font-mono font-semibold">ArrowDown</div>
                  <div className="text-muted-foreground">Next pattern</div>
                </div>
              </div>
            </div>
          </div>

          {/* Theme toggle replacements */}
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-mono uppercase tracking-wide text-sm font-semibold mb-3 text-accent-primary">Theme Toggle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xl">○</span>
                  <span className="text-sm font-mono text-muted-foreground">→</span>
                  <Sun className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-sm">
                  <div className="font-mono font-semibold">Sun</div>
                  <div className="text-muted-foreground">Light mode</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xl">●</span>
                  <span className="text-sm font-mono text-muted-foreground">→</span>
                  <Moon className="w-5 h-5 text-slate-400" />
                </div>
                <div className="text-sm">
                  <div className="font-mono font-semibold">Moon</div>
                  <div className="text-muted-foreground">Dark mode</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Complete icon inventory
export const CompleteInventory: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold font-mono uppercase tracking-wide mb-2">
          Complete Icon Inventory
        </h1>
        <p className="text-muted-foreground font-mono">
          All icons currently used in the Pattern Generator System
        </p>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-border rounded-lg text-center">
          <div className="text-2xl font-bold text-accent-primary">11</div>
          <div className="text-sm font-mono uppercase tracking-wide text-muted-foreground">Lucide Icons</div>
        </div>
        <div className="p-4 border border-border rounded-lg text-center">
          <div className="text-2xl font-bold text-accent-primary">9</div>
          <div className="text-sm font-mono uppercase tracking-wide text-muted-foreground">Emoji Icons</div>
        </div>
        <div className="p-4 border border-border rounded-lg text-center">
          <div className="text-2xl font-bold text-accent-primary">1</div>
          <div className="text-sm font-mono uppercase tracking-wide text-muted-foreground">Icon Library</div>
        </div>
        <div className="p-4 border border-border rounded-lg text-center">
          <div className="text-2xl font-bold text-accent-primary">15</div>
          <div className="text-sm font-mono uppercase tracking-wide text-muted-foreground">Components</div>
        </div>
      </div>
      
      {/* Emoji Replacement Checklist */}
      <div className="p-6 border border-border rounded-lg bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4 text-red-700 dark:text-red-300">
          🚨 Emoji Replacement Checklist
        </h2>
        <div className="space-y-3">
          <div className="text-sm text-red-600 dark:text-red-400">
            <strong className="font-mono">These emoji icons clash with the technical blueprint aesthetic:</strong>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-mono">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>🎓 → GraduationCap (educational header)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>📚 → BookOpen (hide learning)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>🌱 → Sprout (intuitive level)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>🧠 → Brain (conceptual level)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>⚙️ → Settings (technical level)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>↑ → ArrowUp (previous pattern)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>↓ → ArrowDown (next pattern)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>○ → Sun (light mode)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>● → Moon (dark mode)</span>
            </label>
          </div>
          <div className="text-xs text-red-600 dark:text-red-400 mt-4">
            <strong>Files to update:</strong> educational-overlay.tsx, desktop-layout.tsx, progressive-disclosure-panel.tsx, theme-toggle.tsx
          </div>
        </div>
      </div>
      
      {/* Current Library Info */}
      <div className="p-6 border border-border rounded-lg">
        <h3 className="font-mono uppercase tracking-wide mb-4 text-sm font-semibold">Current Icon Library</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm">Library:</span>
            <code className="text-sm bg-muted px-2 py-1 rounded">lucide-react</code>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm">Version:</span>
            <code className="text-sm bg-muted px-2 py-1 rounded">^0.516.0</code>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm">Bundle Size:</span>
            <span className="text-sm text-muted-foreground">Tree-shakeable</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm">Icons Used:</span>
            <span className="text-sm text-accent-primary">11 / 1000+</span>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Icon sizing and variants
export const IconSizingVariants: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-mono uppercase tracking-wide mb-4">Icon Sizing & Variants</h2>
        
        <div className="space-y-6">
          {/* Standard sizes */}
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-mono uppercase tracking-wide text-sm font-semibold mb-3">Standard Sizes</h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <ChevronDown className="w-4 h-4 mx-auto mb-1" />
                <div className="text-xs font-mono">16px (w-4 h-4)</div>
              </div>
              <div className="text-center">
                <ChevronDown className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs font-mono">20px (w-5 h-5)</div>
              </div>
              <div className="text-center">
                <ChevronDown className="w-6 h-6 mx-auto mb-1" />
                <div className="text-xs font-mono">24px (w-6 h-6)</div>
              </div>
              <div className="text-center">
                <ChevronDown className="w-8 h-8 mx-auto mb-1" />
                <div className="text-xs font-mono">32px (w-8 h-8)</div>
              </div>
            </div>
          </div>
          
          {/* Interactive states */}
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-mono uppercase tracking-wide text-sm font-semibold mb-3">Interactive States</h3>
            <div className="flex items-center gap-4">
              <button className="p-2 border border-border rounded hover:bg-accent-primary/10 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 border border-border rounded bg-accent-primary text-accent-primary-foreground">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 border border-border rounded opacity-50 cursor-not-allowed">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs font-mono text-muted-foreground mt-2">
              Hover • Active • Disabled
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}