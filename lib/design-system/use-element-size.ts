"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";

export type ElementSize = {
  height: number;
  width: number;
};

const zeroSize: ElementSize = { height: 0, width: 0 };

/**
 * Tracks an element's real rendered border-box size and keeps it in sync as
 * the element resizes (container resize, viewport resize, content changes).
 *
 * Used by the Diagnosis Card's selected-state stroke so its SVG geometry is
 * always derived from the card's actual pixel bounds instead of an assumed,
 * fixed-desktop shape. See lib/design-system/diagnosis-card-stroke-path.ts.
 */
export function useElementSize<T extends HTMLElement>(
  ref: RefObject<T | null>
): ElementSize {
  const [size, setSize] = useState<ElementSize>(zeroSize);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const measure = () => {
      const rect = node.getBoundingClientRect();
      setSize((previous) => {
        if (previous.width === rect.width && previous.height === rect.height) {
          return previous;
        }

        return { height: rect.height, width: rect.width };
      });
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}
