import type { ReactNode } from "react";

export function SectionHead({ kicker, title, text, as: Tag = "h2" }: { kicker: string; title: ReactNode; text?: string; as?: "h1" | "h2" }) {
  return (
    <div className="ghx-section-head">
      <div className="ghx-kicker"><span aria-hidden="true" />{kicker}</div>
      <Tag>{title}</Tag>
      {text && <p>{text}</p>}
    </div>
  );
}
