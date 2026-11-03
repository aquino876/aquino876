import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Bike, Store } from "lucide-react";
import { Modal } from "./Modal";
import { ItemCustomization } from "./ItemCustomization";
import { money, unitPrice, cartIssue } from "../lib/cart";
import { validateCheckout } from "../lib/checkout";
import type { CheckoutErrors } from "../lib/checkout";
import { products } from "../data/products";
import type { CartItem, CheckoutDetails, CheckoutField } from "../types";
export function Checkout({
  items,
  total,
  onClose,
  onComplete,
  onBack,
}: {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onComplete: () => void;
  onBack: () => void;
}) {
  const [details, setDetails] = useState<CheckoutDetails>({
    name: "",
    phone: "",
    mode: "delivery",
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
    notes: "",
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [orderError, setOrderError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const issue = cartIssue(items);
  useEffect(() => {
    if (confirmed) {
      scrollRef.current?.scrollTo({ top: 0 });
      confirmationRef.current?.focus({ preventScroll: true });
    }
  }, [confirmed]);
  function changeField(key: CheckoutField, value: string) {
    setDetails((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }
  function field(
    key: CheckoutField,
    label: string,
    required = true,
    placeholder = "",
  ) {
    const id = `checkout-${key}`;
    const autocomplete = {
      name: "name",
      phone: "tel",
      street: "address-line1",
      number: "off",
      neighborhood: "address-level3",
      complement: "address-line2",
    }[key];
    return (
      <div className="field">
        <label htmlFor={id}>
          {label}
          {required ? " *" : ""}
        </label>
        <input
          id={id}
          name={key}
          required={required}
          value={details[key]}
          maxLength={key === "phone" ? 22 : 120}
          autoComplete={autocomplete}
          type={key === "phone" ? "tel" : "text"}
          inputMode={key === "phone" ? "tel" : undefined}
          placeholder={placeholder}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${id}-error` : undefined}
          onChange={(event) => changeField(key, event.target.value)}
        />
        {errors[key] && (
          <span id={`${id}-error`} className="field-error">
            {errors[key]}
          </span>
        )}
      </div>
    );
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (issue) {
      setOrderError(issue);
      return;
    }
    const nextErrors = validateCheckout(details);
    setErrors(nextErrors);
    setOrderError("");
    const first = Object.keys(nextErrors)[0];
    if (first) {
      (
        formRef.current?.elements.namedItem(first) as HTMLInputElement | null
      )?.focus();
      return;
    }
    setConfirmed(true);
  }
  const error = orderError || Object.values(errors).find(Boolean);
  return (
    <Modal
      title={
        confirmed
          ? "Sua experiência está pronta!"
          : "Quase na primeira mordida."
      }
      description={
        confirmed
          ? "Resumo demonstrativo — nenhum pedido foi enviado."
          : "Checkout demonstrativo · sem pagamento ou envio real"
      }
      onClose={onClose}
    >
      <form
        ref={formRef}
        onSubmit={submit}
        className="checkout-form"
        noValidate
      >
        <div ref={scrollRef} className="modal-scroll">
          {confirmed ? (
            <div className="confirmation">
              <span className="success-icon">
                <Check size={30} />
              </span>
              <h3 tabIndex={-1} ref={confirmationRef}>
                Valeu, {details.name.trim()}!
              </h3>
              <p>
                Você concluiu a simulação. Este pedido não foi recebido pela
                hamburgueria.
              </p>
              <div className="confirmation-details">
                <strong>
                  {details.mode === "delivery" ? "Entrega" : "Retirada"}
                </strong>
                <p>
                  {details.mode === "delivery"
                    ? `${details.street.trim()}, ${details.number.trim()} — ${details.neighborhood.trim()}${details.complement.trim() ? `, ${details.complement.trim()}` : ""}`
                    : "Retirada no balcão da Burger House (demonstração)."}
                </p>
                <p>{details.phone.trim()}</p>
                {details.notes.trim() && (
                  <p>Observações: {details.notes.trim()}</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div
                className="checkout-steps"
                aria-label="Etapa 2 de 2: revisar pedido"
              >
                <span>
                  <Check size={13} /> Carrinho
                </span>
                <i />
                <strong>2. Revisar pedido</strong>
              </div>
              <h3 className="form-section-title">Quem vai matar a fome?</h3>
              <p className="field-hint">Os campos com * são obrigatórios.</p>
              {error && (
                <p role="alert" className="error-message form-alert">
                  {error}
                </p>
              )}
              <div className="form-grid">
                {field("name", "Seu nome", true, "Como podemos chamar você?")}
                {field("phone", "Telefone com DDD", true, "(11) 99999-9999")}
              </div>
              <fieldset className="delivery-options">
                <legend>Como você prefere?</legend>
                {(["delivery", "pickup"] as const).map((mode) => (
                  <label
                    className={details.mode === mode ? "selected" : ""}
                    key={mode}
                  >
                    <input
                      type="radio"
                      name="mode"
                      value={mode}
                      checked={details.mode === mode}
                      onChange={() => {
                        setDetails((current) => ({ ...current, mode }));
                        setErrors((current) => ({
                          name: current.name,
                          phone: current.phone,
                        }));
                      }}
                    />
                    {mode === "delivery" ? (
                      <Bike size={20} />
                    ) : (
                      <Store size={20} />
                    )}{" "}
                    {mode === "delivery" ? "Entrega" : "Retirada"}
                  </label>
                ))}
              </fieldset>
              {details.mode === "delivery" ? (
                <div className="form-grid">
                  {field("street", "Endereço", true, "Rua ou avenida")}
                  {field("number", "Número", true, "Número ou S/N")}
                  {field("neighborhood", "Bairro")}
                  {field(
                    "complement",
                    "Complemento",
                    false,
                    "Apartamento, bloco, referência",
                  )}
                </div>
              ) : (
                <p className="info-note">
                  Retirada no balcão da Burger House. Esta loja é fictícia e não
                  possui ponto de retirada real.
                </p>
              )}
              <label className="field">
                Observações do pedido
                <textarea
                  value={details.notes}
                  maxLength={300}
                  placeholder="Algo que devemos saber?"
                  onChange={(event) =>
                    setDetails((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                />
              </label>
            </>
          )}
          <div className="order-review">
            <h3>Resumo do pedido</h3>
            {items.map((item) => {
              const product = products.find(
                (product) => product.id === item.productId,
              )!;
              return (
                <div className="review-item" key={item.id}>
                  <div>
                    <span>
                      {item.quantity}× {product.name}
                    </span>
                    <ItemCustomization item={item} />
                  </div>
                  <b>{money(unitPrice(item) * item.quantity)}</b>
                </div>
              );
            })}
            <div className="review-total">
              <strong>Total · entrega grátis</strong>
              <strong>{money(total)}</strong>
            </div>
          </div>
          {issue && (
            <p role="alert" className="error-message">
              {issue}
            </p>
          )}
        </div>
        <div className="modal-footer checkout-footer">
          {!confirmed && (
            <button
              type="button"
              className="text-button back-button"
              onClick={onBack}
            >
              <ArrowLeft size={16} /> Voltar ao carrinho
            </button>
          )}
          <button
            className="button full"
            disabled={!confirmed && !!issue}
            type={confirmed ? "button" : "submit"}
            onClick={confirmed ? onComplete : undefined}
          >
            {confirmed ? "Concluir demonstração" : "Confirmar pedido"}
            <ArrowRight size={19} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
