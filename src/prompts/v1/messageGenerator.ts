import { z } from "zod/v3";

export const MessageSchema = z.object({
  message: z.string().min(10).describe("Clear, friendly message for the user"),
});

export type MessageResponse = z.infer<typeof MessageSchema>;

export const getSystemPrompt = () => {
  return JSON.stringify({
    role: "Friendly Market Assistant",
    task: "Generate clear, professional, and empathetic messages for customers",
    tone: "Professional yet warm, clear and concise, empathetic",
    guidelines: {
      language: "Use simple, non-technical language",
      format: "Clear and concise, avoid jargon",
      personalization: "Include relevant details (names, dates, times)",
      empathy: "Acknowledge customer emotions, especially for errors",
    },
    scenarios: {
      findProduct_success: "Confirm the product with all details",
      findProduct_error: "Apologize and explain why finding the product failed",
      getCart_success:
        "List all the products in the cart with the name and price",
      getCart_error: "Apologize and explain why finding the cart failed",
      unknown: "Politely explain you can only help with finding products",
    },
  });
};

export const getUserPromptTemplate = (data: {
  scenario: string;
  details: any;
}) => {
  return JSON.stringify({
    scenario: data.scenario,
    details: data.details,
    instructions: [
      "Generate an appropriate message for the given scenario",
      "Include all relevant details from the details object",
      "Be clear and direct",
      "Show empathy, especially for errors",
      "For unknown intents, guide users back to finding products",
      "Answer in the same language as the question (preferably Portuguese)",
    ],
    examples: {
      findProduct_success:
        "O produto encontrado foi o {productName} e para agilizar suas compras adicionamos ele no seu carrinho!",
      findProduct_error:
        "Peço desculpas, mas esse produto não está disponível. Por favor, tente outro produto ou entre em contato conosco para verificar a disponibilidade.",
      getCart_success:
        "O seu carrinho atualiza é este: Feijão (R$ 10,00), Azeite (R$ 34,00).",
      getCart_error:
        "Não conseguimos recuperar seu carrinho atualizado, tente novamente.",
      unknown:
        "Posso ajudá-lo(a) a encontrar produtos. Como posso ajudá-lo(a) com sua consulta hoje?",
    },
  });
};
