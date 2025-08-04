import { AnalysisResponse } from "../services/analysis.js";
import { type ImageAnalysis } from "@myconid/store/types";

export const translateAnalysisToImageAnalysis = (
  results: AnalysisResponse
): ImageAnalysis => {
  const suggestion = results.classification?.suggestions?.[0];
  return {
    isMushroom: {
      confidence: results.is_mushroom.probability,
      binary: results.is_mushroom.binary,
    },
    name: suggestion?.name,
    commonNames: suggestion?.details?.common_names,
    lookAlikes: suggestion?.details?.look_alike?.map((la) => {
      return {
        url: la.url,
        name: la.name,
      };
    }),
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
