import * as Dialog from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
export function Modal({
  title,
  description,
  onClose,
  children,
  drawer = false,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
  drawer?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(true);
  const returnFocus = useRef(
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  function close() {
    if (reduceMotion) onClose();
    else setOpen(false);
  }
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content
          asChild
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            queueMicrotask(() => {
              // A newly opened dialog owns focus when moving from cart to checkout.
              if (document.querySelector('[role="dialog"]')) return;
              const target = returnFocus.current?.isConnected
                ? returnFocus.current
                : document.querySelector<HTMLButtonElement>(".cart-button");
              target?.focus({ preventScroll: true });
            });
          }}
        >
          <motion.section
            initial={drawer ? { x: 60, opacity: 0 } : { y: 18, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget && !open) onClose();
            }}
            className={`modal ${drawer ? "drawer" : ""}`}
          >
            <div className="modal-heading">
              <div>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>{description}</Dialog.Description>
              </div>
              <Dialog.Close className="icon-button" aria-label="Fechar janela">
                <X size={21} />
              </Dialog.Close>
            </div>
            {children}
          </motion.section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
