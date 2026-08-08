"use client";

import Link from "next/link";

import { clearJourneyChallenge } from "@/src/features/recommendation-journey/journeyState";

export function GuideMeInsteadLink({
  className,
  href = "/internal/journey/diagnosis"
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      className={className}
      href={href}
      onClick={() => {
        clearJourneyChallenge();
      }}
    >
      Guide me instead
    </Link>
  );
}
