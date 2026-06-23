export interface ScrapedData {
  competitorId: string;
  competitorName: string;
  website: string;
  scrapedAt: Date;
  rawContent: string;
  extractedIntelligence: {
    summary: string;
    keyFeatures: string[];
    pricingInfo: string;
    recentUpdates: string;
    targetAudience: string;
  };
  contentHash: string;
}

export interface ScraperResult {
  success: boolean;
  data?: ScrapedData;
  error?: string;
}