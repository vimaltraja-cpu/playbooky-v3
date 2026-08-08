"use client";

import { useEffect, useState } from "react";

import {
  DiagnosisQuestionScreen,
  type DiagnosisScreenViewport
} from "@/components/product/DiagnosisQuestionScreen";
import { diagnosisQuestions } from "@/lib/design-system/diagnosis-options";

function getResponsiveViewport(width: number): DiagnosisScreenViewport {
  if (width < 768) {
    return "mobile";
  }

  if (width < 900) {
    return "tablet-portrait";
  }

  if (width < 1200) {
    return "tablet-landscape";
  }

  if (width >= 1800) {
    return "xl-desktop";
  }

  if (width >= 1600) {
    return "large-desktop";
  }

  return "desktop";
}

export function DiagnosisGridPreviewClient() {
  const [viewport, setViewport] = useState<DiagnosisScreenViewport>("desktop");

  useEffect(() => {
    const handleResize = () => {
      setViewport(getResponsiveViewport(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DiagnosisQuestionScreen
      question={diagnosisQuestions[0]}
      questions={diagnosisQuestions}
      viewport={viewport}
    />
  );
}
