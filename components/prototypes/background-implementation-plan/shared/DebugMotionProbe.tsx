"use client";

import { useEffect, useRef, useState } from "react";

export function DebugMotionProbe() {
  const [frame, setFrame] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let count = 0;
    let raf = 0;

    function tick(now: number) {
      count += 1;
      const x = (Math.sin(now / 800) + 1) * 45;
      if (boxRef.current) {
        boxRef.current.style.left = `${x}%`;
      }
      if (count % 10 === 0) {
        setFrame(count);
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        border: "2px solid red",
        borderRadius: 8,
        bottom: 16,
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        height: 60,
        overflow: "hidden",
        position: "fixed",
        right: 16,
        width: 320,
        zIndex: 9999
      }}
    >
      <div
        ref={boxRef}
        style={{
          background: "red",
          height: 24,
          position: "absolute",
          top: 6,
          transition: "none",
          width: 24
        }}
      />
      <div
        style={{
          bottom: 4,
          color: "#111",
          fontFamily: "monospace",
          fontSize: 11,
          position: "absolute",
          right: 8
        }}
      >
        DEBUG frame: {frame}
      </div>
    </div>
  );
}
