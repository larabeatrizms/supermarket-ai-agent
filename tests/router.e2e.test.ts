import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../src/server.ts";

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
  it.skip("Find product - Success", async () => {
    const response = await makeARequest(
      `Olá, sou Maria Santos e quero encontrar o produto Feijão Carioca`,
    );

    console.log("Find product Success Response:", response.body);

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.intent, "findProduct");
    assert.equal(body.actionSuccess, true);
  });

  it.skip("Find product - Error", async () => {
    const response = await makeARequest(`Quero encontrar o produto Cenoura`);

    console.log("Find product Error Response:", response.body);

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.intent, "findProduct");
    assert.equal(body.actionSuccess, false);
  });

  it("Get Cart - Success", async () => {
    const response2 = await makeARequest(`Qual meu carrinho atual`);
    const body2 = JSON.parse(response2.body);
    assert.equal(body2.intent, "getCart");
    assert.equal(body2.actionSuccess, true);
  });

  it.skip("Find product and get cart - Success", async () => {
    const response = await makeARequest(
      `Olá, sou Maria Santos e quero encontrar o produto Feijão Carioca`,
    );

    console.log("Find product Success Response:", response.body);

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.intent, "findProduct");
    assert.equal(body.actionSuccess, true);

    const response2 = await makeARequest(`Qual meu carrinho atual`);
    const body2 = JSON.parse(response2.body);
    assert.equal(body2.intent, "getCart");
    assert.equal(body2.actionSuccess, true);
  });
});
