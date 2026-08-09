"use client";

/**
 * FacilitatorActivityTabs — secondary activity navigation for Facilitator Guide.
 *
 * Renders the workshop activities in the order handed off from the
 * Active Workshop Grid (including any user reordering). Basic underline
 * tabs only — no travelling indicator motion.
 */

import type { KeyboardEvent, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

export type FacilitatorActivityTab = {
  id: string;
  label: string;
};

export type FacilitatorActivityTabsProps = {
  "aria-label"?: string;
  activities: FacilitatorActivityTab[];
  className?: string;
  defaultValue?: string;
  onChange?: (activityId: string) => void;
  value?: string;
};

export function activitiesFromWorkshopCards(
  cards: Array<{ id: string; label?: string; activity?: { title: string } }>
): FacilitatorActivityTab[] {
  return cards.map((card) => ({
    id: card.id,
    label: card.label ?? card.activity?.title ?? card.id
  }));
}

export function FacilitatorActivityTabs({
  "aria-label": ariaLabel = "Workshop activities",
  activities,
  className,
  defaultValue,
  onChange,
  value
}: FacilitatorActivityTabsProps): ReactElement | null {
  const isControlled = value !== undefined;
  const fallbackId = activities[0]?.id ?? "";
  const [uncontrolledId, setUncontrolledId] = useState(
    defaultValue ?? fallbackId
  );
  const activeId = isControlled ? value : uncontrolledId;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isControlled || activities.length === 0) {
      return;
    }

    const stillExists = activities.some(
      (activity) => activity.id === uncontrolledId
    );

    if (!stillExists) {
      setUncontrolledId(activities[0].id);
    }
  }, [activities, isControlled, uncontrolledId]);

  useEffect(() => {
    const activeTab = tabRefs.current[activeId];

    if (!activeTab || !listRef.current) {
      return;
    }

    activeTab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    });
  }, [activeId]);

  if (activities.length === 0) {
    return null;
  }

  const select = (id: string) => {
    if (id === activeId) {
      return;
    }

    if (!isControlled) {
      setUncontrolledId(id);
    }

    onChange?.(id);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    id: string
  ) => {
    const currentIndex = activities.findIndex((activity) => activity.id === id);

    if (currentIndex < 0) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = activities[(currentIndex + 1) % activities.length];
      tabRefs.current[next.id]?.focus();
      select(next.id);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const previous =
        activities[
          (currentIndex - 1 + activities.length) % activities.length
        ];
      tabRefs.current[previous.id]?.focus();
      select(previous.id);
    }

    if (event.key === "Home") {
      event.preventDefault();
      const first = activities[0];
      tabRefs.current[first.id]?.focus();
      select(first.id);
    }

    if (event.key === "End") {
      event.preventDefault();
      const last = activities[activities.length - 1];
      tabRefs.current[last.id]?.focus();
      select(last.id);
    }
  };

  return (
    <div className={["fg-activity-tabs", className].filter(Boolean).join(" ")}>
      <div
        aria-label={ariaLabel}
        className="fg-activity-tabs__list"
        ref={listRef}
        role="tablist"
      >
        {activities.map((activity) => {
          const isActive = activity.id === activeId;

          return (
            <button
              aria-selected={isActive}
              className="fg-activity-tabs__tab"
              data-active={isActive ? "true" : "false"}
              key={activity.id}
              onClick={() => select(activity.id)}
              onKeyDown={(event) => handleKeyDown(event, activity.id)}
              ref={(element) => {
                tabRefs.current[activity.id] = element;
              }}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              <span className="fg-activity-tabs__label">{activity.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
