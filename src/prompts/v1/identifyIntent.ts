import { z } from "zod/v3";

export const IntentSchema = z.object({
  intent: z.enum(["findProduct", "unknown"]).describe("The user intent"),
  productId: z.number().describe("ID of the product"),
});

export type IntentData = z.infer<typeof IntentSchema>;

export const getSystemPrompt = (products: any[]) => {
  return JSON.stringify({
    role: "Intent Classifier for Market Products",
    task: "Identify user intent and extract all product-related details",
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
    })),
    rules: {
      findProduct: {
        description: "User wants to find a product",
        keywords: ["find", "search", "I want to", "make an appointment"],
        required_fields: ["productId"],
      },
      unknown: {
        description:
          "Anything not related to scheduling or cancelling appointments",
        examples: ["weather questions", "general info", "unrelated queries"],
      },
    },
    extraction_instructions: {
      productId:
        "Match the product name mentioned in the question to the ID from the products list. Use fuzzy matching.",
    },
    examples: [
      {
        input: "I want to find a product called 'Feijão Carioca 1kg'",
        output: {
          intent: "findProduct",
          productId: 2,
        },
      },
      {
        input: "What is the weather today?",
        output: { intent: "unknown" },
      },
    ],
  });
};

export const getUserPromptTemplate = (question: string) => {
  return JSON.stringify({
    question,
    instructions: [
      "Carefully analyze the question to determine the user intent",
      "Extract all relevant appointment details",
      "Convert dates and times to ISO format",
      "Match professional names to their IDs",
      "Return only the fields that are present in the question",
    ],
  });
};
