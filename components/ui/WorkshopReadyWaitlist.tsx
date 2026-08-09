"use client";

/**
 * WorkshopReadyWaitlist — waitlist / early-access panel for FigJam Board
 * and PlayBooky Live (same surface for both modes).
 *
 * Variants:
 * - join — email capture + continue to Facilitator Guide
 * - submitted — confirmation after waitlist signup
 *
 * Standalone for now; wire into workshop mode pages later.
 */

import Image, { type StaticImageData } from "next/image";
import {
  useRef,
  useState,
  type FormEvent,
  type ReactElement
} from "react";

import workshopReadyIllustration from "@/assets/illustrations/Playbooky_workshop-ready-auth.png";
import playBookyHorizontalLogo from "@/assets/logos/Horizontal Logo.svg";

const SYSTEM_ICON_PATH = "/assets/icons/system Icons";

export type WorkshopReadyWaitlistMode = "figjam" | "live";

export type WorkshopReadyWaitlistVariant = "join" | "submitted";

export type WorkshopReadyWaitlistProps = {
  className?: string;
  defaultEmail?: string;
  defaultVariant?: WorkshopReadyWaitlistVariant;
  illustrationSrc?: string | StaticImageData;
  mode?: WorkshopReadyWaitlistMode;
  onContinueToGuide?: () => void;
  onSubmitEmail?: (email: string) => void;
  onVariantChange?: (variant: WorkshopReadyWaitlistVariant) => void;
  variant?: WorkshopReadyWaitlistVariant;
};

const featureItems = [
  "FigJam board export",
  "PlayBooky Live facilitation support",
  "Guided workshop delivery tools"
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getEmailError(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Enter your email to join the waitlist.";
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address, like name@company.com.";
  }

  return null;
}

function SystemIcon({
  className,
  name
}: {
  className?: string;
  name: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        WebkitMaskImage: `url("${SYSTEM_ICON_PATH}/${name}.svg")`,
        maskImage: `url("${SYSTEM_ICON_PATH}/${name}.svg")`
      }}
    />
  );
}

export function WorkshopReadyWaitlist({
  className,
  defaultEmail = "",
  defaultVariant = "join",
  illustrationSrc = workshopReadyIllustration,
  mode = "figjam",
  onContinueToGuide,
  onSubmitEmail,
  onVariantChange,
  variant
}: WorkshopReadyWaitlistProps): ReactElement {
  const isControlled = variant !== undefined;
  const [uncontrolledVariant, setUncontrolledVariant] =
    useState<WorkshopReadyWaitlistVariant>(defaultVariant);
  const resolvedVariant = isControlled ? variant : uncontrolledVariant;

  const [email, setEmail] = useState(defaultEmail);
  const [submittedEmail, setSubmittedEmail] = useState(defaultEmail);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const emailFieldId = "wrw-email";
  const emailErrorId = "wrw-email-error";

  const setVariant = (next: WorkshopReadyWaitlistVariant) => {
    if (!isControlled) {
      setUncontrolledVariant(next);
    }
    onVariantChange?.(next);
  };

  const validateEmail = (value: string) => {
    const error = getEmailError(value);
    setEmailError(error);
    return error;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailTouched) {
      validateEmail(value);
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    validateEmail(email);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailTouched(true);
    const nextEmail = email.trim();
    const error = validateEmail(nextEmail);

    if (error) {
      emailInputRef.current?.focus();
      return;
    }

    setSubmittedEmail(nextEmail);
    onSubmitEmail?.(nextEmail);
    setVariant("submitted");
  };

  const modeLabel = mode === "live" ? "PlayBooky Live" : "FigJam Board";

  return (
    <section
      aria-label={`${modeLabel} waitlist`}
      className={["wrw", className].filter(Boolean).join(" ")}
      data-mode={mode}
      data-variant={resolvedVariant}
    >
      <div className="wrw__panel">
        <div className="wrw__promo">
          <div className="wrw__brand">
            <Image
              alt="PlayBooky"
              className="wrw__logo"
              height={49}
              priority
              src={playBookyHorizontalLogo}
              width={200}
            />
          </div>

          <div className="wrw__illustration">
            <Image
              alt=""
              className="wrw__illustration-image"
              height={238}
              src={illustrationSrc}
              width={423}
            />
          </div>

          <div className="wrw__promo-copy">
            {resolvedVariant === "join" ? (
              <>
                <h2 className="wrw__promo-title">This feature is almost ready.</h2>
                <p className="wrw__promo-body">
                  FigJam boards and PlayBooky Live aren&apos;t available in the MVP
                  yet. Join the waitlist and we&apos;ll let you know the moment
                  they launch.
                </p>
              </>
            ) : (
              <>
                <h2 className="wrw__promo-title">You&apos;re on the list.</h2>
                <p className="wrw__promo-body">
                  Thanks for joining. We&apos;ll email you when {modeLabel} is
                  ready — and you can keep facilitating with the guide in the
                  meantime.
                </p>
              </>
            )}

            <ul className="wrw__features">
              {featureItems.map((item) => (
                <li className="wrw__feature" key={item}>
                  <SystemIcon className="wrw__check" name="check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="wrw__footnote">
              Session data stays in this browser and is never shared.
            </p>
          </div>
        </div>

        <div className="wrw__action">
          {resolvedVariant === "join" ? (
            <>
              <div className="wrw__action-intro">
                <h2 className="wrw__action-title">Join the waitlist</h2>
                <p className="wrw__action-body">
                  Be first to know when FigJam Board and
                  <br />
                  PlayBooky Live are available.
                </p>
              </div>

              <form className="wrw__form" noValidate onSubmit={handleSubmit}>
                <div className="wrw__email-block">
                  <label
                    className={[
                      "wrw__email-field",
                      emailError ? "wrw__email-field--error" : null
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    htmlFor={emailFieldId}
                  >
                    <span className="wrw-sr-only">Email</span>
                    <SystemIcon className="wrw__mail" name="mail" />
                    <input
                      aria-describedby={emailError ? emailErrorId : undefined}
                      aria-invalid={emailError ? true : undefined}
                      autoComplete="email"
                      className="wrw__email-input"
                      id={emailFieldId}
                      inputMode="email"
                      onBlur={handleEmailBlur}
                      onChange={(event) => handleEmailChange(event.target.value)}
                      placeholder="Enter your email"
                      ref={emailInputRef}
                      spellCheck={false}
                      type="text"
                      value={email}
                    />
                  </label>
                  {emailError ? (
                    <p className="wrw__email-error" id={emailErrorId} role="alert">
                      {emailError}
                    </p>
                  ) : null}
                </div>

                <button className="wrw__submit" type="submit">
                  <span>Join waitlist</span>
                  <SystemIcon className="wrw__submit-icon" name="arrow-right" />
                </button>
              </form>
            </>
          ) : (
            <div className="wrw__action-intro">
              <h2 className="wrw__action-title">You&apos;re signed up</h2>
              <p className="wrw__action-body">
                We&apos;ll reach out at{" "}
                <strong className="wrw__email-confirm">
                  {submittedEmail || "your email"}
                </strong>{" "}
                when {modeLabel} launches.
              </p>
              <button
                className="wrw__secondary"
                onClick={() => {
                  setEmailError(null);
                  setEmailTouched(false);
                  setVariant("join");
                }}
                type="button"
              >
                Use a different email
              </button>
            </div>
          )}

          <div className="wrw__divider" aria-hidden="true">
            <span className="wrw__divider-line" />
            <span className="wrw__divider-label">or</span>
            <span className="wrw__divider-line" />
          </div>

          <button
            className="wrw__guide-card"
            onClick={onContinueToGuide}
            type="button"
          >
            <div className="wrw__guide-card-row">
              <span className="wrw__guide-card-title">
                Continue to facilitator guide
              </span>
              <SystemIcon className="wrw__guide-card-icon" name="arrow-right" />
            </div>
            <p className="wrw__guide-card-body">
              View your facilitator guide without creating an account. Access
              lasts for this browser session.
            </p>
          </button>
        </div>
      </div>
    </section>
  );
}
