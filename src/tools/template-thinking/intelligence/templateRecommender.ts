import { ThinkingTemplate, TemplateCategory } from '../types.js';

/**
 * Scores for matching template categories to keywords
 */
interface KeywordMatch {
  category: TemplateCategory;
  score: number;
}

/**
 * Template recommendation result
 */
export interface TemplateRecommendation {
  template: ThinkingTemplate;
  score: number;
  reason: string;
}

// Context patterns that help identify specific problem types
interface ContextPattern {
  pattern: RegExp;
  category: TemplateCategory;
  weight: number;
  description: string;
}

/**
 * Handles advanced template selection and recommendations
 */
export class TemplateRecommender {
  // Keywords that suggest certain template categories
  private categoryKeywords: Record<TemplateCategory, string[]> = {
    'analysis': ['analyze', 'examine', 'study', 'investigate', 'assess', 'evaluate', 'understand', 'break down', 'review', 'compare', 'contrast', 'identify', 'patterns', 'interpret', 'correlate'],
    'planning': ['plan', 'implement', 'strategy', 'roadmap', 'timeline', 'schedule', 'organize', 'prepare', 'develop', 'outline', 'milestones', 'resources', 'dependencies', 'budget', 'allocate'],
    'debugging': ['debug', 'fix', 'issue', 'problem', 'error', 'bug', 'troubleshoot', 'diagnose', 'resolve', 'failure', 'crash', 'exception', 'defect', 'unexpected', 'regression', 'symptoms'],
    'decision': ['decide', 'choice', 'option', 'select', 'determine', 'choose', 'consider', 'weigh', 'compare', 'trade-off', 'pros', 'cons', 'alternatives', 'criteria', 'priority', 'preference'],
    'research': ['research', 'investigate', 'explore', 'discover', 'study', 'literature', 'background', 'information', 'data', 'survey', 'findings', 'sources', 'evidence', 'gaps', 'synthesis'],
    'verification': ['verify', 'validate', 'check', 'confirm', 'prove', 'test', 'ensure', 'correct', 'accurate', 'true', 'valid', 'reliable', 'consistent', 'double-check', 'assertions'],
    'custom': []
  };
  
  // More sophisticated pattern matching for specific contexts
  private contextPatterns: ContextPattern[] = [
    // Debugging patterns
    { 
      pattern: /(\b|^)(not working|fails|broken|doesn't work|won't compile|doesn't run)(\b|$)/i,
      category: 'debugging',
      weight: 3,
      description: 'Identified a non-functioning component that needs troubleshooting'
    },
    { 
      pattern: /(\b|^)(error|exception|crash|bug)(\b|$)/i, 
      category: 'debugging',
      weight: 3,
      description: 'Found references to software errors or exceptions'
    },
    
    // Planning patterns
    {
      pattern: /(\b|^)(need to (implement|build|create|develop)|how (can|should) (I|we) (implement|build))(\b|$)/i,
      category: 'planning',
      weight: 3,
      description: 'Detected implementation planning needs'
    },
    {
      pattern: /(\b|^)(timeline|roadmap|milestone|project plan)(\b|$)/i,
      category: 'planning',
      weight: 2.5,
      description: 'Found references to project planning elements'
    },
    
    // Decision making patterns
    {
      pattern: /(\b|^)(which (one|option)|should I choose|deciding between|better (choice|option))(\b|$)/i,
      category: 'decision',
      weight: 3,
      description: 'Identified a decision-making scenario'
    },
    {
      pattern: /(\b|^)(pros and cons|advantages|disadvantages|benefits|drawbacks)(\b|$)/i,
      category: 'decision',
      weight: 2.5,
      description: 'Found evaluation of alternatives'
    },
    
    // Analysis patterns
    {
      pattern: /(\b|^)(analyze|understand why|what causes|how does|evaluate|assessment)(\b|$)/i,
      category: 'analysis',
      weight: 3,
      description: 'Detected analytical needs'
    },
    {
      pattern: /(\b|^)(pattern|trend|correlation|relationship between|impact of)(\b|$)/i,
      category: 'analysis',
      weight: 2.5,
      description: 'Found references to relationship analysis'
    },
    
    // Research patterns
    {
      pattern: /(\b|^)(research|study|learn about|find out|information on|look into)(\b|$)/i,
      category: 'research',
      weight: 3,
      description: 'Identified research needs'
    },
    {
      pattern: /(\b|^)(literature|sources|references|papers|background information)(\b|$)/i,
      category: 'research',
      weight: 2.5,
      description: 'Found references to research materials'
    },
    
    // Verification patterns
    {
      pattern: /(\b|^)(verify|confirm|validate|is it true|check if|test whether)(\b|$)/i,
      category: 'verification',
      weight: 3,
      description: 'Detected verification needs'
    },
    {
      pattern: /(\b|^)(accuracy|correctness|validity|reliable|true or false)(\b|$)/i,
      category: 'verification',
      weight: 2.5,
      description: 'Found references to accuracy verification'
    }
  ];
  
  /**
   * Find the best template for a given problem description
   * @param description The problem description
   * @param templates Available templates
   * @param useHistory Whether to consider usage history in scoring
   * @returns The best matching template with score and reason
   */
  recommendTemplate(
    description: string, 
    templates: ThinkingTemplate[],
    useHistory: boolean = true
  ): TemplateRecommendation | null {
    if (templates.length === 0) return null;
    
    // Normalize the description
    const normalizedDesc = description.toLowerCase();
    
    // Score all templates
    const scores: TemplateRecommendation[] = templates.map(template => {
      // Calculate base score from keyword matching
      let score = this.calculateKeywordScore(normalizedDesc, template.category);
      
      // Add score based on specific template name and description matches
      score += this.calculateTemplateSpecificScore(normalizedDesc, template);
      
      // Add score based on usage history if enabled
      if (useHistory) {
        score += this.calculateUsageHistoryScore(template);
      }
      
      // Generate a reason for this recommendation
      const reason = this.generateRecommendationReason(score, template, normalizedDesc);
      
      return {
        template,
        score,
        reason
      };
    });
    
    // Sort by score in descending order
    scores.sort((a, b) => b.score - a.score);
    
    // Return the highest scoring template
    return scores[0];
  }
  
  /**
   * Calculate a score based on keyword matches in the description
   */
  private calculateKeywordScore(description: string, category: TemplateCategory): number {
    const keywords = this.categoryKeywords[category];
    let score = 0;
    
    // For each keyword that appears in the description, add to the score
    for (const keyword of keywords) {
      if (description.includes(keyword)) {
        // Exact word boundaries get higher score
        if (new RegExp(`\\b${keyword}\\b`).test(description)) {
          score += 2;
        } else {
          score += 1;
        }
      }
    }
    
    return score;
  }
  
  /**
   * Calculate a score based on specific template properties
   */
  private calculateTemplateSpecificScore(description: string, template: ThinkingTemplate): number {
    let score = 0;
    
    // Check if template name appears in description
    if (description.includes(template.name.toLowerCase())) {
      score += 3;
    }
    
    // Look for matches with template description
    const templateDesc = template.description.toLowerCase();
    const templateWords = templateDesc.split(/\s+/).filter(w => w.length > 4); // Only consider substantial words
    
    for (const word of templateWords) {
      if (description.includes(word)) {
        score += 0.5;
      }
    }
    
    // Check for step content matches
    for (const step of template.steps) {
      const stepContent = step.content.toLowerCase();
      if (description.includes(stepContent)) {
        score += 1;
      }
    }
    
    return score;
  }
  
  /**
   * Calculate a score based on template usage history
   */
  private calculateUsageHistoryScore(template: ThinkingTemplate): number {
    // Successful templates get a small boost (max 1 point)
    return Math.min(template.usageCount / 10, 1);
  }
  
  /**
   * Generate a human-readable reason for a template recommendation
   */
  private generateRecommendationReason(
    score: number,
    template: ThinkingTemplate,
    description: string
  ): string {
    // Find matched keywords for the explanation
    const matchedKeywords = this.categoryKeywords[template.category]
      .filter(keyword => description.includes(keyword));
    
    let reason = `Recommended '${template.name}' template`;
    
    if (matchedKeywords.length > 0) {
      reason += ` because your request mentioned: ${matchedKeywords.join(', ')}`;
    } else {
      reason += ` for ${template.category} tasks`;
    }
    
    if (template.usageCount > 0) {
      reason += `. It has been used successfully ${template.usageCount} times before.`;
    }
    
    return reason;
  }
  
  /**
   * Identify the most likely template category for a description
   * @param description The problem description
   * @returns The most likely category with confidence information
   */
  identifyCategory(description: string): TemplateCategory {
    const normalizedDesc = description.toLowerCase();
    
    // Score each category based on keywords
    const keywordScores: KeywordMatch[] = Object.entries(this.categoryKeywords)
      .map(([category, keywords]) => {
        // Count keyword matches with word boundary checking
        const score = keywords.reduce((total, keyword) => {
          // Exact word match gets higher score
          if (new RegExp(`\\b${keyword}\\b`, 'i').test(normalizedDesc)) {
            return total + 1.5;
          }
          // Partial match gets lower score
          else if (normalizedDesc.includes(keyword)) {
            return total + 0.7;
          }
          return total;
        }, 0);
        
        return {
          category: category as TemplateCategory,
          score
        };
      });
    
    // Score based on context patterns
    const patternScores: KeywordMatch[] = this.contextPatterns
      .filter(pattern => pattern.pattern.test(normalizedDesc))
      .reduce((acc, pattern) => {
        // Find or create entry for this category
        const existing = acc.find(s => s.category === pattern.category);
        if (existing) {
          existing.score += pattern.weight;
        } else {
          acc.push({
            category: pattern.category,
            score: pattern.weight
          });
        }
        return acc;
      }, [] as KeywordMatch[]);
    
    // Combine scores from keywords and patterns
    const combinedScores = [...keywordScores];
    patternScores.forEach(patternScore => {
      const existing = combinedScores.find(s => s.category === patternScore.category);
      if (existing) {
        existing.score += patternScore.score;
      } else {
        combinedScores.push(patternScore);
      }
    });
    
    // Sort by score in descending order
    combinedScores.sort((a, b) => b.score - a.score);
    
    // Return the highest scoring category, or default to 'analysis'
    return combinedScores[0]?.score > 0 ? combinedScores[0].category : 'analysis';
  }
  
  /**
   * Get detailed context analysis for enhanced template selection
   * @param description The problem description
   * @returns Detailed context analysis results
   */
  analyzeContext(description: string): {
    category: TemplateCategory;
    matchedPatterns: { pattern: string; weight: number; description: string }[];
    keywordMatches: string[];
    confidence: number;
  } {
    const normalizedDesc = description.toLowerCase();
    
    // Find the best category
    const category = this.identifyCategory(normalizedDesc);
    
    // Get matched patterns
    const matchedPatterns = this.contextPatterns
      .filter(pattern => pattern.pattern.test(normalizedDesc))
      .map(pattern => ({
        pattern: pattern.pattern.toString(),
        weight: pattern.weight,
        description: pattern.description
      }));
    
    // Get matched keywords
    const keywordMatches = this.categoryKeywords[category]
      .filter(keyword => normalizedDesc.includes(keyword));
    
    // Calculate confidence based on number and strength of matches
    const patternScore = matchedPatterns.reduce((sum, p) => sum + p.weight, 0);
    const keywordScore = keywordMatches.length;
    const confidence = Math.min(0.95, (patternScore * 0.1 + keywordScore * 0.05));
    
    return {
      category,
      matchedPatterns,
      keywordMatches,
      confidence: confidence > 0 ? confidence : 0.3 // Minimum confidence level
    };
  }
}