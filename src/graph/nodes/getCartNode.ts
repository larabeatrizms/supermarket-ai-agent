import { MarketService } from "../../services/marketService.ts";
import type { GraphState } from "../graph.ts";

export function createGetCartNode(marketService: MarketService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`📅 Get cart...`);

    try {
      const cartData = marketService.getCart();
      return {
        ...state,
        actionSuccess: true,
        cartData,
      };
    } catch (error) {
      console.log(
        `❌ Get cart failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      return {
        ...state,
        actionSuccess: false,
        actionError:
          error instanceof Error ? error.message : "Finding product failed",
      };
    }
  };
}
