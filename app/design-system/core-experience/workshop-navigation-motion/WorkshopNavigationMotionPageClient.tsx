"use client";

import type {
  CSSProperties,
  KeyboardEvent,
  MutableRefObject,
  ReactNode
} from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ComponentOverviewSection,
  ComponentPageShell,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  AlignATeamIcon,
  MakeDecisionsIcon,
  SlowDecisionMakingIcon,
  type DiagnosisIconComponent
} from "@/lib/design-system/diagnosis-icons";

const SYSTEM_ICON_PATH = "/assets/icons/system Icons";

type DestinationId = "guide" | "figjam" | "live";
type ConceptId =
  | "elastic"
  | "focus"
  | "depth"
  | "segment"
  | "pop"
  | "elasticPop"
  | "elasticPopRtl";
type PlaybackSpeed = "normal" | "slow";

type Destination = {
  Icon: DiagnosisIconComponent;
  id: DestinationId;
  label: string;
};

type ItemRect = {
  center: number;
  left: number;
  width: number;
};

type MotionPhase = "idle" | "exit" | "travel" | "arrival" | "settle";

type MotionState = {
  commitAt: number;
  direction: number;
  distance: number;
  duration: number;
  from: DestinationId;
  phase: MotionPhase;
  replayKey: number;
  startedAt: number;
  to: DestinationId;
  version: number;
};

const destinations: Destination[] = [
  { Icon: AlignATeamIcon, id: "guide", label: "Facilitator Guide" },
  { Icon: MakeDecisionsIcon, id: "figjam", label: "FigJam Board" },
  { Icon: SlowDecisionMakingIcon, id: "live", label: "PlayBooky Live" }
];

const destinationIndex = new Map(
  destinations.map((destination, index) => [destination.id, index])
);

const activeIconPopLabels: Record<DestinationId, string> = {
  figjam: "Workshop Builder",
  guide: "Facilitator Guide",
  live: "Presentation Mode"
};

const componentMetadata = {
  category: "Core Experience -> Navigation",
  confidence: "2 Motion exploration",
  lastUpdated: "2026-07-28",
  owner: "Design System",
  status: "Prototype",
  title: "Workshop Navigation Motion"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "elastic-slider", label: "Elastic Slider" },
  { id: "focus-window", label: "Focus Window" },
  { id: "depth-stack", label: "Depth Stack" },
  { id: "segment-flow", label: "Segment Flow" },
  { id: "active-icon-pop", label: "Active Icon Pop" },
  { id: "active-elastic-pop", label: "Active Elastic Pop" },
  { id: "active-elastic-pop-rtl", label: "Active Elastic Pop (RTL Icon)" }
];

const overviewCopy = {
  statusNote:
    "Elastic Slider remains the original baseline. Focus Window, Depth Stack, and Segment Flow explore shared-geometry and layered motion models. Active Icon Pop is a deliberately simpler direction: only the active tab ever shows an icon. Active Elastic Pop combines that active-only icon principle with the Elastic Slider's travelling surface. Active Elastic Pop (RTL Icon) is the same concept with the icon reveal sliding in from the right instead of fading straight up, shown side by side for comparison.",
  summary:
    "Workshop Navigation Motion explores seven ways the contextual Workshop Ready navigation can move between destinations.",
  whatItIs:
    "A motion-only component page for comparing active-state travel, icon continuity, and reduced-motion behaviour on the real three-item workshop navigation.",
  whenNotToUse:
    "Do not use this page to approve new navigation layout, labels, colours, or information architecture.",
  whenToUse:
    "Use it to select destinations in any order, replay transitions, preview reduced motion, and compare normal and slow playback.",
  whereItAppears:
    "Workshop Ready and Facilitator Guide experiences where the user moves between guide content, the FigJam board, and PlayBooky Live.",
  whyItExists:
    "To isolate the active indicator and icon movement before choosing the production navigation motion."
};

const conceptSpecs: Record<
  ConceptId,
  Array<{
    body: string;
    label: string;
  }>
> = {
  elastic: [
    {
      label: "Resting state",
      body: "The selected item sits inside one continuous cream active container with the current icon held in the leading cluster."
    },
    {
      label: "Exit",
      body: "The active container begins to stretch in the direction of travel while the outgoing icon scales down and fades into the moving surface."
    },
    {
      label: "Travel",
      body: "The leading edge moves ahead of the trailing edge. Longer jumps increase speed, stretch, and visual tension."
    },
    {
      label: "Arrival",
      body: "The container overshoots the destination in the direction of movement as the incoming icon appears from inside the surface."
    },
    {
      label: "Settle",
      body: "The pill compresses back to its resting shape with a soft rebound. Text colour catches up just after the indicator commits."
    },
    {
      label: "Skipping over an item",
      body: "A two-position jump travels as one continuous shape, stretches further, and rebounds slightly more than a one-position move."
    }
  ],
  focus: [
    {
      label: "Resting state",
      body: "A single focus window sits behind the active item, sized exactly to that item's measured geometry."
    },
    {
      label: "Exit",
      body: "The outgoing icon and label recede slightly in scale and opacity as the window begins moving away from them."
    },
    {
      label: "Travel",
      body: "The window's position and width interpolate directly toward the destination in one motion. No overshoot, no detour, no secondary element."
    },
    {
      label: "Arrival",
      body: "The window resolves at the destination's exact rect. Nothing overshoots past it."
    },
    {
      label: "Settle",
      body: "The incoming icon and label return to full scale and opacity as the window finishes resizing underneath them."
    },
    {
      label: "Skipping over an item",
      body: "The window still moves as one continuous rect tween across the full distance. The skipped item never receives its own motion."
    }
  ],
  depth: [
    {
      label: "Resting state",
      body: "The active item carries a raised surface with a soft shadow. Inactive items sit flat with no elevation."
    },
    {
      label: "Exit",
      body: "The outgoing item's surface recedes: its shadow fades, it settles by one pixel, and its icon dims and compresses slightly."
    },
    {
      label: "Travel",
      body: "There is no travelling element. Only the outgoing and incoming items change state, in place."
    },
    {
      label: "Arrival",
      body: "The incoming item's icon reveals through an expanding circular mask as its surface begins to rise."
    },
    {
      label: "Settle",
      body: "The incoming surface reaches full elevation and shadow. The label settles upward into place as opacity completes."
    },
    {
      label: "Skipping over an item",
      body: "The middle item is untouched. Only the source and destination items change elevation, regardless of distance."
    }
  ],
  segment: [
    {
      label: "Resting state",
      body: "The track is one connected surface. The active segment holds a wider share of the track; the other two share the remainder equally."
    },
    {
      label: "Exit",
      body: "As soon as a new item is selected, the outgoing segment begins narrowing and the destination segment begins widening, together."
    },
    {
      label: "Travel",
      body: "Segment widths and the active fill redistribute continuously. The icon and label stay in normal flow and shift only as their own segment resizes."
    },
    {
      label: "Arrival",
      body: "The destination segment reaches its expanded width and the active fill settles inside it."
    },
    {
      label: "Settle",
      body: "Label emphasis and icon opacity finish resolving to match the segment's new expanded or collapsed state."
    },
    {
      label: "Skipping over an item",
      body: "The middle segment's width is unaffected, since it is neither the source nor the destination. Only two segments ever move."
    }
  ],
  pop: [
    {
      label: "Resting state",
      body: "Only the active tab carries the highlight and its icon. Inactive tabs show text only, with no reserved icon space."
    },
    {
      label: "Hover preview",
      body: "Hovering or focusing an inactive tab pops its icon subtly into view beside the label, which reflows to stay centred. The active state does not change. Leaving reverts it."
    },
    {
      label: "Exit (previous tab)",
      body: "The outgoing tab's icon scales down, fades, and collapses back into the label's space as its highlight is removed, in a single coordinated step."
    },
    {
      label: "Arrival (new tab)",
      body: "The selected tab receives the highlight immediately and its icon pops into place beside the label, which repositions to keep the pair centred."
    },
    {
      label: "Settle",
      body: "The pop-in and pop-out finish together at a fixed, fast duration, independent of how far apart the two tabs are."
    },
    {
      label: "Skipping over an item",
      body: "Distance has no effect: the icon never travels between tabs. Only the source and destination tabs animate, regardless of how many tabs sit between them."
    }
  ],
  elasticPop: [
    {
      label: "Resting state",
      body: "Every tab permanently reserves its icon's width and a fixed 16px icon-to-label gap, so each tab's own footprint never changes based on active state. Only the active tab's icon is visible (opacity and scale); every tab's geometry is already final at rest."
    },
    {
      label: "Phase 1 - Old icon exits",
      body: "Immediately on selection, the outgoing tab's icon fades and scales down in place, over roughly 120-170ms. Only opacity and scale animate - its reserved space never changes size, so nothing around it reflows."
    },
    {
      label: "Phase 2 - Elastic surface travels",
      body: "The destination's complete final width, measured directly from its real (always icon-reserved) layout, is used as the surface's target from the very start. The surface stretches gently toward it over roughly 260-360ms, with a calmer curve and smaller stretch than Elastic Slider, and no overshoot stage - so arrival never needs a second correction. If redirected mid-flight, it resumes from its current visual position rather than snapping back."
    },
    {
      label: "Phase 3 - New icon reveals",
      body: "The destination icon pops in only once the surface is nearly arrived, around 78% of travel, animating opacity and a small scale/vertical offset only, entirely inside its already-reserved space. The outer tab width never changes, so the label never jumps."
    },
    {
      label: "Active-state commitment",
      body: "The formal active state, and its accessible selection, commits at 85% of the surface's travel: by that point the old icon is already fully hidden, while the new icon is still mid-reveal. This keeps the accessible state accurate without ever showing two tabs as active, and without the icon appearing before the surface has essentially landed."
    },
    {
      label: "Skipping over an item",
      body: "A first-to-third jump travels directly to the destination using its complete reserved-icon width from the start. The middle tab is never activated, briefly highlighted, or resized, and the fixed 32px gaps either side of it stay exactly as they are at rest."
    }
  ],
  elasticPopRtl: [
    {
      label: "Resting state",
      body: "Identical to Active Elastic Pop: only the active tab reserves its icon's space, every other tab is text-only, and the fixed 32px/16px gaps are unaffected by which tab is active."
    },
    {
      label: "Phase 1 - Old icon exits",
      body: "The outgoing icon fades and slides slightly rightward as it leaves, rather than just scaling down in place, so the exit reads as a directional counterpart to the new icon's entrance."
    },
    {
      label: "Phase 2 - Elastic surface travels",
      body: "Unchanged from Active Elastic Pop: the same calmer, overshoot-free elastic curve, the same complete destination width calculated up front, side by side for direct comparison."
    },
    {
      label: "Phase 3 - New icon reveals",
      body: "The only difference from Active Elastic Pop: the destination icon slides in from the right (translateX) while it fades and scales up, rather than easing straight in from a fixed position. It still only starts once the surface is nearly arrived, and still animates entirely inside its already-reserved space."
    },
    {
      label: "Active-state commitment",
      body: "Same 85%-of-travel commitment point as Active Elastic Pop - only the icon's own reveal direction differs between the two versions."
    },
    {
      label: "Skipping over an item",
      body: "Behaves identically to Active Elastic Pop: the surface travels directly, the middle tab is untouched, and only the destination icon's directional slide-in differs."
    }
  ]
};

const conceptSummaries: Record<ConceptId, string> = {
  elastic:
    "The selected container travels horizontally between items as one continuous elastic shape.",
  focus:
    "A single measured focus window translates and resizes directly to the selected item, with icon and label responding through restrained scale and opacity.",
  depth:
    "The incoming item rises through elevation, masking, and hierarchy while the outgoing item recedes in place. Nothing travels horizontally.",
  segment:
    "The navigation track behaves as one connected surface. Selecting an item redistributes segment widths and the active fill boundary continuously.",
  pop:
    "Only the active tab ever shows an icon. Inactive tabs preview their icon on hover, and switching tabs triggers a coordinated pop-out and pop-in rather than any element travelling between tabs.",
  elasticPop:
    "Combines the Elastic Slider's travelling surface with Active Icon Pop's active-only icon: the old icon exits, the elastic surface travels directly to the destination's complete final width, and only then does the new icon pop into its already-reserved space, never on hover and never before the surface has landed.",
  elasticPopRtl:
    "The same Active Elastic Pop sequence, side by side for comparison, with one difference: the destination icon slides in from the right as it fades and scales up, instead of easing straight in from a fixed position."
};

function SystemIcon({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="block h-4 w-4 shrink-0 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:16px_16px]"
      style={{
        WebkitMaskImage: `url("${SYSTEM_ICON_PATH}/${name}.svg")`,
        maskImage: `url("${SYSTEM_ICON_PATH}/${name}.svg")`
      }}
    />
  );
}

function getIndex(id: DestinationId) {
  return destinationIndex.get(id) ?? 0;
}

function getDuration(distance: number, speed: PlaybackSpeed, reduced: boolean) {
  if (reduced) {
    return speed === "slow" ? 520 : 240;
  }

  const base = distance > 1 ? 760 : 640;
  return speed === "slow" ? base * 1.75 : base;
}

function createMotionState({
  active,
  playbackSpeed,
  reducedMotion,
  replayKey,
  target,
  version
}: {
  active: DestinationId;
  playbackSpeed: PlaybackSpeed;
  reducedMotion: boolean;
  replayKey: number;
  target: DestinationId;
  version: number;
}): MotionState {
  const fromIndex = getIndex(active);
  const toIndex = getIndex(target);
  const distance = Math.abs(toIndex - fromIndex);
  const duration = getDuration(Math.max(distance, 1), playbackSpeed, reducedMotion);

  return {
    commitAt: reducedMotion ? 0.5 : 0.58,
    direction: Math.sign(toIndex - fromIndex) || 1,
    distance: Math.max(distance, 1),
    duration,
    from: active,
    phase: "exit",
    replayKey,
    startedAt: Date.now(),
    to: target,
    version
  };
}

function useMeasuredNavigation() {
  const navRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<DestinationId, HTMLButtonElement | null>>({
    figjam: null,
    guide: null,
    live: null
  });
  const [rects, setRects] = useState<Record<DestinationId, ItemRect>>({
    figjam: { center: 0, left: 0, width: 0 },
    guide: { center: 0, left: 0, width: 0 },
    live: { center: 0, left: 0, width: 0 }
  });

  const measure = useCallback(() => {
    const nav = navRef.current;

    if (!nav) {
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const nextRects: Record<DestinationId, ItemRect> = {
      figjam: { center: 0, left: 0, width: 0 },
      guide: { center: 0, left: 0, width: 0 },
      live: { center: 0, left: 0, width: 0 }
    };

    destinations.forEach((destination) => {
      const item = itemRefs.current[destination.id];

      if (!item) {
        return;
      }

      const itemRect = item.getBoundingClientRect();
      nextRects[destination.id] = {
        center: itemRect.left - navRect.left + itemRect.width / 2,
        left: itemRect.left - navRect.left,
        width: itemRect.width
      };
    });

    setRects(nextRects);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return { itemRefs, measure, navRef, rects };
}

function useWorkshopNavigationMotion() {
  const [active, setActive] = useState<DestinationId>("guide");
  const [displayed, setDisplayed] = useState<DestinationId>("guide");
  const [motion, setMotion] = useState<MotionState | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>("normal");
  const [reducedMotion, setReducedMotion] = useState(false);
  const versionRef = useRef(0);
  const replayRef = useRef(0);
  const timeouts = useRef<number[]>([]);

  const clearMotionTimeouts = useCallback(() => {
    timeouts.current.forEach((timeout) => window.clearTimeout(timeout));
    timeouts.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearMotionTimeouts();
    };
  }, [clearMotionTimeouts]);

  const startTransition = useCallback(
    (target: DestinationId, forceReplay = false) => {
      if (target === active && !forceReplay) {
        return;
      }

      clearMotionTimeouts();
      versionRef.current += 1;

      if (forceReplay) {
        replayRef.current += 1;
      }

      const version = versionRef.current;
      const nextMotion = createMotionState({
        active,
        playbackSpeed,
        reducedMotion,
        replayKey: replayRef.current,
        target,
        version
      });

      setDisplayed(active);
      setMotion(nextMotion);

      const phasePlan: Array<[MotionPhase, number]> = reducedMotion
        ? [
            ["arrival", nextMotion.duration * 0.35],
            ["settle", nextMotion.duration * 0.7]
          ]
        : [
            ["travel", nextMotion.duration * 0.18],
            ["arrival", nextMotion.duration * 0.58],
            ["settle", nextMotion.duration * 0.82]
          ];

      phasePlan.forEach(([phase, delay]) => {
        const timeout = window.setTimeout(() => {
          if (versionRef.current !== version) {
            return;
          }
          setMotion((current) => (current ? { ...current, phase } : current));
        }, delay);
        timeouts.current.push(timeout);
      });

      const commitTimeout = window.setTimeout(() => {
        if (versionRef.current !== version) {
          return;
        }
        setActive(target);
        setDisplayed(target);
      }, nextMotion.duration * nextMotion.commitAt);

      const finishTimeout = window.setTimeout(() => {
        if (versionRef.current !== version) {
          return;
        }
        setMotion(null);
      }, nextMotion.duration + 80);

      timeouts.current.push(commitTimeout, finishTimeout);
    },
    [active, clearMotionTimeouts, playbackSpeed, reducedMotion]
  );

  const moveBy = (offset: number) => {
    const currentIndex = getIndex(active);
    const nextIndex =
      (currentIndex + offset + destinations.length) % destinations.length;
    startTransition(destinations[nextIndex].id);
  };

  const replay = () => {
    const currentIndex = getIndex(active);
    const nextIndex = (currentIndex + 1) % destinations.length;
    startTransition(destinations[nextIndex].id, true);
  };

  return {
    active,
    displayed,
    motion,
    moveBy,
    playbackSpeed,
    reducedMotion,
    replay,
    setPlaybackSpeed,
    setReducedMotion,
    startTransition
  };
}

function MotionControls({
  active,
  labels,
  onMove,
  onReplay,
  onSelect,
  playbackSpeed,
  reducedMotion,
  setPlaybackSpeed,
  setReducedMotion
}: {
  active: DestinationId;
  labels?: Partial<Record<DestinationId, string>>;
  onMove: (offset: number) => void;
  onReplay: () => void;
  onSelect: (destination: DestinationId) => void;
  playbackSpeed: PlaybackSpeed;
  reducedMotion: boolean;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  setReducedMotion: (enabled: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[8px] border border-white/[0.12] bg-black/25 p-3">
      <div className="flex flex-wrap gap-2">
        <IconButton label="Previous item" onClick={() => onMove(-1)}>
          <SystemIcon name="chevron-left" />
        </IconButton>
        <IconButton label="Next item" onClick={() => onMove(1)}>
          <SystemIcon name="chevron-right" />
        </IconButton>
        <IconButton label="Replay animation" onClick={onReplay}>
          <SystemIcon name="refresh-cw" />
        </IconButton>
      </div>

      <div className="flex flex-wrap gap-2">
        {destinations.map((destination) => (
          <button
            aria-pressed={active === destination.id}
            className={[
              "rounded-[8px] border px-3 py-2 text-[12px] font-semibold leading-4 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#d99c56]/55 motion-reduce:transition-none",
              active === destination.id
                ? "border-[#d99c56]/60 bg-[#f3eee7] text-[#324236]"
                : "border-white/[0.12] bg-white/[0.04] text-[#d4d4d4] hover:border-white/[0.22] hover:bg-white/[0.07]"
            ].join(" ")}
            key={destination.id}
            onClick={() => onSelect(destination.id)}
            type="button"
          >
            {labels?.[destination.id] ?? destination.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-[12px] font-medium leading-5 text-[#d4d4d4]">
          <input
            checked={reducedMotion}
            className="h-4 w-4 accent-[#d99c56]"
            onChange={(event) => setReducedMotion(event.target.checked)}
            type="checkbox"
          />
          Reduced-motion preview
        </label>

        <div
          aria-label="Playback speed"
          className="inline-flex rounded-[8px] border border-white/[0.12] bg-white/[0.04] p-1"
          role="group"
        >
          {(["normal", "slow"] as const).map((speed) => (
            <button
              aria-pressed={playbackSpeed === speed}
              className={[
                "rounded-[6px] px-3 py-1.5 text-[12px] font-semibold capitalize leading-4 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#d99c56]/55 motion-reduce:transition-none",
                playbackSpeed === speed
                  ? "bg-[#f3eee7] text-[#324236]"
                  : "text-[#a1a1a1] hover:text-[#ededed]"
              ].join(" ")}
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              type="button"
            >
              {speed}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/[0.12] bg-white/[0.04] text-[#d4d4d4] transition-colors hover:border-white/[0.22] hover:bg-white/[0.07] hover:text-[#ededed] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#d99c56]/55 motion-reduce:transition-none"
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function WorkshopNavigation({
  active,
  concept,
  displayed,
  motion,
  onSelect,
  reducedMotion
}: {
  active: DestinationId;
  concept: ConceptId;
  displayed: DestinationId;
  motion: MotionState | null;
  onSelect: (destination: DestinationId) => void;
  reducedMotion: boolean;
}) {
  const { itemRefs, measure, navRef, rects } = useMeasuredNavigation();
  const indicatorStyle = getIndicatorStyle(concept, motion, rects, displayed);
  const showIndicator = concept === "elastic" || concept === "focus";
  const segmentExpandedId = motion ? motion.to : displayed;

  const handleKeyDown = (event: KeyboardEvent, destination: DestinationId) => {
    const currentIndex = getIndex(destination);

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = destinations[(currentIndex + 1) % destinations.length];
      itemRefs.current[next.id]?.focus();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const previous =
        destinations[
          (currentIndex - 1 + destinations.length) % destinations.length
        ];
      itemRefs.current[previous.id]?.focus();
    }
  };

  useEffect(() => {
    measure();
  }, [active, displayed, measure, motion]);

  return (
    <div className="workshop-motion-stage">
      <div
        aria-label="Workshop navigation"
        className="workshop-motion-nav"
        data-concept={concept}
        data-motion={motion ? motion.phase : "idle"}
        data-reduced-motion={reducedMotion ? "true" : "false"}
        ref={navRef}
        role="tablist"
        style={
          {
            "--motion-duration": `${motion?.duration ?? 0}ms`,
            "--motion-direction": motion?.direction ?? 1,
            "--motion-distance": motion?.distance ?? 1
          } as CSSProperties
        }
      >
        {showIndicator ? (
          <span
            aria-hidden="true"
            className="workshop-motion-active-indicator"
            key={`indicator-${concept}-${motion?.version ?? "idle"}-${motion?.replayKey ?? 0}`}
            style={indicatorStyle}
          />
        ) : null}

        {destinations.map((destination) => {
          const isActive = active === destination.id;
          const isDisplayed = displayed === destination.id;
          const isFrom = motion?.from === destination.id;
          const isTo = motion?.to === destination.id;
          const isSegmentExpanded =
            concept === "segment" && segmentExpandedId === destination.id;

          return (
            <button
              aria-selected={isActive}
              className="workshop-motion-item"
              data-active={isActive ? "true" : "false"}
              data-displayed={isDisplayed ? "true" : "false"}
              data-from={isFrom ? "true" : "false"}
              data-segment-expanded={isSegmentExpanded ? "true" : "false"}
              data-to={isTo ? "true" : "false"}
              key={destination.id}
              onClick={() => onSelect(destination.id)}
              onKeyDown={(event) => handleKeyDown(event, destination.id)}
              ref={(element) => {
                itemRefs.current[destination.id] = element;
              }}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {concept === "depth" ? (
                <span aria-hidden="true" className="workshop-motion-item-surface" />
              ) : null}
              <span className="workshop-motion-item-icon">
                <destination.Icon
                  alt=""
                  aria-hidden="true"
                  height={20}
                  width={20}
                />
              </span>
              <span className="workshop-motion-item-label">
                {destination.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getIndicatorStyle(
  concept: ConceptId,
  motion: MotionState | null,
  rects: Record<DestinationId, ItemRect>,
  displayed: DestinationId
) {
  if (!motion) {
    return {
      transform: `translateX(${rects[displayed].left}px)`,
      width: rects[displayed].width
    };
  }

  const from = rects[motion.from];
  const to = rects[motion.to];

  if (concept === "elastic") {
    const travel = to.left - from.left;
    const overshoot = motion.direction * (motion.distance > 1 ? 18 : 10);
    const stretch = motion.distance > 1 ? 34 : 20;
    const settleOffset = motion.direction * -5;
    const restingWidth = to.width;
    const maxWidth = Math.abs(to.center - from.center) + restingWidth + stretch;

    return {
      "--icon-in-x": `${motion.direction * -14}px`,
      "--icon-out-x": `${motion.direction * 16}px`,
      "--elastic-start-x": `${from.left}px`,
      "--elastic-stretch-x": `${Math.min(from.left, to.left) - stretch / 2}px`,
      "--elastic-arrive-x": `${to.left + overshoot}px`,
      "--elastic-settle-x": `${to.left + settleOffset}px`,
      "--elastic-end-x": `${to.left}px`,
      "--elastic-start-width": `${from.width}px`,
      "--elastic-stretch-width": `${maxWidth}px`,
      "--elastic-arrive-width": `${Math.max(restingWidth - 8, 120)}px`,
      "--elastic-end-width": `${restingWidth}px`,
      "--quiet-start-x": `${from.left}px`,
      "--quiet-end-x": `${to.left}px`,
      "--quiet-start-width": `${from.width}px`,
      "--quiet-end-width": `${to.width}px`,
      transform: `translateX(${from.left + travel}px)`,
      width: to.width
    } as CSSProperties;
  }

  return {
    "--quiet-start-x": `${from.left}px`,
    "--quiet-end-x": `${to.left}px`,
    "--quiet-start-width": `${from.width}px`,
    "--quiet-end-width": `${to.width}px`,
    transform: `translateX(${to.left}px)`,
    width: to.width
  } as CSSProperties;
}

function ConceptDemo({
  concept,
  id,
  title
}: {
  concept: ConceptId;
  id: string;
  title: string;
}) {
  const motionState = useWorkshopNavigationMotion();

  return (
    <section className="scroll-mt-28 py-10" id={id}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase leading-5 text-[#737373]">
            Concept
          </p>
          <h3 className="mt-1 text-[22px] font-semibold leading-8 text-[#f5f5f5]">
            {title}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
            {conceptSummaries[concept]}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-[10px] border border-white/[0.14] bg-[#111214] p-5">
          <WorkshopNavigation
            active={motionState.active}
            concept={concept}
            displayed={motionState.displayed}
            motion={motionState.motion}
            onSelect={motionState.startTransition}
            reducedMotion={motionState.reducedMotion}
          />
        </div>

        <MotionControls
          active={motionState.active}
          onMove={motionState.moveBy}
          onReplay={motionState.replay}
          onSelect={motionState.startTransition}
          playbackSpeed={motionState.playbackSpeed}
          reducedMotion={motionState.reducedMotion}
          setPlaybackSpeed={motionState.setPlaybackSpeed}
          setReducedMotion={motionState.setReducedMotion}
        />
      </div>

      <MotionSpec concept={concept} />
    </section>
  );
}

function MotionSpec({ concept }: { concept: ConceptId }) {
  return (
    <div className="mt-6 rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-5">
      <h4 className="text-[15px] font-semibold leading-6 text-[#ededed]">
        Motion Spec
      </h4>
      <dl className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {conceptSpecs[concept].map((spec) => (
          <div className="border-l-2 border-[#d99c56]/60 pl-4" key={spec.label}>
            <dt className="text-[13px] font-semibold leading-5 text-[#ededed]">
              {spec.label}
            </dt>
            <dd className="mt-1 text-sm leading-6 text-[#a1a1a1]">
              {spec.body}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

type PopMotionState = {
  from: DestinationId;
  replayKey: number;
  to: DestinationId;
  version: number;
};

function getPopDuration(speed: PlaybackSpeed, reduced: boolean) {
  if (reduced) {
    return speed === "slow" ? 260 : 140;
  }

  return speed === "slow" ? 400 : 220;
}

function useActiveIconPopMotion() {
  const [active, setActive] = useState<DestinationId>("guide");
  const [motion, setMotion] = useState<PopMotionState | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>("normal");
  const [reducedMotion, setReducedMotion] = useState(false);
  const versionRef = useRef(0);
  const replayRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearPendingTimeout();
    };
  }, [clearPendingTimeout]);

  const startTransition = useCallback(
    (target: DestinationId, forceReplay = false) => {
      if (target === active && !forceReplay) {
        return;
      }

      clearPendingTimeout();
      versionRef.current += 1;

      if (forceReplay) {
        replayRef.current += 1;
      }

      const version = versionRef.current;
      const duration = getPopDuration(playbackSpeed, reducedMotion);

      setMotion({
        from: active,
        replayKey: replayRef.current,
        to: target,
        version
      });

      timeoutRef.current = window.setTimeout(() => {
        if (versionRef.current !== version) {
          return;
        }
        setActive(target);
        setMotion(null);
      }, duration);
    },
    [active, clearPendingTimeout, playbackSpeed, reducedMotion]
  );

  const moveBy = (offset: number) => {
    const currentIndex = getIndex(active);
    const nextIndex =
      (currentIndex + offset + destinations.length) % destinations.length;
    startTransition(destinations[nextIndex].id);
  };

  const replay = () => {
    startTransition(active, true);
  };

  return {
    active,
    motion,
    moveBy,
    playbackSpeed,
    reducedMotion,
    replay,
    setPlaybackSpeed,
    setReducedMotion,
    startTransition
  };
}

function ActiveIconPopIcon({
  Icon,
  className = "icon-pop-icon",
  style,
  token,
  visible
}: {
  Icon: DiagnosisIconComponent;
  className?: string;
  style?: CSSProperties;
  token: number;
  visible: boolean;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!visible) {
      setEntered(false);
      return;
    }

    setEntered(false);
    const frame = requestAnimationFrame(() => setEntered(true));

    return () => cancelAnimationFrame(frame);
  }, [token, visible]);

  return (
    <span
      aria-hidden="true"
      className={className}
      data-icon-visible={entered ? "true" : "false"}
      style={style}
    >
      <Icon alt="" height={18} width={18} />
    </span>
  );
}

function ActiveIconPopNav({
  active,
  motion,
  onSelect,
  playbackSpeed,
  reducedMotion
}: {
  active: DestinationId;
  motion: PopMotionState | null;
  onSelect: (destination: DestinationId) => void;
  playbackSpeed: PlaybackSpeed;
  reducedMotion: boolean;
}) {
  const itemRefs = useRef<Record<DestinationId, HTMLButtonElement | null>>({
    figjam: null,
    guide: null,
    live: null
  });
  const [previewId, setPreviewId] = useState<DestinationId | null>(null);
  const visualActiveId = motion ? motion.to : active;
  const token = motion?.version ?? 0;

  const clearPreview = (destination: DestinationId) => {
    setPreviewId((current) => (current === destination ? null : current));
  };

  const handleKeyDown = (event: KeyboardEvent, destination: DestinationId) => {
    const currentIndex = getIndex(destination);

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = destinations[(currentIndex + 1) % destinations.length];
      itemRefs.current[next.id]?.focus();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const previous =
        destinations[
          (currentIndex - 1 + destinations.length) % destinations.length
        ];
      itemRefs.current[previous.id]?.focus();
    }
  };

  return (
    <div className="workshop-motion-stage">
      <div
        aria-label="Workshop navigation"
        className="icon-pop-nav"
        data-reduced-motion={reducedMotion ? "true" : "false"}
        role="tablist"
        style={
          {
            "--pop-duration": `${getPopDuration(playbackSpeed, reducedMotion)}ms`
          } as CSSProperties
        }
      >
        {destinations.map((destination) => {
          const isActive = active === destination.id;
          const isVisualActive = visualActiveId === destination.id;
          const isPreviewed = previewId === destination.id;
          const iconVisible = isVisualActive || isPreviewed;

          return (
            <button
              aria-selected={isActive}
              className="icon-pop-tab"
              data-visual-active={isVisualActive ? "true" : "false"}
              key={destination.id}
              onBlur={() => clearPreview(destination.id)}
              onClick={() => onSelect(destination.id)}
              onFocus={() => setPreviewId(destination.id)}
              onKeyDown={(event) => handleKeyDown(event, destination.id)}
              onMouseEnter={() => setPreviewId(destination.id)}
              onMouseLeave={() => clearPreview(destination.id)}
              ref={(element) => {
                itemRefs.current[destination.id] = element;
              }}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              <ActiveIconPopIcon
                Icon={destination.Icon}
                token={token}
                visible={iconVisible}
              />
              <span className="icon-pop-label">
                {activeIconPopLabels[destination.id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ActiveIconPopDemo() {
  const motionState = useActiveIconPopMotion();

  return (
    <section className="scroll-mt-28 py-10" id="active-icon-pop">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase leading-5 text-[#737373]">
            Concept
          </p>
          <h3 className="mt-1 text-[22px] font-semibold leading-8 text-[#f5f5f5]">
            Active Icon Pop
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
            {conceptSummaries.pop}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-[10px] border border-white/[0.14] bg-[#111214] p-5">
          <ActiveIconPopNav
            active={motionState.active}
            motion={motionState.motion}
            onSelect={motionState.startTransition}
            playbackSpeed={motionState.playbackSpeed}
            reducedMotion={motionState.reducedMotion}
          />
        </div>

        <MotionControls
          active={motionState.active}
          labels={activeIconPopLabels}
          onMove={motionState.moveBy}
          onReplay={motionState.replay}
          onSelect={motionState.startTransition}
          playbackSpeed={motionState.playbackSpeed}
          reducedMotion={motionState.reducedMotion}
          setPlaybackSpeed={motionState.setPlaybackSpeed}
          setReducedMotion={motionState.setReducedMotion}
        />
      </div>

      <MotionSpec concept="pop" />
    </section>
  );
}

type ElasticPopMotionState = {
  direction: number;
  distance: number;
  duration: number;
  from: DestinationId;
  fromRect: ItemRect;
  iconExitDuration: number;
  iconRevealDelay: number;
  iconRevealDuration: number;
  replayKey: number;
  to: DestinationId;
  toRect: ItemRect;
  version: number;
};

// Icon (18px) + the fixed 16px icon-to-label gap. Reserved only on the
// active/destination tab - every other tab stays text-only with zero
// reserved space, so resting tabs never carry phantom icon padding.
const ELASTIC_POP_ICON_RESERVE = 34;

function getElasticPopTiming(
  distance: number,
  speed: PlaybackSpeed,
  reduced: boolean
) {
  const scale = speed === "slow" ? 1.75 : 1;

  if (reduced) {
    const surfaceDuration = speed === "slow" ? 380 : 220;

    return {
      commitAt: 1,
      iconExitDuration: speed === "slow" ? 180 : 100,
      iconRevealDelay: surfaceDuration,
      iconRevealDuration: speed === "slow" ? 240 : 140,
      surfaceDuration
    };
  }

  const surfaceDuration = Math.round((distance > 1 ? 340 : 300) * scale);
  const iconExitDuration = Math.round(150 * scale);
  const iconRevealDuration = Math.round(190 * scale);
  const iconRevealDelay = Math.round(surfaceDuration * 0.78);

  return {
    commitAt: 0.85,
    iconExitDuration,
    iconRevealDelay,
    iconRevealDuration,
    surfaceDuration
  };
}

function getElasticPopSurfaceStyle(
  motion: ElasticPopMotionState,
  from: ItemRect,
  to: ItemRect
): CSSProperties {
  const travel = to.left - from.left;
  // A gentle, controlled stretch only - no overshoot stage, so arrival
  // never corrects itself and never disturbs the relationship between tabs.
  const stretch = motion.distance > 1 ? 14 : 8;
  const restingWidth = to.width;
  const maxWidth = Math.abs(to.center - from.center) + restingWidth + stretch;

  return {
    "--elastic-start-x": `${from.left}px`,
    "--elastic-pop-stretch-x": `${Math.min(from.left, to.left) - stretch / 2}px`,
    "--elastic-pop-stretch-width": `${maxWidth}px`,
    "--elastic-end-x": `${to.left}px`,
    "--elastic-start-width": `${from.width}px`,
    "--elastic-end-width": `${restingWidth}px`,
    "--quiet-start-x": `${from.left}px`,
    "--quiet-end-x": `${to.left}px`,
    "--quiet-start-width": `${from.width}px`,
    "--quiet-end-width": `${to.width}px`,
    transform: `translateX(${from.left + travel}px)`,
    width: to.width
  } as CSSProperties;
}

function useActiveElasticPopMotion() {
  const { itemRefs, measure, navRef, rects } = useMeasuredNavigation();
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState<DestinationId>("guide");
  const [displayed, setDisplayed] = useState<DestinationId>("guide");
  const [motion, setMotion] = useState<ElasticPopMotionState | null>(null);
  const [revealedTargetId, setRevealedTargetId] =
    useState<DestinationId | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>("normal");
  const [reducedMotion, setReducedMotion] = useState(false);
  const versionRef = useRef(0);
  const replayRef = useRef(0);
  const motionRef = useRef<ElasticPopMotionState | null>(null);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    motionRef.current = motion;
  }, [motion]);

  const clearPendingTimeouts = useCallback(() => {
    timeouts.current.forEach((timeout) => window.clearTimeout(timeout));
    timeouts.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearPendingTimeouts();
    };
  }, [clearPendingTimeouts]);

  const startTransition = useCallback(
    (target: DestinationId, forceReplay = false) => {
      if (target === active && !forceReplay) {
        return;
      }

      const inFlight = motionRef.current;
      let fromRect = rects[active];

      if (inFlight && indicatorRef.current && navRef.current) {
        const navRect = navRef.current.getBoundingClientRect();
        const indicatorRect = indicatorRef.current.getBoundingClientRect();
        fromRect = {
          center: indicatorRect.left - navRect.left + indicatorRect.width / 2,
          left: indicatorRect.left - navRect.left,
          width: indicatorRect.width
        };
      }

      // The destination tab is currently text-only (unreserved) unless it
      // already happens to hold the reservation - e.g. Replay on the active
      // tab, or a rapid re-click of a target that's already mid-flight.
      // Compute its complete icon-inclusive width algebraically from its
      // current resting measurement, rather than waiting for a DOM
      // re-measure after the reservation flips - that gap is exactly what
      // previously let the surface arrive at the wrong (text-only) width.
      const reservedIdBeforeClick = inFlight ? inFlight.to : active;
      const targetAlreadyReserved = target === reservedIdBeforeClick;
      const targetRestRect = rects[target];
      const targetIndex = getIndex(target);
      const reservedIndex = getIndex(reservedIdBeforeClick);
      const oldWasBeforeTarget =
        !targetAlreadyReserved && reservedIndex < targetIndex;
      const iconOffset = targetAlreadyReserved ? 0 : ELASTIC_POP_ICON_RESERVE;
      const toLeft =
        targetRestRect.left - (oldWasBeforeTarget ? ELASTIC_POP_ICON_RESERVE : 0);
      const toWidth = targetRestRect.width + iconOffset;
      const toRect: ItemRect = {
        center: toLeft + toWidth / 2,
        left: toLeft,
        width: toWidth
      };

      clearPendingTimeouts();
      versionRef.current += 1;

      if (forceReplay) {
        replayRef.current += 1;
      }

      const version = versionRef.current;
      const fromIndex = getIndex(active);
      const toIndex = getIndex(target);
      const distance = Math.max(Math.abs(toIndex - fromIndex), 1);
      const timing = getElasticPopTiming(distance, playbackSpeed, reducedMotion);

      setDisplayed(active);
      setRevealedTargetId(null);
      setMotion({
        direction: Math.sign(toIndex - fromIndex) || 1,
        distance,
        duration: timing.surfaceDuration,
        from: active,
        fromRect,
        iconExitDuration: timing.iconExitDuration,
        iconRevealDelay: timing.iconRevealDelay,
        iconRevealDuration: timing.iconRevealDuration,
        replayKey: replayRef.current,
        to: target,
        toRect,
        version
      });

      const commitTimeout = window.setTimeout(
        () => {
          if (versionRef.current !== version) {
            return;
          }
          setActive(target);
          setDisplayed(target);
        },
        timing.surfaceDuration * timing.commitAt
      );

      const revealTimeout = window.setTimeout(() => {
        if (versionRef.current !== version) {
          return;
        }
        setRevealedTargetId(target);
      }, timing.iconRevealDelay);

      const finishTimeout = window.setTimeout(
        () => {
          if (versionRef.current !== version) {
            return;
          }
          setMotion(null);
        },
        Math.max(
          timing.surfaceDuration,
          timing.iconRevealDelay + timing.iconRevealDuration
        ) + 80
      );

      timeouts.current.push(commitTimeout, revealTimeout, finishTimeout);
    },
    [active, clearPendingTimeouts, navRef, playbackSpeed, reducedMotion, rects]
  );

  const moveBy = (offset: number) => {
    const currentIndex = getIndex(active);
    const nextIndex =
      (currentIndex + offset + destinations.length) % destinations.length;
    startTransition(destinations[nextIndex].id);
  };

  const replay = () => {
    startTransition(active, true);
  };

  return {
    active,
    displayed,
    indicatorRef,
    itemRefs,
    measure,
    motion,
    moveBy,
    navRef,
    playbackSpeed,
    rects,
    reducedMotion,
    replay,
    revealedTargetId,
    setPlaybackSpeed,
    setReducedMotion,
    startTransition
  };
}

function ActiveElasticPopNav({
  active,
  displayed,
  iconClassName = "elastic-pop-icon",
  indicatorRef,
  itemRefs,
  measure,
  motion,
  navRef,
  onSelect,
  rects,
  reducedMotion,
  revealedTargetId
}: {
  active: DestinationId;
  displayed: DestinationId;
  iconClassName?: string;
  indicatorRef: MutableRefObject<HTMLSpanElement | null>;
  itemRefs: MutableRefObject<Record<DestinationId, HTMLButtonElement | null>>;
  measure: () => void;
  motion: ElasticPopMotionState | null;
  navRef: MutableRefObject<HTMLDivElement | null>;
  onSelect: (destination: DestinationId) => void;
  rects: Record<DestinationId, ItemRect>;
  reducedMotion: boolean;
  revealedTargetId: DestinationId | null;
}) {
  const indicatorStyle = motion
    ? getElasticPopSurfaceStyle(motion, motion.fromRect, motion.toRect)
    : {
        transform: `translateX(${rects[displayed].left}px)`,
        width: rects[displayed].width
      };

  const handleKeyDown = (event: KeyboardEvent, destination: DestinationId) => {
    const currentIndex = getIndex(destination);

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = destinations[(currentIndex + 1) % destinations.length];
      itemRefs.current[next.id]?.focus();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const previous =
        destinations[
          (currentIndex - 1 + destinations.length) % destinations.length
        ];
      itemRefs.current[previous.id]?.focus();
    }
  };

  useEffect(() => {
    measure();
  }, [active, displayed, measure, motion]);

  return (
    <div className="workshop-motion-stage">
      <div
        aria-label="Workshop navigation"
        className="workshop-motion-nav"
        data-concept="elasticPop"
        data-motion={motion ? "active" : "idle"}
        data-reduced-motion={reducedMotion ? "true" : "false"}
        ref={navRef}
        role="tablist"
        style={
          {
            "--motion-duration": `${motion?.duration ?? 0}ms`
          } as CSSProperties
        }
      >
        <span
          aria-hidden="true"
          className="workshop-motion-active-indicator"
          key={`elastic-pop-indicator-${motion?.version ?? "idle"}-${motion?.replayKey ?? 0}`}
          ref={indicatorRef}
          style={indicatorStyle}
        />

        {destinations.map((destination, index) => {
          const isActive = active === destination.id;
          const isDisplayed = displayed === destination.id;
          const isMotionTarget = motion?.to === destination.id;
          const isMotionSource = motion?.from === destination.id;
          // Only the active (or in-flight destination) tab reserves its
          // icon's space - every other tab stays genuinely text-only.
          const isReserved = motion ? isMotionTarget : isActive;
          const showIcon = motion ? revealedTargetId === destination.id : isActive;
          const iconDuration = isMotionTarget
            ? (motion?.iconRevealDuration ?? 190)
            : (motion?.iconExitDuration ?? 190);
          // The destination snaps to its reserved width instantly (in step
          // with the surface, which already targets that full width from
          // the start) so there is nothing left to correct on arrival. The
          // outgoing tab collapses smoothly instead, timed with its icon's
          // fade so the label recentres visibly as the icon leaves.
          const slotDuration = isMotionSource
            ? (motion?.iconExitDuration ?? 150)
            : (motion?.duration ?? 200);
          const token = motion?.version ?? 0;

          return (
            <span
              className="inline-flex items-center"
              key={destination.id}
              style={{ columnGap: "16px" } as CSSProperties}
            >
              <button
                aria-selected={isActive}
                className="workshop-motion-item"
                data-active={isActive ? "true" : "false"}
                data-displayed={isDisplayed ? "true" : "false"}
                onClick={() => onSelect(destination.id)}
                onKeyDown={(event) => handleKeyDown(event, destination.id)}
                ref={(element) => {
                  itemRefs.current[destination.id] = element;
                }}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                type="button"
              >
                <span
                  className="elastic-pop-icon-slot"
                  data-instant={isMotionTarget ? "true" : "false"}
                  data-reserved={isReserved ? "true" : "false"}
                  style={
                    {
                      "--elastic-pop-slot-duration": `${slotDuration}ms`
                    } as CSSProperties
                  }
                >
                  <ActiveIconPopIcon
                    Icon={destination.Icon}
                    className={iconClassName}
                    style={
                      {
                        "--elastic-pop-icon-duration": `${iconDuration}ms`
                      } as CSSProperties
                    }
                    token={token}
                    visible={showIcon}
                  />
                </span>
                <span className="workshop-motion-item-label">
                  {activeIconPopLabels[destination.id]}
                </span>
              </button>
              {index < destinations.length - 1 ? (
                <span aria-hidden="true" className="elastic-pop-divider" />
              ) : null}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ActiveElasticPopDemo() {
  const motionState = useActiveElasticPopMotion();

  return (
    <section className="scroll-mt-28 py-10" id="active-elastic-pop">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase leading-5 text-[#737373]">
            Concept
          </p>
          <h3 className="mt-1 text-[22px] font-semibold leading-8 text-[#f5f5f5]">
            Active Elastic Pop
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
            {conceptSummaries.elasticPop}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-[10px] border border-white/[0.14] bg-[#111214] p-5">
          <ActiveElasticPopNav
            active={motionState.active}
            displayed={motionState.displayed}
            indicatorRef={motionState.indicatorRef}
            itemRefs={motionState.itemRefs}
            measure={motionState.measure}
            motion={motionState.motion}
            navRef={motionState.navRef}
            onSelect={motionState.startTransition}
            rects={motionState.rects}
            reducedMotion={motionState.reducedMotion}
            revealedTargetId={motionState.revealedTargetId}
          />
        </div>

        <MotionControls
          active={motionState.active}
          labels={activeIconPopLabels}
          onMove={motionState.moveBy}
          onReplay={motionState.replay}
          onSelect={motionState.startTransition}
          playbackSpeed={motionState.playbackSpeed}
          reducedMotion={motionState.reducedMotion}
          setPlaybackSpeed={motionState.setPlaybackSpeed}
          setReducedMotion={motionState.setReducedMotion}
        />
      </div>

      <MotionSpec concept="elasticPop" />
    </section>
  );
}

function ActiveElasticPopRtlDemo() {
  const motionState = useActiveElasticPopMotion();

  return (
    <section className="scroll-mt-28 py-10" id="active-elastic-pop-rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase leading-5 text-[#737373]">
            Concept
          </p>
          <h3 className="mt-1 text-[22px] font-semibold leading-8 text-[#f5f5f5]">
            Active Elastic Pop (RTL Icon)
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
            {conceptSummaries.elasticPopRtl}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-[10px] border border-white/[0.14] bg-[#111214] p-5">
          <ActiveElasticPopNav
            active={motionState.active}
            displayed={motionState.displayed}
            iconClassName="elastic-pop-icon-rtl"
            indicatorRef={motionState.indicatorRef}
            itemRefs={motionState.itemRefs}
            measure={motionState.measure}
            motion={motionState.motion}
            navRef={motionState.navRef}
            onSelect={motionState.startTransition}
            rects={motionState.rects}
            reducedMotion={motionState.reducedMotion}
            revealedTargetId={motionState.revealedTargetId}
          />
        </div>

        <MotionControls
          active={motionState.active}
          labels={activeIconPopLabels}
          onMove={motionState.moveBy}
          onReplay={motionState.replay}
          onSelect={motionState.startTransition}
          playbackSpeed={motionState.playbackSpeed}
          reducedMotion={motionState.reducedMotion}
          setPlaybackSpeed={motionState.setPlaybackSpeed}
          setReducedMotion={motionState.setReducedMotion}
        />
      </div>

      <MotionSpec concept="elasticPopRtl" />
    </section>
  );
}

function BehaviourRulesSection() {
  const rules = [
    "Only one item is active at a time.",
    "Selecting the already-active item does nothing unless Replay is used.",
    "Rapid clicks redirect the animation cleanly instead of stacking multiple animations.",
    "The destination does not become active until the animation has clearly committed.",
    "Keyboard focus and arrow-key navigation stay separate from decorative motion.",
    "Reduced motion uses a short crossfade or direct positional transition without overshoot, jumping, or rotation."
  ];

  return (
    <section className="scroll-mt-28 py-10">
      <div className="rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-5">
        <h3 className="text-[18px] font-semibold leading-7 text-[#f5f5f5]">
          Behaviour Rules
        </h3>
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#a1a1a1] md:grid-cols-2">
          {rules.map((rule) => (
            <li className="flex gap-2" key={rule}>
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-[#d99c56]" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WorkshopMotionStyles() {
  return (
    <style>{`
      .workshop-motion-stage {
        align-items: center;
        display: flex;
        min-height: 190px;
        overflow-x: auto;
        overflow-y: visible;
        padding: 52px 18px;
      }

      .workshop-motion-nav {
        --motion-direction: 1;
        --motion-distance: 1;
        align-items: center;
        background: #fcfbf9;
        border: 1px solid #dfd4c5;
        border-radius: 12px;
        box-shadow: 0 16px 44px rgba(36, 31, 24, 0.12);
        color: #324236;
        display: inline-grid;
        grid-template-columns: repeat(3, max-content);
        isolation: isolate;
        min-width: max-content;
        padding: 6px;
        position: relative;
      }

      .workshop-motion-nav[data-concept="segment"] {
        display: inline-flex;
        gap: 4px;
      }

      .workshop-motion-nav::before,
      .workshop-motion-nav::after {
        background: #dfd4c5;
        content: "";
        height: 26px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        z-index: 0;
      }

      .workshop-motion-nav::before {
        left: calc(33.333% + 1px);
      }

      .workshop-motion-nav::after {
        left: calc(66.666% + 1px);
      }

      .workshop-motion-nav[data-concept="segment"]::before,
      .workshop-motion-nav[data-concept="segment"]::after {
        display: none;
      }

      .workshop-motion-active-indicator {
        background: #f3eee7;
        border: 1px solid #dfd4c5;
        border-radius: 8px;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 10px 24px rgba(50, 66, 54, 0.1);
        height: calc(100% - 12px);
        left: 0;
        pointer-events: none;
        position: absolute;
        top: 6px;
        transform-origin: center;
        z-index: 1;
      }

      .workshop-motion-nav[data-concept="elastic"][data-motion]:not([data-motion="idle"]) .workshop-motion-active-indicator {
        animation: workshop-elastic-indicator var(--motion-duration) cubic-bezier(0.2, 0, 0, 1) both;
      }

      .workshop-motion-nav[data-concept="elasticPop"][data-motion]:not([data-motion="idle"]) .workshop-motion-active-indicator {
        animation: workshop-elastic-pop-surface var(--motion-duration) cubic-bezier(0.33, 0, 0.18, 1) both;
      }

      .workshop-motion-nav[data-concept="focus"][data-motion]:not([data-motion="idle"]) .workshop-motion-active-indicator {
        animation: workshop-focus-indicator var(--motion-duration) cubic-bezier(0.32, 0.72, 0, 1) both;
      }

      .workshop-motion-nav[data-reduced-motion="true"][data-motion]:not([data-motion="idle"]) .workshop-motion-active-indicator {
        animation: workshop-reduced-indicator var(--motion-duration) cubic-bezier(0.2, 0, 0, 1) both;
      }

      .workshop-motion-item {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 8px;
        color: #7b756c;
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        gap: 9px;
        height: 44px;
        justify-content: center;
        min-width: 164px;
        padding: 0 18px;
        position: relative;
        transition: color 180ms cubic-bezier(0.2, 0, 0, 1);
        white-space: nowrap;
        z-index: 2;
      }

      .workshop-motion-item:hover {
        color: #324236;
      }

      .workshop-motion-item:focus-visible {
        outline: 3px solid rgba(217, 156, 86, 0.5);
        outline-offset: 4px;
      }

      .workshop-motion-item[data-active="true"],
      .workshop-motion-item[data-displayed="true"] {
        color: #324236;
      }

      .workshop-motion-item-surface {
        border-radius: 8px;
        inset: 4px;
        opacity: 0;
        pointer-events: none;
        position: absolute;
        transform: scale(0.96) translateY(2px);
        z-index: 0;
      }

      .workshop-motion-nav[data-concept="depth"] .workshop-motion-item-surface {
        background: #f3eee7;
        border: 1px solid #dfd4c5;
      }

      .workshop-motion-nav[data-concept="depth"] .workshop-motion-item[data-displayed="true"] .workshop-motion-item-surface {
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 10px 22px rgba(50, 66, 54, 0.16);
        opacity: 1;
        transform: scale(1) translateY(0);
        transition:
          opacity var(--motion-duration) cubic-bezier(0.4, 0, 0.2, 1),
          transform var(--motion-duration) cubic-bezier(0.4, 0, 0.2, 1),
          box-shadow var(--motion-duration) cubic-bezier(0.4, 0, 0.2, 1);
      }

      .workshop-motion-nav[data-concept="depth"] .workshop-motion-item:not([data-displayed="true"]) .workshop-motion-item-surface {
        transition:
          opacity var(--motion-duration) cubic-bezier(0.4, 0, 0.2, 1),
          transform var(--motion-duration) cubic-bezier(0.4, 0, 0.2, 1);
      }

      .workshop-motion-item-icon {
        align-items: center;
        display: inline-flex;
        height: 20px;
        justify-content: center;
        position: relative;
        transition:
          opacity 180ms cubic-bezier(0.2, 0, 0, 1),
          transform 180ms cubic-bezier(0.2, 0, 0, 1);
        width: 20px;
        z-index: 1;
      }

      .workshop-motion-nav[data-concept="elastic"][data-motion]:not([data-motion="idle"]) .workshop-motion-item[data-from="true"] .workshop-motion-item-icon {
        animation: workshop-icon-into-container calc(var(--motion-duration) * 0.44) cubic-bezier(0.2, 0, 0, 1) both;
      }

      .workshop-motion-nav[data-concept="elastic"][data-motion]:not([data-motion="idle"]) .workshop-motion-item[data-to="true"] .workshop-motion-item-icon {
        animation: workshop-icon-from-container calc(var(--motion-duration) * 0.42) cubic-bezier(0.2, 0, 0, 1) calc(var(--motion-duration) * 0.42) both;
      }

      .workshop-motion-nav[data-concept="focus"][data-motion]:not([data-motion="idle"]) .workshop-motion-item[data-from="true"] .workshop-motion-item-icon {
        animation: workshop-focus-icon-recede calc(var(--motion-duration) * 0.6) cubic-bezier(0.32, 0.72, 0, 1) both;
      }

      .workshop-motion-nav[data-concept="focus"][data-motion]:not([data-motion="idle"]) .workshop-motion-item[data-to="true"] .workshop-motion-item-icon {
        animation: workshop-focus-icon-advance calc(var(--motion-duration) * 0.6) cubic-bezier(0.32, 0.72, 0, 1) calc(var(--motion-duration) * 0.4) both;
      }

      .workshop-motion-nav[data-concept="depth"][data-motion]:not([data-motion="idle"]) .workshop-motion-item[data-from="true"] .workshop-motion-item-icon {
        animation: workshop-depth-icon-recede calc(var(--motion-duration) * 0.4) cubic-bezier(0.4, 0, 0.2, 1) both;
      }

      .workshop-motion-nav[data-concept="depth"][data-motion]:not([data-motion="idle"]) .workshop-motion-item[data-to="true"] .workshop-motion-item-icon {
        animation: workshop-depth-icon-reveal calc(var(--motion-duration) * 0.62) cubic-bezier(0.4, 0, 0.2, 1) calc(var(--motion-duration) * 0.38) both;
      }

      .workshop-motion-nav[data-concept="segment"] .workshop-motion-item-icon {
        opacity: 0.68;
        transition: opacity var(--motion-duration) cubic-bezier(0.4, 0, 0.2, 1);
      }

      .workshop-motion-nav[data-concept="segment"] .workshop-motion-item[data-segment-expanded="true"] .workshop-motion-item-icon {
        opacity: 1;
      }

      .workshop-motion-item-label {
        font-size: 13px;
        font-weight: 650;
        line-height: 18px;
        position: relative;
        transition:
          color 220ms cubic-bezier(0.2, 0, 0, 1) 90ms,
          opacity 220ms cubic-bezier(0.2, 0, 0, 1) 90ms;
        z-index: 1;
      }

      .workshop-motion-nav[data-concept="focus"][data-motion]:not([data-motion="idle"]) .workshop-motion-item[data-from="true"] .workshop-motion-item-label {
        animation: workshop-focus-label-recede calc(var(--motion-duration) * 0.5) cubic-bezier(0.32, 0.72, 0, 1) both;
      }

      .workshop-motion-nav[data-concept="focus"][data-motion]:not([data-motion="idle"]) .workshop-motion-item[data-to="true"] .workshop-motion-item-label {
        animation: workshop-focus-label-advance calc(var(--motion-duration) * 0.5) cubic-bezier(0.32, 0.72, 0, 1) calc(var(--motion-duration) * 0.5) both;
      }

      .workshop-motion-nav[data-concept="depth"][data-motion]:not([data-motion="idle"]) .workshop-motion-item[data-to="true"] .workshop-motion-item-label {
        animation: workshop-depth-label-advance calc(var(--motion-duration) * 0.5) cubic-bezier(0.4, 0, 0.2, 1) calc(var(--motion-duration) * 0.5) both;
      }

      .workshop-motion-nav[data-concept="segment"] .workshop-motion-item-label {
        opacity: 0.68;
        transition: opacity var(--motion-duration) cubic-bezier(0.4, 0, 0.2, 1);
      }

      .workshop-motion-nav[data-concept="segment"] .workshop-motion-item[data-segment-expanded="true"] .workshop-motion-item-label {
        opacity: 1;
      }

      .workshop-motion-nav[data-concept="segment"] .workshop-motion-item {
        min-width: 0;
        transition:
          background-color var(--motion-duration) cubic-bezier(0.4, 0, 0.2, 1),
          box-shadow var(--motion-duration) cubic-bezier(0.4, 0, 0.2, 1),
          width var(--motion-duration) cubic-bezier(0.4, 0, 0.2, 1);
        width: 152px;
      }

      .workshop-motion-nav[data-concept="segment"] .workshop-motion-item[data-segment-expanded="true"] {
        background: #f3eee7;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 8px 20px rgba(50, 66, 54, 0.12);
        width: 226px;
      }

      @keyframes workshop-elastic-indicator {
        0% {
          transform: translateX(var(--elastic-start-x));
          width: var(--elastic-start-width);
        }
        28% {
          transform: translateX(var(--elastic-stretch-x));
          width: var(--elastic-stretch-width);
        }
        68% {
          transform: translateX(var(--elastic-arrive-x));
          width: var(--elastic-arrive-width);
        }
        84% {
          transform: translateX(var(--elastic-settle-x));
          width: calc(var(--elastic-end-width) + 7px);
        }
        100% {
          transform: translateX(var(--elastic-end-x));
          width: var(--elastic-end-width);
        }
      }

      @keyframes workshop-elastic-pop-surface {
        0% {
          transform: translateX(var(--elastic-start-x));
          width: var(--elastic-start-width);
        }
        55% {
          transform: translateX(var(--elastic-pop-stretch-x));
          width: var(--elastic-pop-stretch-width);
        }
        100% {
          transform: translateX(var(--elastic-end-x));
          width: var(--elastic-end-width);
        }
      }

      @keyframes workshop-focus-indicator {
        0% {
          transform: translateX(var(--quiet-start-x));
          width: var(--quiet-start-width);
        }
        100% {
          transform: translateX(var(--quiet-end-x));
          width: var(--quiet-end-width);
        }
      }

      @keyframes workshop-reduced-indicator {
        0% {
          opacity: 0.65;
          transform: translateX(var(--quiet-start-x));
          width: var(--quiet-start-width);
        }
        100% {
          opacity: 1;
          transform: translateX(var(--quiet-end-x));
          width: var(--quiet-end-width);
        }
      }

      @keyframes workshop-icon-into-container {
        0% {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateX(var(--icon-out-x)) scale(0.58);
        }
      }

      @keyframes workshop-icon-from-container {
        0% {
          opacity: 0;
          transform: translateX(var(--icon-in-x)) scale(0.66);
        }
        100% {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }

      @keyframes workshop-focus-icon-recede {
        0% {
          opacity: 1;
          transform: scale(1);
        }
        100% {
          opacity: 0.55;
          transform: scale(0.92);
        }
      }

      @keyframes workshop-focus-icon-advance {
        0% {
          opacity: 0.55;
          transform: scale(0.92);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes workshop-focus-label-recede {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0.6;
        }
      }

      @keyframes workshop-focus-label-advance {
        0% {
          opacity: 0.6;
        }
        100% {
          opacity: 1;
        }
      }

      @keyframes workshop-depth-icon-recede {
        0% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        100% {
          opacity: 0.35;
          transform: scale(0.92) translateY(1px);
        }
      }

      @keyframes workshop-depth-icon-reveal {
        0% {
          clip-path: circle(0% at 50% 50%);
          opacity: 0;
          transform: scale(0.9) translateY(2px);
        }
        100% {
          clip-path: circle(75% at 50% 50%);
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      @keyframes workshop-depth-label-advance {
        0% {
          opacity: 0;
          transform: translateY(3px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .workshop-motion-nav[data-reduced-motion="true"] .workshop-motion-item-icon {
        animation: none !important;
        opacity: 1;
        transform: none;
      }

      .workshop-motion-nav[data-reduced-motion="true"] .workshop-motion-item-surface {
        transition-duration: 150ms !important;
      }

      .workshop-motion-nav[data-reduced-motion="true"]::before,
      .workshop-motion-nav[data-reduced-motion="true"]::after {
        animation: none !important;
      }

      .icon-pop-nav {
        --pop-duration: 220ms;
        align-items: center;
        background: #fcfbf9;
        border: 1px solid #dfd4c5;
        border-radius: 12px;
        box-shadow: 0 16px 44px rgba(36, 31, 24, 0.12);
        color: #324236;
        display: inline-flex;
        gap: 4px;
        min-width: max-content;
        padding: 6px;
        position: relative;
      }

      .icon-pop-tab {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 8px;
        color: #7b756c;
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        height: 44px;
        justify-content: center;
        padding: 0 20px;
        position: relative;
        transition:
          background-color var(--pop-duration) cubic-bezier(0.4, 0, 0.2, 1),
          box-shadow var(--pop-duration) cubic-bezier(0.4, 0, 0.2, 1),
          color 180ms cubic-bezier(0.4, 0, 0.2, 1);
        white-space: nowrap;
      }

      .icon-pop-tab:hover {
        color: #324236;
      }

      .icon-pop-tab:focus-visible {
        outline: 3px solid rgba(217, 156, 86, 0.5);
        outline-offset: 4px;
      }

      .icon-pop-tab[data-visual-active="true"] {
        background: #f3eee7;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 10px 24px rgba(50, 66, 54, 0.1);
        color: #324236;
      }

      .icon-pop-icon {
        align-items: center;
        display: inline-flex;
        height: 18px;
        justify-content: center;
        margin-right: 0;
        opacity: 0;
        overflow: hidden;
        transform: scale(0.82) translateY(2px);
        transition:
          margin-right var(--pop-duration) cubic-bezier(0.4, 0, 0.2, 1),
          opacity var(--pop-duration) cubic-bezier(0.4, 0, 0.2, 1),
          transform var(--pop-duration) cubic-bezier(0.4, 0, 0.2, 1),
          width var(--pop-duration) cubic-bezier(0.4, 0, 0.2, 1);
        width: 0;
      }

      .icon-pop-icon[data-icon-visible="true"] {
        margin-right: 8px;
        opacity: 1;
        transform: scale(1) translateY(0);
        width: 18px;
      }

      .icon-pop-label {
        font-size: 13px;
        font-weight: 650;
        line-height: 18px;
        transition: color 200ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      .icon-pop-nav[data-reduced-motion="true"] .icon-pop-icon {
        transform: none !important;
        transition:
          margin-right var(--pop-duration) linear,
          opacity var(--pop-duration) linear,
          width var(--pop-duration) linear;
      }

      .elastic-pop-icon {
        align-items: center;
        display: inline-flex;
        flex: 0 0 auto;
        height: 18px;
        justify-content: center;
        opacity: 0;
        transform: scale(0.86) translateY(2px);
        transition:
          opacity var(--elastic-pop-icon-duration, 190ms) cubic-bezier(0.33, 0, 0.2, 1),
          transform var(--elastic-pop-icon-duration, 190ms) cubic-bezier(0.33, 0, 0.2, 1);
        width: 18px;
      }

      .elastic-pop-icon[data-icon-visible="true"] {
        opacity: 1;
        transform: scale(1) translateY(0);
      }

      /*
       * Same reveal as .elastic-pop-icon, but the icon arrives travelling
       * right-to-left (translateX) instead of easing straight in - used by
       * the "Active Elastic Pop (RTL Icon)" comparison variant only.
       */
      .elastic-pop-icon-rtl {
        align-items: center;
        display: inline-flex;
        flex: 0 0 auto;
        height: 18px;
        justify-content: center;
        opacity: 0;
        transform: translateX(10px) scale(0.88);
        transition:
          opacity var(--elastic-pop-icon-duration, 190ms) cubic-bezier(0.33, 0, 0.2, 1),
          transform var(--elastic-pop-icon-duration, 190ms) cubic-bezier(0.33, 0, 0.2, 1);
        width: 18px;
      }

      .elastic-pop-icon-rtl[data-icon-visible="true"] {
        opacity: 1;
        transform: translateX(0) scale(1);
      }

      .workshop-motion-nav[data-reduced-motion="true"] .elastic-pop-icon-rtl {
        transform: none !important;
        transition: opacity var(--elastic-pop-icon-duration, 190ms) linear;
      }

      /*
       * Only the active/destination tab ever reserves this space - every
       * other tab stays at width: 0 with zero gap, so resting text-only
       * tabs never carry phantom icon padding. The destination snaps to
       * "reserved" instantly (data-instant), matching the surface which
       * already targets the full reserved width from the very start, so
       * nothing is left to correct once it arrives. The outgoing tab
       * (data-instant="false") collapses back to zero on a normal
       * transition, timed with its icon fading out.
       */
      .elastic-pop-icon-slot {
        align-items: center;
        display: inline-flex;
        margin-right: 0;
        overflow: hidden;
        transition:
          margin-right var(--elastic-pop-slot-duration, 200ms) cubic-bezier(0.33, 0, 0.2, 1),
          width var(--elastic-pop-slot-duration, 200ms) cubic-bezier(0.33, 0, 0.2, 1);
        width: 0;
      }

      .elastic-pop-icon-slot[data-reserved="true"] {
        margin-right: 16px;
        width: 18px;
      }

      .elastic-pop-icon-slot[data-instant="true"] {
        transition: none;
      }

      .workshop-motion-nav[data-concept="elasticPop"] {
        align-items: center;
        column-gap: 16px;
        display: inline-flex;
      }

      .workshop-motion-nav[data-concept="elasticPop"]::before,
      .workshop-motion-nav[data-concept="elasticPop"]::after {
        display: none;
      }

      .workshop-motion-nav[data-concept="elasticPop"] .workshop-motion-item {
        column-gap: 0;
        min-width: 0;
      }

      .elastic-pop-divider {
        background: #dfd4c5;
        flex: 0 0 auto;
        height: 26px;
        width: 1px;
        z-index: 0;
      }

      .workshop-motion-nav[data-reduced-motion="true"] .elastic-pop-icon {
        transform: none !important;
        transition: opacity var(--elastic-pop-icon-duration, 190ms) linear;
      }

      .workshop-motion-nav[data-reduced-motion="true"] .elastic-pop-icon-slot {
        transition:
          margin-right var(--elastic-pop-slot-duration, 200ms) linear,
          width var(--elastic-pop-slot-duration, 200ms) linear;
      }

      @media (max-width: 760px) {
        .workshop-motion-stage {
          padding-left: 0;
          padding-right: 0;
        }

        .workshop-motion-item {
          min-width: 142px;
          padding-left: 14px;
          padding-right: 14px;
        }

        .workshop-motion-nav[data-concept="segment"] .workshop-motion-item {
          width: 128px;
        }

        .workshop-motion-nav[data-concept="segment"] .workshop-motion-item[data-segment-expanded="true"] {
          width: 176px;
        }

        .icon-pop-tab {
          padding-left: 14px;
          padding-right: 14px;
        }

        .workshop-motion-nav[data-concept="elasticPop"] .workshop-motion-item {
          padding-left: 14px;
          padding-right: 14px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .workshop-motion-active-indicator,
        .workshop-motion-item,
        .workshop-motion-item-icon,
        .workshop-motion-item-label,
        .workshop-motion-item-surface,
        .workshop-motion-nav::before,
        .workshop-motion-nav::after,
        .icon-pop-tab,
        .icon-pop-icon,
        .icon-pop-label,
        .elastic-pop-icon,
        .elastic-pop-icon-rtl,
        .elastic-pop-icon-slot {
          animation: none !important;
          transition: none !important;
        }
      }
    `}</style>
  );
}

export function WorkshopNavigationMotionPageClient() {
  const sections = useMemo(() => sectionItems, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <WorkshopMotionStyles />
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/workshop-navigation-motion" />

        <ComponentPageShell
          description="Seven interaction prototypes for the Workshop Ready contextual navigation active state and icon motion."
          metadata={componentMetadata}
          sections={sections}
        >
          <ComponentOverviewSection {...overviewCopy} />
          <ConceptDemo
            concept="elastic"
            id="elastic-slider"
            title="Elastic Slider"
          />
          <ConceptDemo concept="focus" id="focus-window" title="Focus Window" />
          <ConceptDemo concept="depth" id="depth-stack" title="Depth Stack" />
          <ConceptDemo
            concept="segment"
            id="segment-flow"
            title="Segment Flow"
          />
          <ActiveIconPopDemo />
          <ActiveElasticPopDemo />
          <ActiveElasticPopRtlDemo />
          <BehaviourRulesSection />
        </ComponentPageShell>
      </div>
    </main>
  );
}
