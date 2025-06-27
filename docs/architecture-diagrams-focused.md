# Focused Architecture Diagrams

Clean, focused diagrams showing different aspects of the Generative Pattern Showcase architecture.

## 1. Core Application Flow

The main user interaction and pattern rendering pipeline:

```mermaid
graph LR
    User[👤 User] --> UI[Pattern Showcase UI]
    UI --> Controls[Control Panel]
    UI --> PatternList[Pattern Selection]
    
    PatternList --> Manager[Pattern Manager]
    Controls --> Manager
    
    Manager --> Interface[PatternGeneratorProps<br/>Interface]
    Interface --> Pattern[Selected Pattern<br/>Component]
    
    Pattern --> Renderer{Rendering<br/>Technology}
    Renderer -->|2D Patterns| Canvas[Canvas 2D]
    Renderer -->|3D/Particles| WebGL[WebGL + Shaders]
    
    Canvas --> Display[🖥️ Visual Output]
    WebGL --> Display
    
    classDef user fill:#e3f2fd,stroke:#1976d2
    classDef ui fill:#f3e5f5,stroke:#7b1fa2
    classDef core fill:#e8f5e8,stroke:#388e3c
    classDef render fill:#fff3e0,stroke:#f57c00
    
    class User user
    class UI,Controls,PatternList ui
    class Manager,Interface,Pattern core
    class Renderer,Canvas,WebGL,Display render
```

## 2. Plugin System Architecture

How new patterns integrate into the system:

```mermaid
graph TB
    Interface[PatternGeneratorProps Interface]
    Interface -->|implements| Lorenz[Lorenz Attractor]
    Interface -->|implements| Thomas[Thomas Attractor]  
    Interface -->|implements| Noise[Noise Field]
    Interface -->|implements| Particles[Particle System]
    Interface -->|implements| Others[Other Patterns]
    
    subgraph "Pattern Registry"
        Registry[Pattern Index & Loader]
    end
    
    subgraph "Pattern Requirements"
        Props[width, height, className]
        Controls[controls array]
        Callbacks[onControlChange]
    end
    
    subgraph "Pattern Capabilities"
        Canvas2D[Canvas 2D Rendering]
        WebGL[WebGL Rendering]
        RealTime[Real-time Updates]
    end
    
    Registry --> Interface
    
    Interface -.->|requires| Props
    Interface -.->|optional| Controls
    Interface -.->|optional| Callbacks
    
    Lorenz --> Canvas2D
    Thomas --> WebGL
    Noise --> Canvas2D
    Particles --> WebGL
    Others --> RealTime
    
    classDef interface fill:#e1f5fe,stroke:#01579b,stroke-width:3px
    classDef pattern fill:#f3e5f5,stroke:#4a148c
    classDef requirement fill:#fff8e1,stroke:#f57f17
    classDef capability fill:#e8f5e8,stroke:#2e7d32
    
    class Interface interface
    class Lorenz,Thomas,Noise,Particles,Others pattern
    class Registry,Props,Controls,Callbacks requirement
    class Canvas2D,WebGL,RealTime capability
```

## 3. Supporting Systems

The semantic layer, educational content, and optimization systems:

```mermaid
graph LR
    subgraph "Semantic Intelligence"
        Meta[Semantic Metadata]
        Meta --> Category[Pattern Categories]
        Meta --> Platform[Platform Detection]
        Meta --> Perf[Performance Profiles]
    end
    
    subgraph "Educational System"
        Learning[Learning Framework<br/>3-Layer System]
        Presets[Factory Presets<br/>Curated Examples]
    end
    
    subgraph "Pattern Definitions"
        PatternMeta[Pattern Metadata<br/>& Definitions]
    end
    
    subgraph "Optimization"
        Platform --> Defaults[Smart Defaults]
        Perf --> Warnings[Performance Warnings]
        Category --> Navigation[Smart Navigation]
    end
    
    PatternMeta -.->|provides metadata| Meta
    
    Core[Core Application] --> Meta
    Core --> Learning
    Core --> Presets
    
    Defaults --> UI[User Interface]
    Warnings --> UI
    Navigation --> UI
    
    classDef semantic fill:#fff3e0,stroke:#e65100
    classDef educational fill:#fce4ec,stroke:#880e4f  
    classDef optimization fill:#e0f2f1,stroke:#00695c
    classDef connection fill:#f5f5f5,stroke:#616161
    
    class Meta,Category,Platform,Perf semantic
    class Learning,Presets educational
    class PatternMeta connection
    class Defaults,Warnings,Navigation optimization
    class Core,UI connection
```

## 4. Data Flow Summary

High-level view of how data moves through the system:

```mermaid
graph TB
    Start[User Selects Pattern] --> Load[Load Pattern Metadata]
    Load --> Apply[Apply Platform Defaults]
    Apply --> Render[Render Pattern]
    Render --> Control[User Adjusts Controls]
    Control --> Update[Real-time Update]
    Update --> Render
    
    Load --> Check{Performance Intensive?}
    Check -->|Yes| Warn[Show Performance Warning]
    Check -->|No| Render
    Warn --> Render
    
    classDef process fill:#e3f2fd,stroke:#1976d2
    classDef decision fill:#fff3e0,stroke:#f57c00
    classDef action fill:#e8f5e8,stroke:#388e3c
    
    class Start,Load,Apply,Render,Control,Update process
    class Check decision
    class Warn action
```

## Benefits of This Approach

**Focused Diagrams:**
- Each diagram tells one clear story
- Easier to understand individual concepts
- Less visual clutter

**Scalable Documentation:**
- Can add new focused diagrams as needed
- Each diagram can evolve independently
- Better for presenting specific aspects to different audiences