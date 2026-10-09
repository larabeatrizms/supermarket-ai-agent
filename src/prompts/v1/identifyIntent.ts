import { z } from "zod/v3";

export const IntentSchema = z.object({
  intent: z
    .enum(["getCart", "findProduct", "unknown"])
    .describe("A intenção do usuário"),
  productId: z.number().describe("ID do produto"),
});

export type IntentData = z.infer<typeof IntentSchema>;

export const getSystemPrompt = (products: any[]) => {
  return JSON.stringify({
    role: "Classificador de Intenção para Produtos do Mercado",
    task: "Identificar a intenção do usuário e extrair todos os detalhes relacionados aos produtos",
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
    })),
    rules: {
      findProduct: {
        description: "O usuário quer encontrar um produto",
        keywords: [
          "encontrar",
          "buscar",
          "procurar",
          "eu quero",
          "encontrar um produto",
        ],
        required_fields: ["productId"],
      },
      getCart: {
        description:
          "O usuário quer listar produtos no carrinho ou quer saber qual seu carrinho atual",
        keywords: ["carrinho", "lista no carrinho"],
        required_fields: [],
      },
      unknown: {
        description: "Qualquer coisa não relacionada a encontrar um produto",
        examples: [
          "perguntas sobre o clima",
          "informações gerais",
          "dúvidas não relacionadas",
        ],
      },
    },
    extraction_instructions: {
      productId:
        "Associe o nome do produto mencionado na pergunta ao ID da lista de produtos. Use correspondência aproximada (fuzzy matching).",
    },
    examples: [
      {
        input: "Eu quero encontrar um produto chamado Feijão",
        output: {
          intent: "findProduct",
          productId: 2,
        },
      },
      {
        input: "Eu quero encontrar um produto chamado Batata",
        output: {
          intent: "findProduct",
          productId: null,
        },
      },
      {
        input: "Qual meu carrinho",
        output: {
          intent: "getCart",
        },
      },
      {
        input: "Como está o tempo hoje?",
        output: { intent: "unknown" },
      },
    ],
  });
};

export const getUserPromptTemplate = (question: string) => {
  return JSON.stringify({
    question,
    instructions: [
      "Analise cuidadosamente a pergunta para determinar a intenção do usuário",
      "Extraia todos os detalhes relevantes do agendamento",
      "Converta datas e horários para o formato ISO",
      "Associe os nomes dos profissionais aos seus respectivos IDs",
      "Retorne apenas os campos que estiverem presentes na pergunta",
    ],
  });
};
