"use client";

import { useRouter } from "next/navigation";
import { type ReactElement } from "react";

import {
  WorkshopReadyWaitlist,
  type WorkshopReadyWaitlistMode
} from "@/components/ui/WorkshopReadyWaitlist";

type WorkshopReadyModeContentProps = {
  mode: WorkshopReadyWaitlistMode;
};

export function WorkshopReadyModeContent({
  mode
}: WorkshopReadyModeContentProps): ReactElement {
  const router = useRouter();

  return (
    <div className="fg-live__waitlist">
      <WorkshopReadyWaitlist
        mode={mode}
        onContinueToGuide={() => router.push("/facilitator-guide")}
      />
    </div>
  );
}
