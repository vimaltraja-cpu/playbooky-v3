"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export type ViewportReviewItem<Viewport extends string> = {
  id: Viewport;
  label: string;
  notes: Array<[string, string]>;
};

export function ViewportReviewLayout<Viewport extends string>({
  actions,
  canvasClassName = "",
  description,
  initialViewport,
  renderPreview,
  title = "Viewport",
  viewports
}: {
  actions?: ReactNode;
  canvasClassName?: string;
  description: string;
  initialViewport?: Viewport;
  renderPreview: (viewport: Viewport) => ReactNode;
  title?: string;
  viewports: Array<ViewportReviewItem<Viewport>>;
}) {
  const [activeViewport, setActiveViewport] = useState(
    initialViewport ?? viewports[0].id
  );
  const [indicator, setIndicator] = useState({ left: 4, width: 0 });
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeItem =
    viewports.find((viewport) => viewport.id === activeViewport) ??
    viewports[0];

  useEffect(() => {
    const updateIndicator = () => {
      const activeElement = triggerRefs.current[activeViewport];

      if (!activeElement) {
        return;
      }

      setIndicator({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeViewport]);

  return (
    <section className="scroll-mt-40 py-10" id="viewports">
      <div>
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
          {description}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div
          aria-label="Viewport"
          className="relative flex w-fit rounded-full border border-[color:var(--line)] bg-white/65 p-1"
          role="tablist"
        >
          <span
            aria-hidden="true"
            className="absolute bottom-1 top-1 rounded-full bg-[#7D5330] shadow-[0_10px_24px_rgba(125,83,48,0.18)] transition-[transform,width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
            style={{
              transform: `translateX(${indicator.left - 4}px)`,
              width: indicator.width
            }}
          />
          {viewports.map((viewport) => (
            <button
              aria-controls={`viewport-panel-${viewport.id}`}
              aria-selected={activeViewport === viewport.id}
              className={[
                "relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
                activeViewport === viewport.id
                  ? "!text-[#FCFBF9]"
                  : "!text-[#171614] hover:bg-[#EFE3D2]/60"
              ].join(" ")}
              id={`viewport-tab-${viewport.id}`}
              key={viewport.id}
              onClick={() => setActiveViewport(viewport.id)}
              ref={(element) => {
                triggerRefs.current[viewport.id] = element;
              }}
              role="tab"
              type="button"
            >
              {viewport.label}
            </button>
          ))}
        </div>

        {actions ? <div>{actions}</div> : null}
      </div>

      <div
        aria-labelledby={`viewport-tab-${activeItem.id}`}
        className={[
          "mt-5 min-w-0 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-[#F4F0EA] p-4 transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none sm:p-6",
          canvasClassName
        ].join(" ")}
        id={`viewport-panel-${activeItem.id}`}
        key={activeItem.id}
        role="tabpanel"
      >
        {renderPreview(activeItem.id)}
      </div>

      <div className="mt-5 border-y border-[color:var(--line)] py-5">
        <h4 className="text-sm font-semibold">
          {activeItem.label} measurement notes
        </h4>
        <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {activeItem.notes.map(([term, description]) => (
            <div key={term}>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                {term}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                {description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
