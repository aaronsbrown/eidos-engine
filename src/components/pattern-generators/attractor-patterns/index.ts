import LorenzAttractorGenerator from "../lorenz-attractor-generator"
import ThomasAttractorGenerator from "../thomas-attractor-generator"
import AizawaAttractorGenerator from "../aizawa-attractor-generator"
import HalvorsenAttractorGenerator from "../halvorsen-attractor-generator"
import NewtonLeipnikAttractorGenerator from "../newton-leipnik-attractor-generator"
import type { RichPatternGeneratorDefinition } from "@/lib/semantic-types"

// AIDEV-NOTE: Extracted from main index.ts for better maintainability and context window usage
// AIDEV-NOTE: Contains all strange attractor generators with rich semantic metadata and 3D visualizations
export const attractorPatterns: RichPatternGeneratorDefinition[] = [
  {
    id: "lorenz-attractor",
    name: "Lorenz Attractor",
    component: LorenzAttractorGenerator,
    technology: 'WEBGL_MESHES',
    category: 'Attractors',
    schemaVersion: "1.0",
    description: "A classic strange attractor that exhibits chaotic behavior, rendered in interactive 3D space with camera controls and enhanced visual effects.",
    longDescription: "The Lorenz Attractor is a system of three ordinary differential equations that results in chaotic, non-repeating, yet deterministic motion. This 3D visualization renders particles in true spatial depth with interactive camera controls, optional coordinate axes, and depth-based visual enhancements.",
    semantics: {
      primaryAlgorithmFamily: "StrangeAttractor",
      keyMathematicalConcepts: ["ChaosTheory", "Calculus", "LinearAlgebra"],
      visualCharacteristics: ["Flowing", "Chaotic", "Organic", "Complex", "Luminous", "Smooth", "Continuous"],
      dimensionality: "True3D_WebGL",
      interactionStyle: "DirectManipulation",
      keywords: ["lorenz", "butterfly effect", "dynamical system", "chaos", "3d", "webgl", "camera", "depth", "interactive", "spatial"]
    },
    performance: {
      computationalComplexity: "Medium",
      typicalFrameRateTarget: "60fps",
      notes: "Performance dependent on particle count and 3D rendering complexity. Mobile devices benefit from reduced particle counts and basic rendering mode."
    },
    version: "1.1.0",
    author: "Aaron Brown & Gemini",
    dateAdded: "2025-06-25",
    lastModified: "2025-06-27",
    status: "Production",
    isInteractive: true,
    isAnimatedByDefault: true,
    controls: [
        {
            id: "sigma",
            label: "Sigma",
            type: "range",
            min: 1,
            max: 20,
            step: 0.1,
            defaultValue: 10,
            description: "The Prandtl number, affecting the shape and stability of the attractor.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Lorenz Parameters"
        },
        {
            id: "rho",
            label: "Rho",
            type: "range",
            min: 1,
            max: 50,
            step: 0.1,
            defaultValue: 28,
            description: "The Rayleigh number, a key parameter for inducing chaotic behavior.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Lorenz Parameters"
        },
        {
            id: "beta",
            label: "Beta",
            type: "range",
            min: 1,
            max: 5,
            step: 0.1,
            defaultValue: 8 / 3,
            description: "A geometric parameter of the system.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Lorenz Parameters"
        },
        {
            id: "speed",
            label: "Animation Speed",
            type: "range",
            min: 0.1,
            max: 3.0,
            step: 0.1,
            defaultValue: 0.3,
            description: "Animation speed multiplier for the dynamical evolution.",
            role: "AnimationBehavior",
            impactsPerformance: "Minor",
            group: "Animation"
        },
        {
            id: "particleCount",
            label: "Particle Count",
            type: "range",
            min: 100,
            max: 5000,
            step: 100,
            defaultValue: 2500,
            description: "Number of particles to trace the attractor's path.",
            role: "PerformanceTuning",
            impactsPerformance: "Significant",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: 500,
                    desktop: 2500,
                    rationale: "High particle counts significantly impact performance on mobile devices."
                }
            },
            group: "Simulation Parameters"
        },
        {
            id: "particleSize",
            label: "Particle Size",
            type: "range",
            min: 0.01,
            max: 0.04,
            step: 0.005,
            defaultValue: 0.03,
            description: "Size of individual particles - larger particles create more visible trails.",
            role: "VisualAesthetic",
            impactsPerformance: "Minor",
            group: "Visual Effects"
        },
        {
            id: "autoRotate",
            label: "Auto Rotate",
            type: "checkbox",
            defaultValue: false,
            description: "Automatically rotate the camera around the Y-axis for a cinematic view of the attractor.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Camera Behavior"
        },
        {
            id: "autoRotateSpeed",
            label: "Rotation Speed",
            type: "range",
            min: 0.1,
            max: 3.0,
            step: 0.1,
            defaultValue: 1.0,
            description: "Speed of automatic camera rotation - higher values create faster rotation.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Camera Behavior"
        },
        {
            id: "useCustomShader",
            label: "Enhanced Rendering",
            type: "checkbox",
            defaultValue: false,
            description: "Enable advanced shader-based rendering with depth-based coloring and improved visual quality.",
            role: "VisualAesthetic",
            impactsPerformance: "Minor",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: true,
                    rationale: "Custom shaders provide enhanced visual quality on desktop but may impact mobile GPU performance."
                }
            }
        },
        {
            id: "colorScheme",
            label: "Color Scheme",
            type: "select",
            defaultValue: 1,
            options: [
                { value: 0, label: "Rainbow Depth" },
                { value: 1, label: "Warm-Cool" },
                { value: 2, label: "Monochrome" }
            ],
            description: "Color scheme for depth-based particle coloring - creates natural depth perception.",
            role: "VisualAesthetic",
            impactsPerformance: "Negligible",
            group: "Visual Effects"
        },
        {
            id: "depthFading",
            label: "Depth Fading",
            type: "checkbox",
            defaultValue: false,
            description: "Fade distant particles for enhanced depth perception and focus on the attractor's core structure.",
            role: "VisualAesthetic",
            impactsPerformance: "Negligible",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: false,
                    rationale: "Depth fading can be enabled for enhanced depth perception but is disabled by default for clearer particle visibility."
                }
            }
        },
        {
            id: "showAxes",
            label: "Show Coordinate Axes",
            type: "checkbox",
            defaultValue: false,
            description: "Display 3D coordinate axes to provide spatial reference and help understand the mathematical space.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: true,
                    rationale: "Coordinate axes help with spatial understanding on larger screens but may clutter mobile displays."
                }
            }
        }
    ]
  },
  {
    id: "thomas-attractor",
    name: "Thomas Attractor",
    component: ThomasAttractorGenerator,
    technology: 'WEBGL_MESHES',
    category: 'Attractors',
    schemaVersion: "1.0",
    description: "A cyclically symmetric strange attractor with elegant sinusoidal dynamics, rendered in interactive 3D space with enhanced visual effects.",
    longDescription: "The Thomas Attractor is a 3D dynamical system described by simple sinusoidal equations with cyclic symmetry. It exhibits rich chaotic behavior controlled by a single damping parameter, visualized with true spatial depth and interactive camera controls.",
    semantics: {
      primaryAlgorithmFamily: "StrangeAttractor",
      keyMathematicalConcepts: ["ChaosTheory", "Calculus", "Trigonometry", "LinearAlgebra"],
      visualCharacteristics: ["Flowing", "Chaotic", "Continuous", "Symmetrical", "Luminous", "Smooth"],
      dimensionality: "True3D_WebGL",
      interactionStyle: "DirectManipulation",
      keywords: ["thomas", "cyclic symmetry", "sinusoidal", "strange attractor", "3d", "webgl", "interactive", "spatial"]
    },
    performance: {
      computationalComplexity: "Medium",
      typicalFrameRateTarget: "60fps",
      notes: "Performance dependent on particle count and 3D rendering complexity. Sinusoidal calculations are efficient but 3D rendering benefits from GPU acceleration."
    },
    version: "1.0.0",
    author: "Aaron Brown & Claude",
    dateAdded: "2025-06-27",
    lastModified: "2025-06-27",
    status: "Production",
    isInteractive: true,
    isAnimatedByDefault: true,
    controls: [
        {
            id: "b",
            label: "Damping (b)",
            type: "range",
            min: 0.1,
            max: 0.5,
            step: 0.01,
            defaultValue: 0.208,
            description: "Damping parameter controlling chaotic behavior. Lower values increase chaos and complexity.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Thomas Parameters"
        },
        {
            id: "speed",
            label: "Animation Speed",
            type: "range",
            min: 0.1,
            max: 3.0,
            step: 0.1,
            defaultValue: 2.0,
            description: "Animation speed multiplier for the dynamical evolution.",
            role: "AnimationBehavior",
            impactsPerformance: "Minor",
            group: "Animation"
        },
        {
            id: "particleCount",
            label: "Particle Count",
            type: "range",
            min: 100,
            max: 5000,
            step: 100,
            defaultValue: 2500,
            description: "Number of particles to trace the attractor's path.",
            role: "PerformanceTuning",
            impactsPerformance: "Significant",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: 500,
                    desktop: 2500,
                    rationale: "High particle counts significantly impact performance on mobile devices."
                }
            },
            group: "Simulation Parameters"
        },
        {
            id: "particleSize",
            label: "Particle Size",
            type: "range",
            min: 0.01,
            max: 0.1,
            step: 0.005,
            defaultValue: 0.04,
            description: "Size of individual particles - larger particles create more visible trails.",
            role: "VisualAesthetic",
            impactsPerformance: "Minor",
            group: "Visual Effects"
        },
        {
            id: "autoRotate",
            label: "Auto Rotate",
            type: "checkbox",
            defaultValue: false,
            description: "Automatically rotate the camera around the Y-axis for a cinematic view of the attractor.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Camera Behavior"
        },
        {
            id: "autoRotateSpeed",
            label: "Rotation Speed",
            type: "range",
            min: 0.1,
            max: 3.0,
            step: 0.1,
            defaultValue: 1.0,
            description: "Speed of automatic camera rotation - higher values create faster rotation.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Camera Behavior"
        },
        {
            id: "useCustomShader",
            label: "Enhanced Rendering",
            type: "checkbox",
            defaultValue: false,
            description: "Enable advanced shader-based rendering with cyclic symmetry-based coloring and improved visual quality.",
            role: "VisualAesthetic",
            impactsPerformance: "Minor",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: true,
                    rationale: "Custom shaders provide enhanced visual quality on desktop but may impact mobile GPU performance."
                }
            }
        },
        {
            id: "colorScheme",
            label: "Color Scheme",
            type: "select",
            defaultValue: 1,
            options: [
                { value: 0, label: "Rainbow Depth" },
                { value: 1, label: "Warm-Cool" },
                { value: 2, label: "Cyclic Symmetry" }
            ],
            description: "Color scheme for depth and symmetry-based particle coloring - highlights mathematical properties.",
            role: "VisualAesthetic",
            impactsPerformance: "Negligible",
            group: "Visual Effects"
        },
        {
            id: "depthFading",
            label: "Depth Fading",
            type: "checkbox",
            defaultValue: false,
            description: "Fade distant particles for enhanced depth perception and focus on the attractor's core structure.",
            role: "VisualAesthetic",
            impactsPerformance: "Negligible",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: false,
                    rationale: "Depth fading can be enabled for enhanced depth perception but is disabled by default for clearer particle visibility."
                }
            }
        },
        {
            id: "showAxes",
            label: "Show Coordinate Axes",
            type: "checkbox",
            defaultValue: false,
            description: "Display 3D coordinate axes to provide spatial reference and understand the cyclic symmetry.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: true,
                    rationale: "Coordinate axes help with spatial understanding on larger screens but may clutter mobile displays."
                }
            }
        }
    ]
  },
  {
    id: "aizawa-attractor",
    name: "Aizawa Attractor",
    component: AizawaAttractorGenerator,
    technology: 'WEBGL_MESHES',
    category: 'Attractors',
    schemaVersion: "1.0",
    description: "A complex strange attractor with six parameters that creates intricate chaotic patterns in 3D space.",
    longDescription: "The Aizawa Attractor is a sophisticated dynamical system with six tunable parameters, creating highly complex and beautiful chaotic patterns. This 3D visualization allows exploration of the rich parameter space and its effect on the attractor's structure.",
    semantics: {
      primaryAlgorithmFamily: "StrangeAttractor",
      keyMathematicalConcepts: ["ChaosTheory", "Calculus", "LinearAlgebra"],
      visualCharacteristics: ["Flowing", "Chaotic", "Complex", "Organic", "Luminous", "Smooth", "Continuous"],
      dimensionality: "True3D_WebGL",
      interactionStyle: "DirectManipulation",
      keywords: ["aizawa", "strange attractor", "dynamical system", "chaos", "3d", "webgl", "parametric", "nonlinear"]
    },
    performance: {
      computationalComplexity: "Medium",
      typicalFrameRateTarget: "60fps",
      notes: "Performance dependent on particle count and 3D rendering complexity. Six-parameter system requires more computation than simpler attractors."
    },
    version: "1.0.0",
    author: "Aaron Brown & Claude",
    dateAdded: "2025-06-27",
    lastModified: "2025-06-27",
    status: "Production",
    isInteractive: true,
    isAnimatedByDefault: true,
    relatedPatterns: ["lorenz-attractor", "thomas-attractor"],
    controls: [
        {
            id: "a",
            label: "Parameter A",
            type: "range",
            min: 0.1,
            max: 2.0,
            step: 0.05,
            defaultValue: 0.95,
            description: "First Aizawa parameter - affects the overall structure and stability of the attractor.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Aizawa Parameters"
        },
        {
            id: "b",
            label: "Parameter B",
            type: "range",
            min: 0.1,
            max: 2.0,
            step: 0.05,
            defaultValue: 0.7,
            description: "Second Aizawa parameter - controls the vertical dynamics of the system.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Aizawa Parameters"
        },
        {
            id: "c",
            label: "Parameter C",
            type: "range",
            min: 0.1,
            max: 2.0,
            step: 0.05,
            defaultValue: 0.6,
            description: "Third Aizawa parameter - influences the nonlinear coupling strength.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Aizawa Parameters"
        },
        {
            id: "d",
            label: "Parameter D",
            type: "range",
            min: 1.0,
            max: 5.0,
            step: 0.1,
            defaultValue: 3.5,
            description: "Fourth Aizawa parameter - controls the rotation and mixing in the xy-plane.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Aizawa Parameters"
        },
        {
            id: "e",
            label: "Parameter E",
            type: "range",
            min: 0.1,
            max: 1.0,
            step: 0.05,
            defaultValue: 0.25,
            description: "Fifth Aizawa parameter - affects the coupling between horizontal and vertical motion.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Aizawa Parameters"
        },
        {
            id: "f",
            label: "Parameter F",
            type: "range",
            min: 0.01,
            max: 0.5,
            step: 0.01,
            defaultValue: 0.1,
            description: "Sixth Aizawa parameter - introduces higher-order nonlinear terms.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Aizawa Parameters"
        },
        {
            id: "speed",
            label: "Animation Speed",
            type: "range",
            min: 0.1,
            max: 3.0,
            step: 0.1,
            defaultValue: 1.0,
            description: "Animation speed multiplier for the dynamical evolution.",
            role: "AnimationBehavior",
            impactsPerformance: "Minor",
            group: "Animation"
        },
        {
            id: "particleCount",
            label: "Particle Count",
            type: "range",
            min: 100,
            max: 5000,
            step: 100,
            defaultValue: 2500,
            description: "Number of particles to trace the attractor's path.",
            role: "PerformanceTuning",
            impactsPerformance: "Significant",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: 500,
                    desktop: 2500,
                    rationale: "High particle counts significantly impact performance on mobile devices."
                }
            },
            group: "Simulation Parameters"
        },
        {
            id: "particleSize",
            label: "Particle Size",
            type: "range",
            min: 0.01,
            max: 0.1,
            step: 0.005,
            defaultValue: 0.03,
            description: "Size of individual particles - larger particles create more visible trails.",
            role: "VisualAesthetic",
            impactsPerformance: "Minor",
            group: "Visual Effects"
        },
        {
            id: "autoRotate",
            label: "Auto Rotate",
            type: "checkbox",
            defaultValue: false,
            description: "Automatically rotate the camera around the Y-axis for a cinematic view of the attractor.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Camera Behavior"
        },
        {
            id: "autoRotateSpeed",
            label: "Rotation Speed",
            type: "range",
            min: 0.1,
            max: 3.0,
            step: 0.1,
            defaultValue: 1.0,
            description: "Speed of automatic camera rotation - higher values create faster rotation.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Camera Behavior"
        },
        {
            id: "useCustomShader",
            label: "Enhanced Rendering",
            type: "checkbox",
            defaultValue: false,
            description: "Enable advanced shader-based rendering with parameter-based coloring and improved visual quality.",
            role: "VisualAesthetic",
            impactsPerformance: "Minor",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: true,
                    rationale: "Custom shaders provide enhanced visual quality on desktop but may impact mobile GPU performance."
                }
            }
        },
        {
            id: "colorScheme",
            label: "Color Scheme",
            type: "select",
            defaultValue: 1,
            options: [
                { value: 0, label: "Rainbow Depth" },
                { value: 1, label: "Warm-Cool" },
                { value: 2, label: "Parameter Gradient" }
            ],
            description: "Color scheme for depth and parameter-based particle coloring - highlights mathematical properties.",
            role: "VisualAesthetic",
            impactsPerformance: "Negligible",
            group: "Visual Effects"
        },
        {
            id: "depthFading",
            label: "Depth Fading",
            type: "checkbox",
            defaultValue: false,
            description: "Fade distant particles for enhanced depth perception and focus on the attractor's core structure.",
            role: "VisualAesthetic",
            impactsPerformance: "Negligible",
            group: "Visual Effects"
        },
        {
            id: "showAxes",
            label: "Show Coordinate Axes",
            type: "checkbox",
            defaultValue: false,
            description: "Display 3D coordinate axes to provide spatial reference and understand the mathematical space.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: true,
                    rationale: "Coordinate axes help with spatial understanding on larger screens but may clutter mobile displays."
                }
            }
        }
    ]
  },
  {
    id: "halvorsen-attractor",
    name: "Halvorsen Attractor",
    component: HalvorsenAttractorGenerator,
    technology: 'WEBGL_MESHES',
    category: 'Attractors',
    schemaVersion: "1.0",
    description: "A cyclically symmetric strange attractor with elegant quadratic nonlinear terms, rendered in interactive 3D space.",
    longDescription: "The Halvorsen Attractor is a 3D dynamical system with cyclically symmetric structure and quadratic nonlinearities. It exhibits rich chaotic behavior controlled by a single damping parameter, visualized with true spatial depth and interactive camera controls.",
    semantics: {
      primaryAlgorithmFamily: "StrangeAttractor",
      keyMathematicalConcepts: ["ChaosTheory", "Calculus", "LinearAlgebra"],
      visualCharacteristics: ["Flowing", "Chaotic", "Continuous", "Symmetrical", "Luminous", "Smooth"],
      dimensionality: "True3D_WebGL",
      interactionStyle: "DirectManipulation",
      keywords: ["halvorsen", "cyclic symmetry", "quadratic", "strange attractor", "3d", "webgl", "interactive", "spatial"]
    },
    performance: {
      computationalComplexity: "Medium",
      typicalFrameRateTarget: "60fps",
      notes: "Performance dependent on particle count and 3D rendering complexity. Quadratic nonlinearities are efficient but 3D rendering benefits from GPU acceleration."
    },
    version: "1.0.0",
    author: "Aaron Brown & Claude",
    dateAdded: "2025-06-27",
    lastModified: "2025-06-27",
    status: "Production",
    isInteractive: true,
    isAnimatedByDefault: true,
    relatedPatterns: ["lorenz-attractor", "thomas-attractor", "aizawa-attractor"],
    controls: [
        {
            id: "a",
            label: "Damping (a)",
            type: "range",
            min: 0.5,
            max: 2.5,
            step: 0.1,
            defaultValue: 1.4,
            description: "Damping parameter controlling chaotic behavior. Classic value is 1.4 for optimal chaos.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Halvorsen Parameters"
        },
        {
            id: "speed",
            label: "Animation Speed",
            type: "range",
            min: 0.1,
            max: 3.0,
            step: 0.1,
            defaultValue: 0.8,
            description: "Animation speed multiplier for the dynamical evolution.",
            role: "AnimationBehavior",
            impactsPerformance: "Minor",
            group: "Animation"
        },
        {
            id: "particleCount",
            label: "Particle Count",
            type: "range",
            min: 100,
            max: 5000,
            step: 100,
            defaultValue: 2500,
            description: "Number of particles to trace the attractor's path.",
            role: "PerformanceTuning",
            impactsPerformance: "Significant",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: 500,
                    desktop: 2500,
                    rationale: "High particle counts significantly impact performance on mobile devices."
                }
            },
            group: "Simulation Parameters"
        },
        {
            id: "particleSize",
            label: "Particle Size",
            type: "range",
            min: 0.01,
            max: 0.1,
            step: 0.005,
            defaultValue: 0.08,
            description: "Size of individual particles - larger particles create more visible trails.",
            role: "VisualAesthetic",
            impactsPerformance: "Minor",
            group: "Visual Effects"
        },
        {
            id: "autoRotate",
            label: "Auto Rotate",
            type: "checkbox",
            defaultValue: false,
            description: "Automatically rotate the camera around the Y-axis for a cinematic view of the attractor.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Camera Behavior"
        },
        {
            id: "autoRotateSpeed",
            label: "Rotation Speed",
            type: "range",
            min: 0.1,
            max: 3.0,
            step: 0.1,
            defaultValue: 1.0,
            description: "Speed of automatic camera rotation - higher values create faster rotation.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Camera Behavior"
        },
        {
            id: "useCustomShader",
            label: "Enhanced Rendering",
            type: "checkbox",
            defaultValue: false,
            description: "Enable advanced shader-based rendering with cyclic symmetry-based coloring and improved visual quality.",
            role: "VisualAesthetic",
            impactsPerformance: "Minor",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: true,
                    rationale: "Custom shaders provide enhanced visual quality on desktop but may impact mobile GPU performance."
                }
            }
        },
        {
            id: "colorScheme",
            label: "Color Scheme",
            type: "select",
            defaultValue: 1,
            options: [
                { value: 0, label: "Rainbow Depth" },
                { value: 1, label: "Warm-Cool" },
                { value: 2, label: "Halvorsen Gradient" }
            ],
            description: "Color scheme for depth and symmetry-based particle coloring - highlights mathematical properties.",
            role: "VisualAesthetic",
            impactsPerformance: "Negligible",
            group: "Visual Effects"
        },
        {
            id: "depthFading",
            label: "Depth Fading",
            type: "checkbox",
            defaultValue: false,
            description: "Fade distant particles for enhanced depth perception and focus on the attractor's core structure.",
            role: "VisualAesthetic",
            impactsPerformance: "Negligible",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: false,
                    rationale: "Depth fading can be enabled for enhanced depth perception but is disabled by default for clearer particle visibility."
                }
            }
        },
        {
            id: "showAxes",
            label: "Show Coordinate Axes",
            type: "checkbox",
            defaultValue: false,
            description: "Display 3D coordinate axes to provide spatial reference and understand the cyclic symmetry.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: true,
                    rationale: "Coordinate axes help with spatial understanding on larger screens but may clutter mobile displays."
                }
            }
        }
    ]
  },
  {
    id: "newton-leipnik-attractor",
    name: "Newton-Leipnik Attractor",
    component: NewtonLeipnikAttractorGenerator,
    technology: 'WEBGL_MESHES',
    category: 'Attractors',
    schemaVersion: "1.0",
    description: "A butterfly-structured strange attractor with distinctive folding dynamics and complex cross-coupling terms, rendered in interactive 3D space.",
    longDescription: "The Newton-Leipnik Attractor is a 3D dynamical system known for its butterfly-like structure with complex folding dynamics. The cross-coupling terms (10yz, 5xz, 5xy) create intricate patterns with sensitive dependence on initial conditions, making it an excellent demonstration of chaos theory.",
    semantics: {
      primaryAlgorithmFamily: "StrangeAttractor",
      keyMathematicalConcepts: ["ChaosTheory", "Calculus", "LinearAlgebra"],
      visualCharacteristics: ["Flowing", "Chaotic", "Continuous", "Complex", "Organic", "Luminous", "Smooth"],
      dimensionality: "True3D_WebGL",
      interactionStyle: "DirectManipulation",
      keywords: ["newton-leipnik", "butterfly structure", "folding dynamics", "cross-coupling", "strange attractor", "3d", "webgl", "interactive", "spatial"]
    },
    performance: {
      computationalComplexity: "Medium",
      typicalFrameRateTarget: "60fps",
      notes: "Performance dependent on particle count and 3D rendering complexity. Cross-coupling terms require additional computation but remain efficient for real-time visualization."
    },
    version: "1.0.0",
    author: "Aaron Brown & Claude",
    dateAdded: "2025-06-27",
    lastModified: "2025-06-27",
    status: "Production",
    isInteractive: true,
    isAnimatedByDefault: true,
    relatedPatterns: ["lorenz-attractor", "thomas-attractor", "aizawa-attractor", "halvorsen-attractor"],
    controls: [
        {
            id: "a",
            label: "Parameter A",
            type: "range",
            min: 0.1,
            max: 1.0,
            step: 0.05,
            defaultValue: 0.4,
            description: "Primary parameter controlling the first equation. Classic value is 0.4 for optimal butterfly structure.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Newton-Leipnik Parameters"
        },
        {
            id: "b",
            label: "Parameter B",
            type: "range",
            min: 0.05,
            max: 0.5,
            step: 0.025,
            defaultValue: 0.175,
            description: "Secondary parameter controlling the third equation. Classic value is 0.175 for chaotic behavior.",
            role: "PrimaryAlgorithmParameter",
            impactsPerformance: "Negligible",
            group: "Newton-Leipnik Parameters"
        },
        {
            id: "speed",
            label: "Animation Speed",
            type: "range",
            min: 0.1,
            max: 3.0,
            step: 0.1,
            defaultValue: 3.0,
            description: "Animation speed multiplier for the dynamical evolution.",
            role: "AnimationBehavior",
            impactsPerformance: "Minor",
            group: "Animation"
        },
        {
            id: "particleCount",
            label: "Particle Count",
            type: "range",
            min: 100,
            max: 5000,
            step: 100,
            defaultValue: 5000,
            description: "Number of particles to trace the attractor's path.",
            role: "PerformanceTuning",
            impactsPerformance: "Significant",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: 500,
                    desktop: 2500,
                    rationale: "High particle counts significantly impact performance on mobile devices."
                }
            },
            group: "Simulation Parameters"
        },
        {
            id: "particleSize",
            label: "Particle Size",
            type: "range",
            min: 0.01,
            max: 0.1,
            step: 0.005,
            defaultValue: 0.1,
            description: "Size of individual particles - larger particles create more visible butterfly trails.",
            role: "VisualAesthetic",
            impactsPerformance: "Minor",
            group: "Visual Effects"
        },
        {
            id: "autoRotate",
            label: "Auto Rotate",
            type: "checkbox",
            defaultValue: true,
            description: "Automatically rotate the camera around the Y-axis for a cinematic view of the butterfly structure.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Camera Behavior"
        },
        {
            id: "autoRotateSpeed",
            label: "Rotation Speed",
            type: "range",
            min: 0.1,
            max: 3.0,
            step: 0.1,
            defaultValue: 0.5,
            description: "Speed of automatic camera rotation - slower values highlight the folding dynamics.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Camera Behavior"
        },
        {
            id: "useCustomShader",
            label: "Enhanced Rendering",
            type: "checkbox",
            defaultValue: true,
            description: "Enable advanced shader-based rendering with folding dynamics-based coloring and butterfly gradient effects.",
            role: "VisualAesthetic",
            impactsPerformance: "Minor",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: true,
                    rationale: "Custom shaders provide enhanced butterfly visualization on desktop but may impact mobile GPU performance."
                }
            }
        },
        {
            id: "colorScheme",
            label: "Color Scheme",
            type: "select",
            defaultValue: 0,
            options: [
                { value: 0, label: "Rainbow Depth" },
                { value: 1, label: "Warm-Cool" },
                { value: 2, label: "Butterfly Gradient" }
            ],
            description: "Color scheme for depth and folding dynamics-based particle coloring - highlights butterfly structure.",
            role: "VisualAesthetic",
            impactsPerformance: "Negligible",
            group: "Visual Effects"
        },
        {
            id: "depthFading",
            label: "Depth Fading",
            type: "checkbox",
            defaultValue: true,
            description: "Fade distant particles for enhanced depth perception and focus on the butterfly wing structure.",
            role: "VisualAesthetic",
            impactsPerformance: "Negligible",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: true,
                    rationale: "Depth fading enhances the butterfly structure visualization on larger screens."
                }
            }
        },
        {
            id: "showAxes",
            label: "Show Coordinate Axes",
            type: "checkbox",
            defaultValue: false,
            description: "Display 3D coordinate axes to provide spatial reference and understand the folding dynamics.",
            role: "InteractionModifier",
            impactsPerformance: "Negligible",
            group: "Visual Effects",
            defaultRecommendations: {
                platformSpecific: {
                    mobile: false,
                    desktop: true,
                    rationale: "Coordinate axes help with spatial understanding on larger screens but may clutter mobile displays."
                }
            }
        }
    ]
  }
]