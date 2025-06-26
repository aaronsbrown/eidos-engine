import type { EducationalContent } from '@/components/ui/educational-overlay'

// AIDEV-NOTE: Parses markdown educational content into structured data for overlay display
export function parseEducationalContent(markdownContent: string): EducationalContent {
  // Extract title from first line
  const titleMatch = markdownContent.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1] : 'Educational Content'
  
  // Parse Layer 1 - extract content between Layer 1 and Layer 2 (flexible header matching)
  const layer1Section = markdownContent.match(/## Layer 1[^]*?\n\n?([\s\S]*?)(?=## Layer 2|$)/) || 
                        markdownContent.match(/## Layer 1[^]*?\n([\s\S]*?)(?=## Layer 2|$)/)
  const intuitive = {
    title: 'What is this?',
    content: layer1Section && layer1Section[1].trim() ? layer1Section[1].trim() : 'Content not found'
  }
  
  // Parse Layer 2 - extract content between Layer 2 and Layer 3 (flexible header matching)
  const layer2Section = markdownContent.match(/## Layer 2[^]*?\n\n?([\s\S]*?)(?=## Layer 3|$)/) ||
                        markdownContent.match(/## Layer 2[^]*?\n([\s\S]*?)(?=## Layer 3|$)/)
  const conceptual = {
    title: 'How does this work?',
    content: layer2Section && layer2Section[1].trim() ? layer2Section[1].trim() : 'Content not found'
  }
  
  // Parse Layer 3 - extract content from Layer 3 to end (flexible header matching)
  const layer3Section = markdownContent.match(/## Layer 3[^]*?\n\n?([\s\S]*?)$/) ||
                        markdownContent.match(/## Layer 3[^]*?\n([\s\S]*?)$/)
  const technical = {
    title: 'Show me the code',
    content: layer3Section && layer3Section[1].trim() ? layer3Section[1].trim() : 'Content not found'
  }
  
  return {
    title,
    layers: {
      intuitive,
      conceptual,
      technical
    }
  }
}