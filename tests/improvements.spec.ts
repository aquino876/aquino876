import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
async function addClassic(page: Page) {
  await page
    .getByRole("button", { name: "Personalizar House Classic", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Adicionar/ })
    .click();
}

test("navegação e CTAs abrem seus destinos", async ({ page }) => {
  await page.goto("/");
  if (await page.getByRole("button", { name: "Abrir menu" }).isVisible())
    await page.getByRole("button", { name: "Abrir menu" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Nossa história" })
    .click();
  await expect(page).toHaveURL(/#sobre$/);
  await page
    .getByRole("link", { name: "Explorar cardápio", exact: true })
    .click();
  await expect(page).toHaveURL(/#cardapio$/);
  await page.getByRole("button", { name: "Quero meu combo" }).click();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText(
    "Combo da House",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: /Bora de burger/ })
    .click();
  await expect(page).toHaveURL(/#cardapio$/);
});
test("esgotados não permitem compra e filtros combinam com busca sem acentos", async ({
  page,
}) => {
  await page.goto("/");
  const card = page
    .locator("article")
    .filter({
      has: page.getByRole("heading", { name: "Crispy Chicken", exact: true }),
    });
  await expect(card.getByText("Esgotado", { exact: true })).toBeVisible();
  await expect(
    card.getByRole("button", { name: "Crispy Chicken esgotado" }),
  ).toBeDisabled();
  await expect(
    card.getByRole("button", { name: "Ver Crispy Chicken" }),
  ).toBeDisabled();
  await page.getByLabel("Somente disponíveis").check();
  await expect(card).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "Buscar no cardápio" })
    .fill("crispy");
  await expect(page.getByText("Nenhuma mordida por aqui.")).toBeVisible();
  await page.getByRole("button", { name: "Limpar busca e filtros" }).click();
  await expect(page.locator(".product-card")).toHaveCount(4);
  await page.getByRole("button", { name: "Bebidas", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Buscar no cardápio" })
    .fill("  AGUA ");
  await expect(
    page.getByRole("heading", { name: "Água mineral", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".product-card")).toHaveCount(1);
});
test("ingredientes retirados persistem em variantes e no resumo com cálculo correto", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Personalizar House Classic", exact: true })
    .click();
  let dialog = page.getByRole("dialog");
  await dialog.getByLabel("Alface", { exact: true }).uncheck();
  await dialog.getByLabel("Tomate", { exact: true }).uncheck();
  await dialog.getByLabel("Queijo extra").check();
  await dialog.getByLabel("Bacon crocante").check();
  await dialog.getByRole("button", { name: "Aumentar quantidade" }).click();
  await expect(dialog.getByRole("button", { name: /Adicionar/ })).toContainText(
    "77,80",
  );
  await dialog.getByRole("button", { name: /Adicionar/ }).click();
  await expect(page.locator(".toast")).toContainText("2× House Classic");
  await addClassic(page);
  await page.reload();
  await page.getByRole("button", { name: "Abrir carrinho, 3 itens" }).click();
  dialog = page.getByRole("dialog");
  await expect(dialog.locator(".cart-item")).toHaveCount(2);
  await expect(dialog).toContainText("Sem: Alface · Tomate");
  await expect(dialog).toContainText("Receita original");
  await expect(dialog.locator(".total")).toContainText("106,70");
  await dialog.getByRole("button", { name: "Finalizar pedido" }).click();
  await expect(dialog).toContainText("Sem: Alface · Tomate");
  await dialog.getByRole("button", { name: "Voltar ao carrinho" }).click();
  await expect(dialog.locator(".cart-item")).toHaveCount(2);
});
test("item esgotado restaurado bloqueia quantidade e checkout até ser removido", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "burger-house-cart-v1",
      JSON.stringify([
        { id: "old", productId: "chicken", extras: [], quantity: 1, notes: "" },
        {
          id: "good",
          productId: "classic",
          extras: [],
          quantity: 1,
          notes: "",
        },
      ]),
    ),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir carrinho, 2 itens" }).click();
  const dialog = page.getByRole("dialog");
  const soldout = dialog
    .locator(".cart-item")
    .filter({ has: page.getByRole("heading", { name: "Crispy Chicken" }) });
  await expect(
    soldout.getByRole("button", { name: "Aumentar quantidade" }),
  ).toBeDisabled();
  await expect(
    dialog.getByRole("button", { name: "Finalizar pedido" }),
  ).toBeDisabled();
  await expect(dialog.getByRole("alert")).toContainText("esgotados");
  await soldout.getByRole("button", { name: "Remover Crispy Chicken" }).click();
  await expect(
    dialog.getByRole("button", { name: "Finalizar pedido" }),
  ).toBeEnabled();
});
test("erros do checkout estão ligados aos campos e levam foco ao primeiro erro", async ({
  page,
}) => {
  await page.goto("/");
  await addClassic(page);
  await page.getByRole("button", { name: "Abrir carrinho, 1 itens" }).click();
  await page.getByRole("button", { name: "Finalizar pedido" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(dialog.getByLabel("Seu nome")).toBeFocused();
  await expect(dialog.getByLabel("Seu nome")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await dialog.getByLabel("Seu nome").fill("12");
  await dialog.getByLabel("Telefone com DDD").fill("11999999999");
  await dialog.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(dialog.getByRole("alert")).toContainText("sem números");
  await dialog.getByLabel("Seu nome").fill("  Ana Silva  ");
  await dialog.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(dialog.getByLabel("Endereço")).toBeFocused();
  await dialog.getByLabel("Endereço").fill(" Rua do Sabor ");
  await dialog.getByLabel("Número").fill(" S/N ");
  await dialog.getByLabel("Bairro").fill(" Centro ");
  await dialog.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(dialog).toContainText("Rua do Sabor, S/N — Centro");
  await expect(
    dialog.getByRole("heading", { name: "Valeu, Ana Silva!" }),
  ).toBeFocused();
});
test("modais devolvem foco e o carrinho mobile fica acessível após rolar", async ({
  page,
}, info) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Personalizar House Classic",
    exact: true,
  });
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await addClassic(page);
  await page.getByRole("button", { name: "Fechar aviso", exact: true }).click();
  const bar = page.locator(".mobile-cart-bar");
  if (info.project.name === "mobile") {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(bar.getByRole("button")).toBeInViewport();
    await bar.getByRole("button").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(
      await page
        .getByRole("dialog")
        .evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true);
    await page.getByRole("button", { name: "Fechar janela" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  } else await expect(bar).toBeHidden();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("armazenamento inválido e bloqueado tem mensagens e permite continuar", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("burger-house-cart-v1", "invalid json"),
  );
  await page.goto("/");
  await expect(page.locator(".restore-notice")).toContainText("reiniciado");
  await page.getByRole("button", { name: "Fechar aviso do carrinho" }).click();
  await expect(page.locator(".restore-notice")).toHaveCount(0);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await addClassic(page);
  await expect(page.locator(".storage-message")).toContainText(
    "não permitiu salvar",
  );
  await page.getByRole("button", { name: "Abrir carrinho, 1 itens" }).click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "House Classic" }),
  ).toBeVisible();
});
test("falha de imagem mantém informação e compra acessíveis", async ({
  page,
}) => {
  await page.route("**/images/popular-burger-classic.png", (route) =>
    route.abort(),
  );
  await page.goto("/");
  const card = page
    .locator(".product-card")
    .filter({
      has: page.getByRole("heading", { name: "House Classic", exact: true }),
    });
  await card.scrollIntoViewIfNeeded();
  await expect(card.getByRole("img", { name: "House Classic" })).toHaveClass(
    /image-fallback/,
  );
  await card
    .getByRole("button", { name: "Personalizar House Classic", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("House Classic");
});
