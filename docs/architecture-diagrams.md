# Architecture Diagrams

This document contains Mermaid diagrams that illustrate the system architecture and workflows of the Generative Pattern Showcase.

## System Architecture Overview

```mermaid
graph LR
    %% User Interface Layer
    subgraph "User Interface Layer"
        UI[Pattern Showcase UI]
        Controls[Dynamic Control Panel]
        Presets[Preset Manager]
    end
    
    %% Application Core
    subgraph "Application Core"
        Router[Next.js App Router]
        State[State Management]
        PM[Pattern Manager]
    end
    
    %% Plugin System
    subgraph "Plugin-Based Pattern System"
        PGI[PatternGeneratorProps Interface]
        
        subgraph "Pattern Generators"
            PG1[Lorenz Attractor]
            PG2[Noise Field]
            PG3[Particle System]
            PG4[Cellular Automaton]
            PGN[... More Patterns]
        end
    end
    
    %% Rendering Layer
    subgraph "Rendering Layer"
        subgraph "Canvas 2D Pipeline"
            C2D[Canvas 2D Context]
            C2DUtils[2D Utilities]
        end
        
        subgraph "WebGL Pipeline"
            WGL[WebGL Context]
            SL[Shader Loader]
            Shaders[(External Shaders<br/>vertex/*.vert<br/>fragment/*.frag)]
        end
    end
    
    %% Semantic Layer
    subgraph "Semantic Layer"
        SM[Semantic Metadata]
        PC[Pattern Categorization]
        PD[Platform Detection]
        PO[Performance Optimization]
    end
    
    %% Educational System
    subgraph "Educational System"
        EC[(Educational Content<br/>*.md files)]
        FP[(Factory Presets<br/>JSON)]
        EL[3-Layer Learning System]
    end
    
    %% Data Flow Connections
    UI --> Router
    Router --> State
    State --> PM
    PM --> PGI
    
    PGI --> PG1
    PGI --> PG2
    PGI --> PG3
    PGI --> PG4
    PGI --> PGN
    
    PG1 --> C2D
    PG2 --> C2D
    PG3 --> WGL
    PG4 --> C2D
    PGN --> WGL
    
    WGL --> SL
    SL --> Shaders
    
    SM --> PC
    SM --> PD
    SM --> PO
    PD --> Controls
    PO --> Controls
    
    PM --> SM
    Controls --> State
    Presets --> FP
    UI --> EC
    UI --> EL
    
    %% Styling
    classDef interface fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef plugin fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef rendering fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef semantic fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef educational fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    
    class PGI interface
    class PG1,PG2,PG3,PG4,PGN plugin
    class C2D,WGL,SL,Shaders rendering
    class SM,PC,PD,PO semantic
    class EC,FP,EL educational
```

## Quick Mermaid Learning Notes

**Basic Syntax:**
- `graph TB` = Top-to-Bottom flowchart
- `A --> B` = Arrow from A to B
- `A[Label]` = Rectangle node
- `A[(Database)]` = Cylinder/database shape
- `subgraph "Title"` = Grouped section

**Styling:**
- `classDef className fill:#color,stroke:#color` = Define style
- `class NodeName className` = Apply style to node

**Common Shapes:**
- `A[Rectangle]`
- `A(Rounded)`
- `A{Diamond}`
- `A[(Database)]`
- `A[[Subroutine]]`

**Tools to View Mermaid:**
- GitHub (renders automatically in .md files)
- Mermaid Live Editor: https://mermaid.live/
- VS Code Mermaid Preview extension
- Many documentation platforms support it natively

## Additional Diagrams (Coming Soon)

*Placeholder for future diagrams:*
- AI Development Workflow
- Pattern Generator Interface (Class Diagram)
- Golden Rules Decision Tree
- Semantic Layer Structure