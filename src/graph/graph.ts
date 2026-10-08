import { StateGraph, START, END, MessagesZodMeta } from "@langchain/langgraph";
import { withLangGraph } from "@langchain/langgraph/zod";
import type { BaseMessage } from "@langchain/core/messages";

import { createFindProductNode } from "./nodes/findProductNode.ts";
import { createIdentifyIntentNode } from "./nodes/identifyIntentNode.ts";
import { createMessageGeneratorNode } from "./nodes/messageGeneratorNode.ts";

import { z } from "zod/v3";
import { OpenRouterService } from "../services/openRouterService.ts";
import { MarketService } from "../services/marketService.ts";

const MarketStateAnnotation = z.object({
  messages: withLangGraph(z.custom<BaseMessage[]>(), MessagesZodMeta),

  intent: z.enum(["findProduct", "unknown"]).optional(),
  productId: z.number().optional(),

  actionSuccess: z.boolean().optional(),
  actionError: z.string().optional(),
  productData: z.any().optional(),
  cartData: z.any().optional(),

  error: z.string().optional(),
});

export type GraphState = z.infer<typeof MarketStateAnnotation>;

export function buildMarketGraph(
  llmClient: OpenRouterService,
  marketService: MarketService,
) {
  // Build workflow graph
  const workflow = new StateGraph({
    stateSchema: MarketStateAnnotation,
  })
    .addNode("identifyIntent", createIdentifyIntentNode(llmClient))
    .addNode("findProduct", createFindProductNode(marketService))
    .addNode("message", createMessageGeneratorNode(llmClient))

    // Flow
    .addEdge(START, "identifyIntent")

    // Route based on intent
    .addConditionalEdges(
      "identifyIntent",
      (state: GraphState): string => {
        if (state.error || !state.intent || state.intent === "unknown") {
          return "message";
        }

        console.log(`➡️  Routing based on intent: ${state.intent}`);
        return state.intent;
      },
      {
        findProduct: "findProduct",
        message: "message",
      },
    )

    .addEdge("findProduct", "message")
    .addEdge("message", END);

  return workflow.compile();
}
