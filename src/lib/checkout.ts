import type { CheckoutDetails, CheckoutField } from "../types";
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;
export function validateCheckout(details: CheckoutDetails): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const name = details.name.trim();
  if (
    !/^[\p{L}\p{M}\s.'’-]+$/u.test(name) ||
    (name.match(/\p{L}/gu)?.length ?? 0) < 2
  )
    errors.name = "Informe seu nome com pelo menos 2 letras, sem números.";
  const phone = details.phone.trim();
  let digits = phone.replace(/\D/g, "");
  if (/^\+55/.test(phone)) digits = digits.slice(2);
  if (
    !/^[\d\s()+.-]+$/.test(phone) ||
    !/^[1-9]\d\d{8,9}$/.test(digits) ||
    /^(\d)\1+$/.test(digits)
  )
    errors.phone =
      "Informe um telefone com DDD e 10 ou 11 dígitos. Ex.: (11) 99999-9999.";
  if (details.mode === "delivery") {
    if (!details.street.trim())
      errors.street = "Informe o endereço para entrega.";
    if (!details.number.trim()) errors.number = "Informe o número ou S/N.";
    if (!details.neighborhood.trim())
      errors.neighborhood = "Informe o bairro para entrega.";
  }
  return errors;
}
