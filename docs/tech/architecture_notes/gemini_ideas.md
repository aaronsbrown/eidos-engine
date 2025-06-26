# Gemini-Proposed Architectural Enhancements

This document outlines two potential architectural enhancements proposed by the Gemini assistant, building upon the existing semantic instrumentation layer of the Eidos Engine.

---

## 1. Dynamic Performance Governor

This is an architectural enhancement that makes the application self-optimizing, adapting in real-time to the user's hardware capabilities.

### Executive Summary

The Dynamic Performance Governor is a runtime system that monitors the application's frame rate (FPS) and, if it falls below an acceptable threshold, automatically adjusts pattern parameters to improve performance. It uses the `performance` profile and control-specific metadata from the semantic layer to make intelligent decisions about what to change, creating a smoother experience on a wider range of devices without user intervention.

### Detailed Implementation Plan

1.  **Performance Monitoring Module (`src/lib/performance-monitor.ts`)**:
    *   A new module would be created to continuously measure FPS using `requestAnimationFrame`.
    *   It would expose a simple hook, `usePerformanceMetrics()`, which provides the current FPS and a stability status (e.g., 'Good', 'Struggling', 'Poor').

2.  **Governor Logic (`src/lib/governor.ts`)**:
    *   This module is the core of the enhancement. It would be integrated into the main application state.
    *   When a pattern is active, the Governor reads its semantic metadata:
        *   `performance.typicalFrameRateTarget`: To know the desired FPS (e.g., '60fps').
        *   `controls`: To get a list of all available controls and their semantic roles.
    *   If the `PerformanceMonitor` reports a 'Struggling' status, the Governor initiates a "dial-down" sequence:
        1.  It identifies all controls where `impactsPerformance` is `'Significant'` or `'Moderate'`.
        2.  It sorts them, prioritizing `'Significant'` controls first.
        3.  One by one, it programmatically updates the state of these controls towards a less performance-intensive setting. The ideal value would be sourced from the `defaultRecommendations.performanceConsideration.lowPerformance` field in the control's semantic definition.
        4.  After each adjustment, it waits a few frames to see if performance recovers before adjusting the next control.

### Architectural Considerations

*   **State Management**: This system would need to be able to programmatically dispatch state changes for the pattern controls. It would hook into your existing state management solution (e.g., React Context, Zustand, Redux).
*   **User Experience**: The Governor should probably notify the user when it's optimizing ("Auto-adjusting for performance..."). It could also be disabled by the user.
*   **Architectural Impact**: This introduces a closed-loop feedback system into your architecture. The application is no longer just rendering based on state; it's actively modifying its own state based on its runtime performance, using the semantic layer as its decision-making guide.

---

## 2. Semantic Discovery Engine

This enhancement transforms the user experience from a simple "list of patterns" into an intelligent, curated journey of discovery.

### Executive Summary

The Semantic Discovery Engine is a collection of features that helps users explore the vast possibility space of the pattern library. It uses the rich semantic tags (`AlgorithmFamily`, `MathematicalConcept`, `VisualCharacteristic`) and relationships (`relatedPatterns`) to provide contextual recommendations, guided "tours," and powerful conceptual search capabilities.

### Detailed Implementation Plan

1.  **Recommendation Service (`src/lib/recommender.ts`)**:
    *   A new service that acts as a query engine over the semantic data of all patterns.
    *   It would expose functions like:
        *   `getRelatedPatterns(patternId: string, criteria: ('family' | 'concept' | 'visual'))`: Finds patterns with matching semantic tags.
        *   `getPatternsByTags(tags: VisualCharacteristic[])`: Finds all patterns that match a set of visual descriptions (e.g., "show me all `Organic` and `Flowing` patterns").
        *   `getGuidedTour(concept: MathematicalConcept)`: Returns a curated list of pattern IDs that teach a specific concept, potentially sorted by complexity.

2.  **UI Integration (`src/components/discovery/`)**:
    *   A new set of UI components would be created to surface these recommendations.
    *   **`YouMightAlsoLikePanel.tsx`**: When viewing a pattern, this component would be displayed, showing 3-4 related patterns returned by the `RecommendationService`.
    *   **`GuidedTourPlayer.tsx`**: A UI that presents a sequence of patterns (a "tour") with explanatory text drawn from the `educationalLinks` and `longDescription` fields.
    *   **`SemanticSearch.tsx`**: An advanced search interface that doesn't use keywords, but instead uses dropdowns or tag clouds populated from the semantic enums (`VisualCharacteristic`, `AlgorithmFamily`, etc.), allowing users to build a conceptual query.

### Architectural Considerations

*   **Data Indexing**: For a large number of patterns, the `RecommendationService` might need to pre-process the semantic data into an indexed structure (e.g., an inverted index mapping tags to pattern IDs) for fast lookups at startup.
*   **Extensibility**: This engine is highly extensible. You could add new recommendation strategies, such as "serendipity mode," which finds patterns that are *dissimilar* to the current one to encourage exploration.
*   **Architectural Impact**: This shifts the architecture from a simple presentation layer to a content curation and delivery platform. It treats your patterns not as isolated tools, but as interconnected nodes in a knowledge graph, and builds an experience around navigating that graph.
