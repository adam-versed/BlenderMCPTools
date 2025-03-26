import { ThinkingContext } from '../../../common/types.js';
import { TemplateCategory, ThinkingTemplate } from '../types.js';
import { TemplateRecommender, TemplateRecommendation } from '../intelligence/templateRecommender.js';

interface ContextAnalysisResult {
  problemType: string;
  category: TemplateCategory;
  keywords: string[];
  complexity: 'simple' | 'medium' | 'complex';
  confidence: number;
  patternMatches: Array<{
    pattern: string;
    description: string;
    confidence: number;
  }>;
  contextualFactors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
  }>;
}

/**
 * Service that handles advanced template selection and recommendations
 */
export class TemplateRecommenderService {
  private recommender: TemplateRecommender;
  
  // Track recommendations for learning/adaptation
  private recommendationHistory: Array<{
    context: string;
    recommendation: TemplateRecommendation;
    timestamp: Date;
    wasAccepted: boolean;
  }> = [];
  
  constructor() {
    this.recommender = new TemplateRecommender();
  }
  
  /**
   * Auto-select a template based on the provided context
   * 
   * @param problemDescription Description of the problem to solve
   * @param context The thinking context
   * @param availableTemplates All available templates to choose from
   * @returns The best matching template with detailed context analysis
   */
  autoSelectTemplate(
    problemDescription: string,
    context: ThinkingContext,
    availableTemplates: ThinkingTemplate[]
  ): { recommendation: TemplateRecommendation | null; analysis: ContextAnalysisResult } {
    // Get detailed context analysis
    const analysis = this.analyzeContext(problemDescription, context);
    
    // Filter templates by category if we have high confidence
    let candidateTemplates = availableTemplates;
    if (analysis.confidence > 0.6) {
      const categoryTemplates = availableTemplates.filter(t => t.category === analysis.category);
      // Only filter if we have templates in this category
      if (categoryTemplates.length > 0) {
        candidateTemplates = categoryTemplates;
      }
    }
    
    // Use the recommender to find the best template match
    const recommendation = this.recommender.recommendTemplate(
      problemDescription,
      candidateTemplates,
      true // Use history for better recommendations
    );
    
    // Record this recommendation
    if (recommendation) {
      this.recommendationHistory.push({
        context: problemDescription,
        recommendation,
        timestamp: new Date(),
        wasAccepted: false // Will be updated if accepted
      });
      
      // Enhance the recommendation reason with more context
      if (analysis.confidence > 0.5) {
        recommendation.reason = this.enhanceRecommendationReason(
          recommendation.reason,
          analysis
        );
      }
    }
    
    return { recommendation, analysis };
  }
  
  /**
   * Enhanced recommendation reason with context analysis insights
   */
  private enhanceRecommendationReason(
    baseReason: string,
    analysis: ContextAnalysisResult
  ): string {
    let enhancedReason = baseReason;
    
    // Add pattern-matching insights if available
    if (analysis.patternMatches && analysis.patternMatches.length > 0) {
      const topPatterns = analysis.patternMatches
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 2);
      
      enhancedReason += "\n\nAdditional insights:";
      for (const pattern of topPatterns) {
        enhancedReason += `\n- ${pattern.description}`;
      }
    }
    
    // Add confidence level
    const confidenceText = analysis.confidence < 0.4 ? 'low' : 
                         analysis.confidence < 0.7 ? 'medium' : 'high';
    
    enhancedReason += `\n\nConfidence level: ${confidenceText} (${Math.round(analysis.confidence * 100)}%)`;
    
    return enhancedReason;
  }
  
  /**
   * Provide multiple template recommendations based on the problem description
   * with diversified results for better coverage
   * 
   * @param problemDescription Description of the problem to solve
   * @param context The thinking context
   * @param availableTemplates All available templates to choose from
   * @param limit Maximum number of recommendations to provide
   * @returns Object with recommendations and analysis information
   */
  getTemplateRecommendations(
    problemDescription: string,
    context: ThinkingContext,
    availableTemplates: ThinkingTemplate[],
    limit: number = 3
  ): { 
    recommendations: TemplateRecommendation[]; 
    analysis: ContextAnalysisResult;
    alternativeCategories: TemplateCategory[];
  } {
    // Get detailed context analysis
    const analysis = this.analyzeContext(problemDescription, context);
    
    // Normalize the problem description
    const normalizedDesc = problemDescription.toLowerCase();
    
    // Score all templates using our enhanced context understanding
    const detailedScores = availableTemplates.map(template => {
      // Calculate base score from advanced category matching
      const categoryMatch = template.category === analysis.category;
      let score = categoryMatch ? 5 : 0;
      
      // Adjust score based on contextual factors
      analysis.contextualFactors.forEach(factor => {
        // Factor in time pressure - prioritize simpler templates
        if (factor.factor === 'Time pressure' && factor.impact === 'negative') {
          // Simple templates get a boost under time pressure
          if (template.steps.length <= 5) {
            score += 1.5;
          } else if (template.steps.length >= 7) {
            score -= 1;
          }
        }
        
        // Factor in complexity indicators
        if (factor.factor === 'High complexity' && factor.impact === 'negative') {
          // More detailed templates are better for complex problems
          if (template.steps.length >= 6) {
            score += 1.2;
          }
        }
      });
      
      // Use the existing recommendation system for additional scoring
      const recommendation = this.recommender.recommendTemplate(
        problemDescription,
        [template],
        true
      );
      
      if (recommendation) {
        score += recommendation.score;
        return {
          ...recommendation,
          score // Override with our enhanced score
        };
      } else {
        return {
          template,
          score,
          reason: 'No specific match found'
        };
      }
    });
    
    // Sort by score in descending order
    detailedScores.sort((a, b) => b.score - a.score);
    
    // Diversify recommendations - we want to include templates from different categories
    const diverseRecommendations: TemplateRecommendation[] = [];
    const usedCategories = new Set<TemplateCategory>();
    
    // First add the highest scoring template
    if (detailedScores.length > 0) {
      diverseRecommendations.push(detailedScores[0]);
      usedCategories.add(detailedScores[0].template.category);
    }
    
    // Then try to add templates from different categories
    let remaining = detailedScores.slice(1);
    
    while (diverseRecommendations.length < limit && remaining.length > 0) {
      // First try to add a template from a new category
      const unusedCategoryTemplate = remaining.find(r => !usedCategories.has(r.template.category));
      
      if (unusedCategoryTemplate) {
        diverseRecommendations.push(unusedCategoryTemplate);
        usedCategories.add(unusedCategoryTemplate.template.category);
        remaining = remaining.filter(r => r !== unusedCategoryTemplate);
      } else {
        // If we've used all categories, just add the next highest scoring template
        diverseRecommendations.push(remaining[0]);
        usedCategories.add(remaining[0].template.category);
        remaining = remaining.slice(1);
      }
    }
    
    // Identify alternative categories that might be relevant but weren't the primary match
    const categories: TemplateCategory[] = ['analysis', 'planning', 'debugging', 'decision', 'research', 'verification', 'custom'];
    const alternativeCategories: TemplateCategory[] = categories
      .filter(category => category !== analysis.category)
      .map(category => {
        // Calculate how many templates of this category have a score above a threshold
        const categoryScores = detailedScores
          .filter(score => score.template.category === category)
          .filter(score => score.score > 3);
        return { category, matches: categoryScores.length };
      })
      .filter(result => result.matches > 0)
      .sort((a, b) => b.matches - a.matches)
      .map(result => result.category as TemplateCategory)
      .slice(0, 2); // Just take the top 2 alternatives
    
    return {
      recommendations: diverseRecommendations,
      analysis,
      alternativeCategories
    };
  }
  
  /**
   * Record if a recommendation was accepted or rejected
   * This information can be used to improve future recommendations
   * @returns Statistics about historical acceptance rates
   */
  recordRecommendationOutcome(
    template: ThinkingTemplate, 
    problemDescription: string,
    wasAccepted: boolean
  ): { 
    acceptanceRate: number; 
    categoryAcceptanceRates: Record<TemplateCategory, number>;
  } {
    // Find the most recent recommendation for this template
    const recentRecommendation = [...this.recommendationHistory]
      .reverse()
      .find(rec => rec.recommendation.template.id === template.id);
    
    // Add a new history entry if we don't have one
    if (recentRecommendation) {
      recentRecommendation.wasAccepted = wasAccepted;
    } else {
      this.recommendationHistory.push({
        context: problemDescription,
        recommendation: {
          template,
          score: 0, // Unknown score
          reason: 'Manually selected'
        },
        timestamp: new Date(),
        wasAccepted
      });
    }
    
    // Calculate overall acceptance rate
    const totalRecommendations = this.recommendationHistory.length;
    const acceptedRecommendations = this.recommendationHistory.filter(rec => rec.wasAccepted).length;
    const acceptanceRate = totalRecommendations > 0 
      ? acceptedRecommendations / totalRecommendations 
      : 0;
    
    // Calculate category-specific acceptance rates
    const categoryStats: Record<string, { accepted: number; total: number }> = {};
    
    for (const record of this.recommendationHistory) {
      const category = record.recommendation.template.category;
      if (!categoryStats[category]) {
        categoryStats[category] = { accepted: 0, total: 0 };
      }
      
      categoryStats[category].total += 1;
      if (record.wasAccepted) {
        categoryStats[category].accepted += 1;
      }
    }
    
    // Convert to acceptance rates
    const categoryAcceptanceRates: Record<TemplateCategory, number> = {} as Record<TemplateCategory, number>;
    for (const [category, stats] of Object.entries(categoryStats)) {
      categoryAcceptanceRates[category as TemplateCategory] = 
        stats.total > 0 ? stats.accepted / stats.total : 0;
    }
    
    return {
      acceptanceRate,
      categoryAcceptanceRates
    };
  }
  
  /**
   * Get effectiveness metrics for template recommendations
   * Used for improving template selection over time
   */
  getEffectivenessMetrics(): {
    overallAcceptanceRate: number;
    categoryStats: Record<TemplateCategory, {
      acceptanceRate: number;
      recommendationCount: number;
      averageScore: number;
    }>;
    recentTrends: {
      improving: boolean;
      recentAcceptanceRate: number;
      historicalAcceptanceRate: number;
    };
  } {
    // Calculate overall stats
    const totalRecommendations = this.recommendationHistory.length;
    if (totalRecommendations === 0) {
      return {
        overallAcceptanceRate: 0,
        categoryStats: {} as Record<TemplateCategory, any>,
        recentTrends: {
          improving: false,
          recentAcceptanceRate: 0,
          historicalAcceptanceRate: 0
        }
      };
    }
    
    const acceptedRecommendations = this.recommendationHistory.filter(rec => rec.wasAccepted).length;
    const overallAcceptanceRate = acceptedRecommendations / totalRecommendations;
    
    // Calculate category-specific stats
    const categoryStats: Record<string, {
      accepted: number;
      total: number;
      scoreSum: number;
    }> = {};
    
    for (const record of this.recommendationHistory) {
      const category = record.recommendation.template.category;
      if (!categoryStats[category]) {
        categoryStats[category] = { accepted: 0, total: 0, scoreSum: 0 };
      }
      
      categoryStats[category].total += 1;
      categoryStats[category].scoreSum += record.recommendation.score;
      
      if (record.wasAccepted) {
        categoryStats[category].accepted += 1;
      }
    }
    
    // Format category stats
    const formattedCategoryStats: Record<TemplateCategory, {
      acceptanceRate: number;
      recommendationCount: number;
      averageScore: number;
    }> = {} as Record<TemplateCategory, any>;
    
    for (const [category, stats] of Object.entries(categoryStats)) {
      formattedCategoryStats[category as TemplateCategory] = {
        acceptanceRate: stats.total > 0 ? stats.accepted / stats.total : 0,
        recommendationCount: stats.total,
        averageScore: stats.total > 0 ? stats.scoreSum / stats.total : 0
      };
    }
    
    // Calculate recent trends (last 10 vs. all prior)
    const recentCount = Math.min(10, Math.floor(totalRecommendations / 2));
    const recentRecommendations = this.recommendationHistory.slice(-recentCount);
    const historicalRecommendations = this.recommendationHistory.slice(0, -recentCount);
    
    const recentAccepted = recentRecommendations.filter(rec => rec.wasAccepted).length;
    const recentAcceptanceRate = recentCount > 0 ? recentAccepted / recentCount : 0;
    
    const historicalAccepted = historicalRecommendations.filter(rec => rec.wasAccepted).length;
    const historicalAcceptanceRate = historicalRecommendations.length > 0 
      ? historicalAccepted / historicalRecommendations.length 
      : 0;
    
    return {
      overallAcceptanceRate,
      categoryStats: formattedCategoryStats,
      recentTrends: {
        improving: recentAcceptanceRate > historicalAcceptanceRate,
        recentAcceptanceRate,
        historicalAcceptanceRate
      }
    };
  }
  
  /**
   * Analyze the context to extract useful information for advanced template selection
   */
  private analyzeContext(
    problemDescription: string,
    context: ThinkingContext
  ): ContextAnalysisResult {
    const normalizedDesc = problemDescription.toLowerCase();
    
    // Get detailed context analysis from the recommender
    const recommenderAnalysis = this.recommender.analyzeContext(normalizedDesc);
    
    // Extract keywords that might be relevant
    const keywords = this.extractKeywords(normalizedDesc);
    
    // Estimate complexity based on description length and keyword density
    const complexity = this.estimateComplexity(normalizedDesc);
    
    // Convert the matched patterns into pattern matches for our result
    const patternMatches = recommenderAnalysis.matchedPatterns.map(pattern => ({
      pattern: pattern.pattern,
      description: pattern.description,
      confidence: pattern.weight / 3 // Convert weight to a confidence score (0-1)
    }));
    
    // Identify contextual factors that might influence template selection
    const contextualFactors = this.identifyContextualFactors(normalizedDesc, context);
    
    return {
      problemType: this.determineProblemType(normalizedDesc),
      category: recommenderAnalysis.category,
      keywords,
      complexity,
      confidence: recommenderAnalysis.confidence,
      patternMatches,
      contextualFactors
    };
  }
  
  /**
   * Identify contextual factors that might influence template selection
   * These are additional signals beyond just pattern matching
   */
  private identifyContextualFactors(
    description: string, 
    context: ThinkingContext
  ): Array<{factor: string; impact: 'positive' | 'negative' | 'neutral'; weight: number}> {
    const factors: Array<{factor: string; impact: 'positive' | 'negative' | 'neutral'; weight: number}> = [];
    
    // Check for time pressure indicators
    if (/urgent|asap|quickly|deadline|soon/i.test(description)) {
      factors.push({
        factor: 'Time pressure',
        impact: 'negative',
        weight: 0.8
      });
    }
    
    // Check for complexity indicators
    if (/complex|complicated|difficult|challenging|intricate/i.test(description)) {
      factors.push({
        factor: 'High complexity',
        impact: 'negative',
        weight: 0.7
      });
    }
    
    // Check for clarity indicators
    if (/clear|simple|straightforward|obvious/i.test(description)) {
      factors.push({
        factor: 'Clear problem definition',
        impact: 'positive',
        weight: 0.6
      });
    }
    
    // Check for domain specificity
    if (/specific domain|specialized|technical|domain knowledge/i.test(description)) {
      factors.push({
        factor: 'Domain-specific knowledge required',
        impact: 'neutral',
        weight: 0.5
      });
    }
    
    return factors;
  }
  
  /**
   * Extract potentially relevant keywords from the description
   */
  private extractKeywords(description: string): string[] {
    // For now, a simple approach - extract words longer than 4 characters
    // In a real implementation, this would use NLP techniques
    return description
      .split(/\s+/)
      .filter(word => word.length > 4)
      .map(word => word.replace(/[^\w]/g, '').toLowerCase())
      .filter(word => word.length > 0)
      .slice(0, 10); // Take top 10 keywords
  }
  
  /**
   * Determine the high-level problem type from the description
   */
  private determineProblemType(description: string): string {
    if (description.includes('code') || description.includes('programming') ||
        description.includes('bug') || description.includes('error')) {
      return 'software';
    } else if (description.includes('decide') || description.includes('choice') ||
               description.includes('option') || description.includes('select')) {
      return 'decision';
    } else if (description.includes('plan') || description.includes('implement') ||
               description.includes('strategy')) {
      return 'planning';
    } else if (description.includes('analyze') || description.includes('understand') ||
               description.includes('evaluate')) {
      return 'analysis';
    } else {
      return 'general';
    }
  }
  
  /**
   * Estimate the complexity of the problem based on the description
   */
  private estimateComplexity(description: string): 'simple' | 'medium' | 'complex' {
    const length = description.length;
    const wordCount = description.split(/\s+/).length;
    
    if (length > 300 || wordCount > 50) {
      return 'complex';
    } else if (length > 100 || wordCount > 20) {
      return 'medium';
    } else {
      return 'simple';
    }
  }
  
  /**
   * Calculate a confidence score for our category determination
   */
  private calculateConfidence(description: string, category: TemplateCategory, keywords: string[]): number {
    // If description is very short, we have lower confidence
    if (description.length < 50) {
      return 0.5;
    }
    
    // Higher confidence if we found more keywords
    const keywordDensity = keywords.length / description.split(/\s+/).length;
    let confidence = Math.min(keywordDensity * 5, 0.8);
    
    // If the description explicitly mentions the category, high confidence
    if (description.includes(category)) {
      confidence = Math.max(confidence, 0.9);
    }
    
    return confidence;
  }
}