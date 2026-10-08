import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../src/server.ts";
import { professionals } from "../src/services/appointmentService.ts";

const app = createServer();

async function makeARequest(question: string) {
  return await app.inject({
    method: "POST",
    url: "/chat",
    payload: {
      question,
    },
  });
}

describe("Market System - E2E Tests", async () => {
  it("Find product - Success", async () => {
    const response = await makeARequest(
      `Olá, sou Maria Santos e quero encontrar o produto Feijão Carioca`,
    );

    console.log("Find product Success Response:", response.body);

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.intent, "findProduct");
    assert.equal(body.actionSuccess, true);
  });
});
