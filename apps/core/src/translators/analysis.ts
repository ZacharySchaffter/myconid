import { AnalysisResponse } from "../services/analysis.js";
import { type ImageAnalysis } from "@myconid/store/types";

export const translateAnalysisToImageAnalysis = (
  results: AnalysisResponse
): ImageAnalysis | null => {
  const suggestion = results.classification?.suggestions?.[0];
  if (!suggestion || suggestion.probability < 0.4) return null;
  return {
    confidence: suggestion.probability || results.is_mushroom.probability || 0,
    name: suggestion?.name,
    commonNames: suggestion?.details?.common_names || null,
    lookAlikes:
      suggestion?.details?.look_alike?.map((la) => {
        return {
          url: la.url,
          name: la.name,
        };
      }) || null,
    description: {
      content: suggestion?.details?.description?.value,
      citation: suggestion?.details?.description?.citation,
    },
    taxonomy: suggestion?.details?.taxonomy,
    traits: {
      psychoactive: suggestion?.details?.psychoactive,
      edibility: suggestion?.details?.edibility,
    },
  };
};
