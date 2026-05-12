import type { PortfolioExplanation } from "../../types/ai";
import type { UserProfile } from "../../types/profile";
import { apiUrl } from "../../lib/api";

type Allocation = {
  ticker: string;
  weight: number;
  category: string;
};

type RecommendationPayload = {
  horizonYears: number;
  expectedAnnualReturn: number;
  projectedPortfolioValue: number;
  recommendedFundTickers: string[];
  recommendedAllocations: Allocation[];
};

export async function fetchPortfolioExplanation(args: {
  profile: UserProfile | null | undefined;
  recommendation: RecommendationPayload;
}): Promise<PortfolioExplanation> {
  const res = await fetch(apiUrl("/api/ai/portfolio-explanation"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  const raw = await res.text();

  if (!res.ok) {
    throw new Error(raw || `Failed to fetch AI explanation (${res.status})`);
  }

  return JSON.parse(raw) as PortfolioExplanation;
}