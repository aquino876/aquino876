import { useEffect, useRef, useState } from "react";
export function useToast() {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function dismiss() {
    if (timer.current) clearTimeout(timer.current);
    setMessage("");
  }
  function show(message: string) {
    if (timer.current) clearTimeout(timer.current);
    setMessage(message);
    timer.current = setTimeout(() => setMessage(""), 5000);
  }
  return { message, show, dismiss };
}
