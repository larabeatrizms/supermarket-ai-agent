import { config } from "../config.ts";
import { MarketService } from "../services/marketService.ts";
import { OpenRouterService } from "../services/openRouterService.ts";
import { buildMarketGraph } from "./graph.ts";

export function buildGraph() {
  const llmClient = new OpenRouterService(config);
  const marketService = new MarketService();
  return buildMarketGraph(llmClient, marketService);
}

export const graph = async () => {
  return buildGraph();
};
