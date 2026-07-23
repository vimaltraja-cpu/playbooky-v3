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
  preservePanelOnViewportChange = false,
  renderPreview,
  title = "Viewport",
  viewports
}: {
  actions?: ReactNode;
  canvasClassName?: string;
  description: string;
  initialViewport?: Viewport;
  preservePanelOnViewportChange?: boolean;
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
    <section className="scroll-mt-28 py-8" id="viewports">
      <div>
        <h3 className="text-[15px] font-semibold leading-6 text-[#ededed]">
          {title}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
          {description}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div
          aria-label="Viewport"
          className="relative flex w-fit max-w-full overflow-x-auto rounded-md border border-white/[0.14] bg-[#0a0a0a] p-1"
          role="tablist"
        >
          <span
            aria-hidden="true"
            className="absolute bottom-1 top-1 rounded bg-white/[0.08] transition-[transform,width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
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
                "relative z-10 rounded px-3 py-1.5 text-[13px] font-medium leading-5 transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
                activeViewport === viewport.id
                  ? "text-[#ededed]"
                  : "text-[#8f8f8f] hover:bg-white/[0.055] hover:text-[#d4d4d4]"
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
          "mt-5 min-w-0 overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#111214] p-4 transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none sm:p-5",
          canvasClassName
        ].join(" ")}
        id={`viewport-panel-${activeItem.id}`}
        key={preservePanelOnViewportChange ? "viewport-panel" : activeItem.id}
        role="tabpanel"
      >
        {renderPreview(activeItem.id)}
      </div>

      <div className="mt-5 rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-4">
        <h4 className="text-[13px] font-medium leading-5 text-[#ededed]">
          {activeItem.label} measurement notes
        </h4>
        <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {activeItem.notes.map(([term, description]) => (
            <div key={term}>
              <dt className="text-[12px] font-medium leading-5 text-[#737373]">
                {term}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-[#a1a1a1]">
                {description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
