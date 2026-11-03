import { test, expect } from "@playwright/test";
test("personalização, persistência, carrinho e checkout demonstrativo", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page
    .getByRole("button", { name: "Personalizar House Classic", exact: true })
    .click();
  let dialog = page.getByRole("dialog");
  await dialog.getByLabel("Queijo extra").check();
  await dialog.getByLabel("Alguma observação?").fill("Sem cebola");
  await dialog.getByRole("button", { name: "Aumentar quantidade" }).click();
  await expect(dialog.getByRole("button", { name: /Adicionar/ })).toContainText(
    "65,80",
  );
  await dialog.getByRole("button", { name: /Adicionar/ }).click();
  await page.reload();
  await page.getByRole("button", { name: "Abrir carrinho, 2 itens" }).click();
  dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Sem cebola");
  await expect(dialog).toContainText("R$ 65,80");
  await dialog.getByRole("button", { name: "Diminuir quantidade" }).click();
  await expect(dialog).toContainText("R$ 32,90");
  await dialog.getByRole("button", { name: "Finalizar pedido" }).click();
  dialog = page.getByRole("dialog");
  await dialog.getByLabel("Seu nome").fill("Murilo Aquino");
  await dialog.getByLabel("Telefone com DDD").fill("123");
  await dialog.getByLabel("Retirada", { exact: true }).check();
  await dialog.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(dialog.getByRole("alert")).toContainText("DDD");
  await dialog.getByLabel("Telefone com DDD").fill("11999998888");
  await dialog.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(dialog).toContainText("nenhum pedido foi enviado");
  await expect(dialog).toContainText("Murilo Aquino");
  await dialog.getByRole("button", { name: "Concluir demonstração" }).click();
  await expect(
    page.getByRole("button", { name: "Abrir carrinho, 0 itens" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("categorias, busca, remoção e ausência de overflow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Bebidas", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Refrigerante", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Buscar no cardápio" })
    .fill("nada aqui");
  await expect(page.getByText("Nenhuma mordida por aqui.")).toBeVisible();
  await page
    .getByRole("button", { name: "Limpar busca", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Personalizar Refrigerante", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Adicionar/ })
    .click();
  await page.getByRole("button", { name: "Abrir carrinho, 1 itens" }).click();
  await page.getByRole("button", { name: "Remover Refrigerante" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "A fome a gente resolve.",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("captura visual e imagens locais", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page
    .locator("img")
    .evaluateAll((images) => images.forEach((i) => (i.loading = "eager")));
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter((i) => !i.complete || i.naturalWidth === 0)
            .map((i) => i.src),
        ),
    )
    .toEqual([]);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-home.png`,
    fullPage: true,
  });
});
test("personalizações distintas, entrega e foco preso no modal", async ({
  page,
}) => {
  await page.goto("/");
  for (const bacon of [true, false]) {
    await page
      .getByRole("button", { name: "Personalizar House Classic", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    if (bacon) await dialog.getByLabel("Bacon crocante").check();
    await dialog.getByRole("button", { name: /Adicionar/ }).click();
  }
  await page.getByRole("button", { name: "Abrir carrinho, 2 itens" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator(".cart-item")).toHaveCount(2);
  await expect(dialog.locator(".total")).toContainText("63,80");
  await dialog.getByRole("button", { name: "Finalizar pedido" }).click();
  await dialog.getByLabel("Seu nome").fill("Ana Silva");
  await dialog.getByLabel("Telefone com DDD").fill("11912345678");
  await dialog.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(dialog).not.toContainText("Valeu,");
  await dialog.getByLabel("Endereço", { exact: false }).fill("Rua do Sabor");
  await dialog.getByLabel("Número").fill("42");
  await dialog.getByLabel("Bairro").fill("Centro");
  await dialog.getByLabel("Complemento").fill("Casa");
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(
        () => !!document.activeElement?.closest('[role="dialog"]'),
      ),
    ).toBe(true);
  }
  await dialog.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(dialog).toContainText("Rua do Sabor, 42 — Centro, Casa");
  await expect(dialog).toContainText("Bacon crocante");
});
test("menu mobile e tela pequena com movimento reduzido", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Cardápio", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Abrir menu" }),
  ).toHaveAttribute("aria-expanded", "false");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
