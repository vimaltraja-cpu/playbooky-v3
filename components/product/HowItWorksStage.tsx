"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties
} from "react";

import {
  CARD_FAN_MS,
  RecommendationCardReveal,
  recommendationRevealCards
} from "@/components/product/RecommendationCardReveal";
import { AIComposer } from "@/components/ui/AIComposer";
import { ActivityCard } from "@/components/ui/ActivityCard";

const STEPS = [
  {
    id: "challenge",
    title: "Describe the challenge",
    body: "Type what you need to make happen, then send it — or use Guide me for a short diagnosis."
  },
  {
    id: "diagnose",
    title: "AI works through it",
    body: "PlayBooky cycles through the signals that shape the right workshop structure."
  },
  {
    id: "reveal",
    title: "Reveal the playbook",
    body: "Recommended activities fan out into a playbook you can refine and own."
  },
  {
    id: "guide",
    title: "Run with the guide",
    body: "Open the facilitator guide and use the steps, prompts, and timing in the room."
  }
] as const;

const DESCRIBE_PLACEHOLDER = "Describe the challenge you want to solve...";
const DESCRIBE_PROMPT =
  "Create a 45-minute workshop for a new leadership team...";

const CIRCLE_FRAMES = [
  {
    id: "participation",
    imageSrc: "/assets/recommendation-loading/participants.png"
  },
  {
    id: "context",
    imageSrc: "/assets/recommendation-loading/context.png"
  },
  {
    id: "challenges",
    imageSrc: "/assets/recommendation-loading/challenges.png"
  },
  {
    id: "goals",
    imageSrc: "/assets/recommendation-loading/goals.png"
  }
] as const;

type DescribePhase =
  | "empty"
  | "typing"
  | "send"
  | "absorb"
  | "center"
  | "expand"
  | "illustrate"
  | "toCard"
  | "cardFocus"
  | "elastic"
  | "fan"
  | "settle";

const TYPE_START_MS = 280;
const TYPE_CHAR_MS = 14;
const TYPE_PAUSE_MS = 320;
const SEND_MS = 220;
const ABSORB_MS = 520;
const CENTER_MS = 640;
const EXPAND_MS = 560;
const ILLUSTRATE_AFTER_EXPAND_MS = 320;
const TO_CARD_MS = 560;
const CARD_FOCUS_MS = 720;
const ELASTIC_MS = 640;
const FAN_SETTLE_PAUSE_MS = 100;

const HIW_CENTRE_ACTIVITY = recommendationRevealCards.find(
  (card) => card.pair === 0
)!.activity;

const GUIDE_BACK_CARDS = [
  { title: "Session timing", subtitle: "Facilitator guide" },
  { title: "Room setup", subtitle: "Facilitator guide" },
  { title: "Energy checks", subtitle: "Facilitator guide" }
] as const;

const GUIDE_STEPS = [
  {
    title: "Open the shared challenge",
    duration: "5 mins",
    detail: "Keep the outcome visible so the room stays pointed."
  },
  {
    title: "Frame before you rank",
    duration: "15 mins",
    detail: "Align on the problem before mapping priorities."
  },
  {
    title: "Map and pressure-test",
    duration: "20 mins",
    detail: "Build the priority view, then challenge weak bets."
  },
  {
    title: "Close with commitments",
    duration: "10 mins",
    detail: "Leave with owners, next steps, and timing."
  }
] as const;

const FLOATING_CHIPS = [
  { label: "What to say", position: "chip-a" },
  { label: "Discussion points", position: "chip-b" },
  { label: "Expected outcome", position: "chip-c" },
  { label: "Timing cue", position: "chip-d" },
  { label: "Watch-outs", position: "chip-e" },
  { label: "Debrief prompt", position: "chip-f" }
] as const;

const COMING_NEXT = [
  {
    title: "PlayBooky Live",
    body: "Live facilitation support and in-session feeding."
  },
  {
    title: "Fixtures",
    body: "Reusable demo and seed workshops to explore the product faster."
  }
] as const;

const DESKTOP_QUERY = "(min-width: 960px)";
const STEP_DWELL_MS = 7200;
const INTERACTION_PAUSE_MS = 3200;

function subscribeDesktop(onStoreChange: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function getDesktopServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function clampStep(index: number) {
  return Math.min(STEPS.length - 1, Math.max(0, index));
}

function DescribeSendArrow() {
  return (
    <svg
      aria-hidden="true"
      className="hiw-describe__orb-arrow"
      fill="none"
      height="20"
      stroke="#E2E8F0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.25"
      viewBox="0 0 24 24"
      width="20"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function BeatDescribeToCircle({
  active,
  handoff,
  illustrate,
  onEnterDiagnose,
  onHandoffStart,
  reducedMotion,
  runKey
}: {
  active: boolean;
  handoff: boolean;
  illustrate: boolean;
  onEnterDiagnose?: () => void;
  onHandoffStart?: () => void;
  reducedMotion: boolean;
  runKey: number;
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<DescribePhase>("empty");
  const [typedText, setTypedText] = useState("");
  const [frame, setFrame] = useState(0);
  const diagnoseSignaledRef = useRef(false);
  const handoffStartedRef = useRef(false);
  const onEnterDiagnoseRef = useRef(onEnterDiagnose);
  const onHandoffStartRef = useRef(onHandoffStart);
  const illustrateRef = useRef(illustrate);
  const handoffRef = useRef(handoff);
  onEnterDiagnoseRef.current = onEnterDiagnose;
  onHandoffStartRef.current = onHandoffStart;
  illustrateRef.current = illustrate;
  handoffRef.current = handoff;

  const seatOrbFromSendButton = useCallback(() => {
    const stage = stageRef.current;
    const orb = stage?.querySelector<HTMLElement>(".hiw-describe__orb");
    const send = composerRef.current?.querySelector<HTMLElement>(
      ".ai-composer__send"
    );
    if (!stage || !send) {
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    const sendRect = send.getBoundingClientRect();
    const size = Math.max(sendRect.width, 40);
    const xPct =
      ((sendRect.left - stageRect.left + sendRect.width / 2) / stageRect.width) *
      100;
    const yPct =
      ((sendRect.top - stageRect.top + sendRect.height / 2) / stageRect.height) *
      100;

    // Plant on the send seat before absorb paints visible — flush so left/top
    // don't tween from the default 50%/50% on first run.
    if (orb) {
      orb.style.transition = "none";
    }
    stage.style.setProperty("--hiw-orb-x", `${xPct}%`);
    stage.style.setProperty("--hiw-orb-y", `${yPct}%`);
    stage.style.setProperty("--hiw-orb-size", `${size}px`);
    if (orb) {
      void orb.offsetWidth;
      orb.style.transition = "";
    }
  }, []);

  // Compose → circle. Does not restart when handoff (step 03) turns on.
  useEffect(() => {
    if (!active) {
      diagnoseSignaledRef.current = false;
      handoffStartedRef.current = false;
      setPhase("empty");
      setTypedText("");
      setFrame(0);
      return;
    }

    if (reducedMotion) {
      setTypedText(DESCRIBE_PROMPT);
      setPhase(handoffRef.current ? "settle" : illustrateRef.current ? "illustrate" : "typing");
      return;
    }

    if (handoffRef.current) {
      handoffStartedRef.current = true;
      setTypedText(DESCRIBE_PROMPT);
      setPhase("settle");
      setFrame(0);
      return;
    }

    if (illustrateRef.current) {
      setTypedText(DESCRIBE_PROMPT);
      setPhase("illustrate");
      setFrame(0);
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    diagnoseSignaledRef.current = false;
    handoffStartedRef.current = false;
    setPhase("empty");
    setTypedText("");
    setFrame(0);

    const atSend = TYPE_PAUSE_MS;
    const atAbsorb = atSend + SEND_MS;
    const atCenter = atAbsorb + ABSORB_MS;
    const atExpand = atCenter + CENTER_MS;
    const atIllustrate = atExpand + EXPAND_MS + ILLUSTRATE_AFTER_EXPAND_MS;

    timers.push(
      window.setTimeout(() => {
        if (!cancelled) {
          setPhase("typing");
        }
      }, TYPE_START_MS)
    );

    let charIndex = 0;
    const typeTimer = window.setInterval(() => {
      if (cancelled) {
        return;
      }

      charIndex += 1;
      setTypedText(DESCRIBE_PROMPT.slice(0, charIndex));

      if (charIndex < DESCRIBE_PROMPT.length) {
        return;
      }

      window.clearInterval(typeTimer);

      timers.push(
        window.setTimeout(() => !cancelled && setPhase("send"), atSend)
      );
      timers.push(
        window.setTimeout(() => {
          if (cancelled) {
            return;
          }
          seatOrbFromSendButton();
          setPhase("absorb");
        }, atAbsorb)
      );
      timers.push(
        window.setTimeout(() => !cancelled && setPhase("center"), atCenter)
      );
      timers.push(
        window.setTimeout(() => !cancelled && setPhase("expand"), atExpand)
      );
      timers.push(
        window.setTimeout(() => {
          if (cancelled) {
            return;
          }
          setPhase("illustrate");
          if (!diagnoseSignaledRef.current) {
            diagnoseSignaledRef.current = true;
            onEnterDiagnoseRef.current?.();
          }
        }, atIllustrate)
      );
    }, TYPE_CHAR_MS);

    return () => {
      cancelled = true;
      window.clearInterval(typeTimer);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [active, reducedMotion, runKey, seatOrbFromSendButton]);

  // Step 03 handoff: circle shell → card → focus content → elastic → fan.
  // Do not depend on `phase` — each setPhase would cancel the rest of the chain.
  useEffect(() => {
    if (!handoff) {
      handoffStartedRef.current = false;
      return;
    }

    if (!active || reducedMotion) {
      return;
    }

    if (handoffStartedRef.current) {
      return;
    }

    handoffStartedRef.current = true;
    onHandoffStartRef.current?.();

    let cancelled = false;
    const timers: number[] = [];
    setPhase("toCard");

    timers.push(
      window.setTimeout(() => !cancelled && setPhase("cardFocus"), TO_CARD_MS)
    );
    timers.push(
      window.setTimeout(
        () => !cancelled && setPhase("elastic"),
        TO_CARD_MS + CARD_FOCUS_MS
      )
    );
    timers.push(
      window.setTimeout(
        () => !cancelled && setPhase("fan"),
        TO_CARD_MS + CARD_FOCUS_MS + ELASTIC_MS
      )
    );
    timers.push(
      window.setTimeout(
        () => !cancelled && setPhase("settle"),
        TO_CARD_MS +
          CARD_FOCUS_MS +
          ELASTIC_MS +
          CARD_FAN_MS +
          FAN_SETTLE_PAUSE_MS
      )
    );

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [active, handoff, reducedMotion]);

  useEffect(() => {
    if (phase !== "typing" && phase !== "empty") {
      return;
    }

    const textarea = composerRef.current?.querySelector("textarea");
    textarea?.focus({ preventScroll: true });
  }, [phase, typedText]);

  useEffect(() => {
    if (!active || phase !== "illustrate" || reducedMotion) {
      return;
    }

    setFrame(0);
    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % CIRCLE_FRAMES.length);
    }, 1200);

    return () => window.clearInterval(timer);
  }, [active, phase, reducedMotion]);

  const showOrb =
    phase === "absorb" ||
    phase === "center" ||
    phase === "expand" ||
    phase === "illustrate" ||
    phase === "toCard" ||
    phase === "cardFocus" ||
    phase === "elastic";

  const showCardContent =
    phase === "cardFocus" || phase === "elastic";

  const showFan = phase === "fan" || phase === "settle";

  return (
    <div
      className="hiw-beat hiw-beat--describe"
      data-active={active ? "true" : "false"}
      data-phase={phase}
    >
      <div className="hiw-describe" ref={stageRef}>
        <div className="hiw-describe__composer" ref={composerRef}>
          <AIComposer
            onChange={() => undefined}
            onSubmit={() => undefined}
            placeholder={DESCRIBE_PLACEHOLDER}
            value={typedText}
            viewport="desktop"
          />
        </div>

        <div
          aria-hidden="true"
          className="hiw-describe__orb"
          data-shell={
            phase === "toCard" ||
            phase === "cardFocus" ||
            phase === "elastic"
              ? "card"
              : "circle"
          }
          data-visible={showOrb ? "true" : "false"}
        >
          <DescribeSendArrow />
          <div className="hiw-describe__art">
            {CIRCLE_FRAMES.map((item, index) => (
              <div
                className="hiw-describe__frame"
                data-active={
                  phase === "illustrate" && index === frame ? "true" : "false"
                }
                key={item.id}
              >
                <Image alt="" fill sizes="280px" src={item.imageSrc} />
              </div>
            ))}
          </div>
          {showCardContent ? (
            <div className="hiw-describe__card-face">
              <ActivityCard
                activity={HIW_CENTRE_ACTIVITY}
                size="desktop"
                variant="library"
              />
            </div>
          ) : null}
        </div>

        {showFan ? (
          <div className="hiw-reveal-scale hiw-reveal-scale--from-orb">
            <RecommendationCardReveal
              motion={reducedMotion ? "reduced" : "paired"}
              phase={phase === "settle" ? "complete" : "revealing"}
              playback="normal"
              viewport="desktop"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BeatGuide({
  active,
  reducedMotion
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  const [phase, setPhase] = useState<"shell" | "content" | "sides">("shell");

  useEffect(() => {
    if (!active) {
      setPhase("shell");
      return;
    }

    if (reducedMotion) {
      setPhase("sides");
      return;
    }

    setPhase("shell");
    const contentTimer = window.setTimeout(() => setPhase("content"), 420);
    const sidesTimer = window.setTimeout(() => setPhase("sides"), 980);
    return () => {
      window.clearTimeout(contentTimer);
      window.clearTimeout(sidesTimer);
    };
  }, [active, reducedMotion]);

  return (
    <div
      className="hiw-beat hiw-beat--guide"
      data-active={active ? "true" : "false"}
      data-phase={phase}
    >
      <div className="hiw-guide-stage">
        {GUIDE_BACK_CARDS.map((card, index) => (
          <div
            aria-hidden="true"
            className={`hiw-guide-float hiw-guide-float--guide-card hiw-guide-float--guide-${index + 1}`}
            key={card.title}
          >
            <p>{card.subtitle}</p>
            <strong>{card.title}</strong>
          </div>
        ))}

        {FLOATING_CHIPS.map((chip) => (
          <div
            aria-hidden="true"
            className={`hiw-guide-float hiw-guide-float--chip hiw-guide-float--${chip.position}`}
            key={chip.label}
          >
            {chip.label}
          </div>
        ))}

        <div className="hiw-guide-panel">
          <div className="hiw-guide-panel__inner">
            <p className="hiw-beat__eyebrow">Facilitator guide</p>
            <h3>Q3 Priority Alignment</h3>
            <ol>
              {GUIDE_STEPS.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <em>{step.duration}</em>
                    <p>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageVisual({
  activeStep,
  onEnterDiagnose,
  onHandoffStart,
  reducedMotion,
  runKey
}: {
  activeStep: number;
  onEnterDiagnose?: () => void;
  onHandoffStart?: () => void;
  reducedMotion: boolean;
  runKey: number;
}) {
  return (
    <div
      className="hiw-stage"
      data-step={STEPS[activeStep]?.id}
      data-step-index={activeStep}
    >
      <div className="hiw-stage-frame">
        <BeatDescribeToCircle
          active={activeStep === 0 || activeStep === 1 || activeStep === 2}
          handoff={activeStep === 2}
          illustrate={activeStep >= 1}
          onEnterDiagnose={onEnterDiagnose}
          onHandoffStart={onHandoffStart}
          reducedMotion={reducedMotion}
          runKey={runKey}
        />
        <BeatGuide active={activeStep === 3} reducedMotion={reducedMotion} />
      </div>
    </div>
  );
}

function StepList({
  activeStep,
  onSelectStep
}: {
  activeStep: number;
  onSelectStep?: (index: number) => void;
}) {
  return (
    <ol className="hiw-steps">
      {STEPS.map((step, index) => (
        <li
          className="hiw-steps__item"
          data-active={activeStep === index ? "true" : "false"}
          key={step.id}
        >
          {onSelectStep ? (
            <button
              aria-current={activeStep === index ? "step" : undefined}
              className="hiw-steps__trigger"
              onClick={() => onSelectStep(index)}
              type="button"
            >
              <span className="hiw-steps__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="hiw-steps__copy">
                <span className="hiw-steps__title">{step.title}</span>
                <span className="hiw-steps__body">{step.body}</span>
              </span>
            </button>
          ) : (
            <div className="hiw-steps__trigger">
              <span className="hiw-steps__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="hiw-steps__copy">
                <span className="hiw-steps__title">{step.title}</span>
                <span className="hiw-steps__body">{step.body}</span>
              </span>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

function ProcessIntro({ headingId }: { headingId?: string }) {
  return (
    <header className="hiw-process__intro">
      <p className="hiw-process__eyebrow">Process</p>
      <h2 className="hiw-process__heading" id={headingId}>
        From challenge to facilitator-ready workshop
      </h2>
    </header>
  );
}

export function HowItWorksStage() {
  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  );
  const [activeStep, setActiveStep] = useState(0);
  const [describeRunKey, setDescribeRunKey] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const activeStepRef = useRef(0);
  const programmaticScrollRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const sectionInViewRef = useRef(false);
  const scrollRafRef = useRef<number | null>(null);

  const getStepScrollTop = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) {
      return 0;
    }

    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    const scrollable = Math.max(track.offsetHeight - window.innerHeight, 1);
    const progress = clampStep(index) / STEPS.length + 0.5 / STEPS.length;
    return trackTop + progress * scrollable - 1;
  }, []);

  const scrollToStep = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const next = clampStep(index);
      programmaticScrollRef.current = true;
      activeStepRef.current = next;
      setActiveStep(next);
      window.scrollTo({
        behavior: reducedMotion ? "auto" : behavior,
        top: getStepScrollTop(next)
      });
      window.setTimeout(
        () => {
          programmaticScrollRef.current = false;
        },
        behavior === "smooth" && !reducedMotion ? 700 : 40
      );
    },
    [getStepScrollTop, reducedMotion]
  );

  const pauseAutoplay = useCallback((ms = INTERACTION_PAUSE_MS) => {
    pauseUntilRef.current = Math.max(pauseUntilRef.current, Date.now() + ms);
  }, []);

  const handleSelectStep = useCallback(
    (index: number) => {
      pauseAutoplay();
      if (index === 0) {
        setDescribeRunKey((current) => current + 1);
      }
      scrollToStep(index, "smooth");
    },
    [pauseAutoplay, scrollToStep]
  );

  const handleEnterDiagnose = useCallback(() => {
    if (activeStepRef.current !== 0) {
      return;
    }

    // Update the rail only — do not scroll mid-morph (that jumps the orb).
    pauseAutoplay(STEP_DWELL_MS);
    programmaticScrollRef.current = true;
    activeStepRef.current = 1;
    setActiveStep(1);
    window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 80);
  }, [pauseAutoplay]);

  const handleHandoffStart = useCallback(() => {
    // Hold on the reveal beat while circle → card → fan plays out.
    pauseAutoplay(
      TO_CARD_MS + CARD_FOCUS_MS + ELASTIC_MS + CARD_FAN_MS + FAN_SETTLE_PAUSE_MS + 800
    );
    if (activeStepRef.current !== 2) {
      programmaticScrollRef.current = true;
      activeStepRef.current = 2;
      setActiveStep(2);
      window.setTimeout(() => {
        programmaticScrollRef.current = false;
      }, 80);
    }
  }, [pauseAutoplay]);

  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  // Keep active step synced to scroll progress (manual scrub / time rule).
  useEffect(() => {
    if (!isDesktop) {
      return;
    }

    const track = trackRef.current;
    if (!track) {
      return;
    }

    const updateFromScroll = () => {
      const rect = track.getBoundingClientRect();
      const scrollable = Math.max(track.offsetHeight - window.innerHeight, 1);
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      sectionInViewRef.current = inView;

      if (!inView) {
        return;
      }

      if (programmaticScrollRef.current) {
        return;
      }

      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 0.999);
      const next = clampStep(Math.floor(progress * STEPS.length));

      if (next !== activeStepRef.current) {
        activeStepRef.current = next;
        setActiveStep(next);
      }
    };

    const onScroll = () => {
      if (!programmaticScrollRef.current) {
        pauseAutoplay(1800);
      }

      if (scrollRafRef.current != null) {
        return;
      }

      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null;
        updateFromScroll();
      });
    };

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateFromScroll);
      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, [isDesktop, pauseAutoplay]);

  // Auto-cycle through beats while the section is in view.
  useEffect(() => {
    if (!isDesktop || reducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      if (!sectionInViewRef.current) {
        return;
      }

      if (Date.now() < pauseUntilRef.current) {
        return;
      }

      if (programmaticScrollRef.current) {
        return;
      }

      const next = (activeStepRef.current + 1) % STEPS.length;
      if (next === 0) {
        setDescribeRunKey((current) => current + 1);
      }
      scrollToStep(next, "smooth");
    }, STEP_DWELL_MS);

    return () => window.clearInterval(timer);
  }, [isDesktop, reducedMotion, scrollToStep]);

  return (
    <div className="hiw-process" data-mode={isDesktop ? "desktop" : "mobile"}>
      {/* Desktop walkthrough — always in DOM so CSS can show it without a blank flash */}
      <div
        className="hiw-process__track"
        ref={trackRef}
        style={
          {
            "--hiw-step-count": STEPS.length
          } as CSSProperties
        }
      >
        <div className="hiw-process__sticky">
          <div className="hiw-process__rail">
            <ProcessIntro headingId="how-it-works-heading" />
            <StepList activeStep={activeStep} onSelectStep={handleSelectStep} />
          </div>
          <div className="hiw-process__visual">
            <StageVisual
              activeStep={activeStep}
              onEnterDiagnose={handleEnterDiagnose}
              onHandoffStart={handleHandoffStart}
              reducedMotion={reducedMotion}
              runKey={describeRunKey}
            />
          </div>
        </div>

        <div aria-hidden="true" className="hiw-process__markers">
          {STEPS.map((step, index) => (
            <div
              className="hiw-process__marker"
              data-step-index={index}
              key={step.id}
            />
          ))}
        </div>
      </div>

      {/* Mobile stack */}
      <div className="hiw-process__stack">
        <ProcessIntro />
        {STEPS.map((step, index) => (
          <article className="hiw-process__stack-item" key={step.id}>
            <div className="hiw-process__stack-copy">
              <span className="hiw-steps__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="hiw-steps__title">{step.title}</h3>
              <p className="hiw-steps__body">{step.body}</p>
            </div>
            <div className="hiw-process__stack-visual">
              <StageVisual activeStep={index} reducedMotion runKey={0} />
            </div>
          </article>
        ))}
      </div>

      <div className="homepage-marketing-coming-next">
        <p className="homepage-marketing-coming-next__label">Coming next</p>
        <ul className="homepage-marketing-coming-next__list">
          {COMING_NEXT.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </li>
          ))}
        </ul>
      </div>

      <a className="homepage-marketing-cta" href="#top">
        Start with your challenge
      </a>
    </div>
  );
}
