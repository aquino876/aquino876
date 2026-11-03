import { test, expect } from "@playwright/test";
import { resolve } from "node:path";

test("prévia HTML funciona offline com carrinho persistente e checkout interativo", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  const network: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (!request.isNavigationRequest() && /^https?:/.test(request.url()))
      network.push(request.url());
  });
  // The managed Chromium blocks file://. Serve only the HTML from a local response;
  // all scripts, images and fonts must work without network subresources.
  await page.route("http://127.0.0.1:5173/standalone-preview", (route) =>
    route.fulfill({
      path: resolve("artifacts/Burger-House.html"),
      contentType: "text/html",
    }),
  );
  await context.setOffline(true);
  await page.goto("http://127.0.0.1:5173/standalone-preview");
  await page
    .getByRole("button", { name: "Personalizar House Classic", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByLabel("Alface", { exact: true })
    .uncheck();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Adicionar/ })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Abrir carrinho, 1 itens" }).click();
  await expect(page.getByRole("dialog")).toContainText("Sem: Alface");
  await page.getByRole("button", { name: "Finalizar pedido" }).click();
  await page.getByLabel("Seu nome").fill("Ana Silva");
  await page.getByLabel("Telefone com DDD").fill("11999999999");
  await page.getByLabel("Retirada", { exact: true }).check();
  await page.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "nenhum pedido foi enviado",
  );
  expect(errors).toEqual([]);
  expect(network).toEqual([]);
});
