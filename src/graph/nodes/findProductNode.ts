import z from "zod/v3";
import { MarketService } from "../../services/marketService.ts";
import type { GraphState } from "../graph.ts";

const FindProductRequiredFieldsSchema = z.object({
  productId: z.number({ required_error: "Product ID is required" }),
});

export function createFindProductNode(marketService: MarketService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`📅 Finding product...`);

    try {
      const validation = FindProductRequiredFieldsSchema.safeParse(state);

      if (!validation.success) {
        const errorMessages = validation.error.errors
          .map((e) => e.message)
          .join(", ");
        console.log(`⚠️  Validation failed: ${errorMessages}`);
        return {
          actionSuccess: false,
          actionError: errorMessages,
        };
      }

      console.log("ProductID: ", validation.data.productId);

      const product = marketService.getProduct(validation.data.productId);

      if (!product) {
        console.log(
          `❌ Product not found - productId: ${validation.data.productId}`,
        );
        return {
          actionSuccess: false,
          actionError: "Produto não encontrado, por favor tente novamente.",
        };
      }

      marketService.addProductToCart(product);

      return {
        ...state,
        actionSuccess: true,
        productId: product.id,
        productData: product,
      };
    } catch (error) {
      console.log(
        `❌ Finding product failed: ${error instanceof Error ? error.message : "Unknown error"}`,
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
