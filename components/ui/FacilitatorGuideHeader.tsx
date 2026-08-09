"use client";

/**
 * FacilitatorGuideHeader — LOCKED production header for Facilitator Guide.
 *
 * Replica of SiteHeader shell (logo metrics + right-side actions),
 * without primary nav text. Default actions: Share + Download PDF.
 *
 * Do not fold landing/inner SiteHeader variants into this file.
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactElement } from "react";

import playBookyHorizontalLogo from "@/assets/logos/Horizontal Logo.svg";

const SYSTEM_ICON_PATH = "/assets/icons/system Icons";

const DURATION_OPTIONS = Array.from({ length: 22 }, (_, index) => {
  const minutes = 30 + index * 10;
  return { label: String(minutes), value: String(minutes) };
});
const DURATION_ROW_STRIDE = 32;

export type FacilitatorGuideHeaderProps = {
  actionStatus?: string | null;
  className?: string;
  onAddActivity?: () => void;
  onDownloadPdf?: () => void;
  onDurationChange?: (duration: string) => void;
  onShare?: () => void;
  title?: string;
  variant?: "activity-grid" | "facilitator-guide";
};

function SystemIcon({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="fg-header__action-icon"
      style={{
        WebkitMaskImage: `url("${SYSTEM_ICON_PATH}/${name}.svg")`,
        maskImage: `url("${SYSTEM_ICON_PATH}/${name}.svg")`
      }}
    />
  );
}

function DurationDropdown({
  onDurationChange
}: {
  onDurationChange?: (duration: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("90");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const selectedOption =
    DURATION_OPTIONS.find((option) => option.value === selectedDuration) ??
    DURATION_OPTIONS[0];
  const selectedIndex = DURATION_OPTIONS.findIndex(
    (option) => option.value === selectedOption.value
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      if (optionsRef.current) {
        optionsRef.current.scrollTop = Math.max(0, (selectedIndex - 2) * DURATION_ROW_STRIDE);
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleDocumentPointerDown(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleDocumentPointerDown);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
    };
  }, [isOpen]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = Math.min(
        Math.max(selectedIndex + direction, 0),
        DURATION_OPTIONS.length - 1
      );
      selectDuration(DURATION_OPTIONS[nextIndex].value);
    }
  }

  function selectDuration(duration: string) {
    setSelectedDuration(duration);
    setIsOpen(false);
    onDurationChange?.(duration);
  }

  return (
    <div
      className="fg-header__duration-dropdown"
      data-open={isOpen}
      ref={dropdownRef}
    >
      <div className="fg-header__duration-surface">
        <button
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="fg-header__duration-trigger"
          onClick={() => setIsOpen((current) => !current)}
          onKeyDown={handleKeyDown}
          type="button"
        >
          <SystemIcon name="menu-2" />
          <span className="fg-header__duration-label">Duration</span>
          <span aria-hidden="true" className="fg-header__duration-stepper">
            <SystemIcon name="chevron-up" />
            <SystemIcon name="chevron-down" />
          </span>
          <span className="fg-header__duration-value">
            <span>{selectedOption.label}</span>
            <span className="fg-header__duration-unit">m</span>
          </span>
        </button>

        <div
          aria-label="Workshop duration"
          className="fg-header__duration-options"
          ref={optionsRef}
          role="listbox"
        >
          {DURATION_OPTIONS.map((option, index) => (
            <button
              aria-selected={option.value === selectedDuration}
              className="fg-header__duration-option"
              key={option.value}
              onClick={() => selectDuration(option.value)}
              role="option"
              style={
                {
                  "--duration-option-delay": `${350 + Math.min(index, 7) * 34}ms`
                } as CSSProperties
              }
              tabIndex={isOpen ? 0 : -1}
              type="button"
            >
              {option.label} min
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FacilitatorGuideHeader({
  actionStatus = null,
  className,
  onAddActivity,
  onDownloadPdf,
  onDurationChange,
  onShare,
  variant = "facilitator-guide"
}: FacilitatorGuideHeaderProps): ReactElement {
  const isActivityGrid = variant === "activity-grid";

  return (
    <header
      className={["fg-header", className].filter(Boolean).join(" ")}
      data-variant={variant}
    >
      <div className="fg-header__container">
        <Link
          aria-label="PlayBooky home"
          className="fg-header__logo-link"
          href="/"
        >
          <Image
            alt=""
            aria-hidden="true"
            className="fg-header__logo-image"
            height={35}
            priority
            src={playBookyHorizontalLogo}
            width={142}
          />
        </Link>

        <div className="fg-header__actions">
          {actionStatus ? (
            <p aria-live="polite" className="fg-header__action-status" role="status">
              {actionStatus}
            </p>
          ) : null}

          {isActivityGrid ? (
            <>
              <DurationDropdown onDurationChange={onDurationChange} />

              <button
                className="fg-header__action fg-header__action--add-activity"
                onClick={onAddActivity}
                type="button"
              >
                <SystemIcon name="plus" />
                <span className="fg-header__action-label">Add activity</span>
              </button>
            </>
          ) : (
            <>
              <button
                className="fg-header__action fg-header__action--share"
                onClick={onShare}
                type="button"
              >
                <SystemIcon name="share-2" />
                <span className="fg-header__action-label">Share</span>
              </button>

              <button
                className="fg-header__action fg-header__action--download"
                onClick={onDownloadPdf}
                type="button"
              >
                <SystemIcon name="download" />
                <span className="fg-header__action-label">Download PDF</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
