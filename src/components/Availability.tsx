import { CircleCheck, CircleOff } from "lucide-react";
export function Availability({ available }: { available: boolean }) {
  const Icon = available ? CircleCheck : CircleOff;
  return (
    <span className={`availability ${available ? "in-stock" : "sold-out"}`}>
      <Icon size={12} />
      {available ? "Disponível" : "Esgotado"}
    </span>
  );
}
