import { describe, it, expect } from "vitest";
import { validateCheckout } from "./checkout";
import type { CheckoutDetails } from "../types";
const valid: CheckoutDetails = {
  name: "Ana Silva",
  phone: "(11) 99999-9999",
  mode: "delivery",
  street: "Rua A",
  number: "S/N",
  neighborhood: "Centro",
  complement: "",
  notes: "",
};
describe("validação do checkout", () => {
  it("aceita dados válidos, acentos e número S/N", () => {
    expect(validateCheckout({ ...valid, name: "  José D’Ávila  " })).toEqual(
      {},
    );
  });
  it.each(["12", "Ana2", " ", ".-", "A"])(
    "rejeita nome inválido: %s",
    (name) => {
      expect(validateCheckout({ ...valid, name }).name).toBeTruthy();
    },
  );
  it.each(["123", "00000000000", "11111111111", "abc11999999999", ""])(
    "rejeita telefone inválido: %s",
    (phone) => {
      expect(validateCheckout({ ...valid, phone }).phone).toBeTruthy();
    },
  );
  it("aceita telefone com código +55 e telefone fixo", () => {
    expect(
      validateCheckout({ ...valid, phone: "+55 (11) 99999-9999" }),
    ).toEqual({});
    expect(validateCheckout({ ...valid, phone: "(11) 3333-4444" })).toEqual({});
  });
  it("marca cada campo de entrega em branco, incluindo espaços", () => {
    expect(
      Object.keys(
        validateCheckout({
          ...valid,
          street: " ",
          number: "",
          neighborhood: "  ",
        }),
      ),
    ).toEqual(["street", "number", "neighborhood"]);
  });
  it("não exige endereço para retirada", () => {
    expect(
      validateCheckout({
        ...valid,
        mode: "pickup",
        street: "",
        number: "",
        neighborhood: "",
      }),
    ).toEqual({});
  });
});
