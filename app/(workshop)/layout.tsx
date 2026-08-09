import type { ReactNode } from "react";

import { WorkshopModeShell } from "@/components/product/WorkshopModeShell";

export default function WorkshopLayout({ children }: { children: ReactNode }) {
  return (
    <main className="fg-live-page">
      <WorkshopModeShell>{children}</WorkshopModeShell>
    </main>
  );
}
