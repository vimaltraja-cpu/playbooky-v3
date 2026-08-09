import Image from "next/image";

import playbookyLogo from "@/assets/logos/Logo_icon.svg";
import { GuideMeInsteadLink } from "@/components/product/GuideMeInsteadLink";
import { HomepageComposerController } from "@/components/product/HomepageComposerController";
import { HomepageComposerWash } from "@/components/product/HomepageComposerWash";
import { HomepageMarketingSections } from "@/components/product/HomepageMarketingSections";
import { AIComposer } from "@/components/ui/AIComposer";
import { SiteHeader } from "@/components/ui/SiteHeader";

export type HomepageTextLayoutViewport =
  | "mobile"
  | "tablet-portrait"
  | "tablet-landscape"
  | "desktop";

export function HomepageHeroText() {
  return (
    <h1
      className="homepage-text-layout__heading homepage-hero-title"
      id="homepage-text-layout-heading"
    >
      <span className="homepage-hero-title__line">Design the right</span>
      <span className="homepage-hero-title__line">
        workshop <em>in minutes.</em>
      </span>
    </h1>
  );
}

export function HomepageTextLayout({
  framed = false,
  viewport
}: {
  framed?: boolean;
  viewport?: HomepageTextLayoutViewport;
}) {
  const isMobile = viewport === "mobile";

  return (
    <div
      className={[
        "homepage-text-layout",
        viewport ? `homepage-text-layout--${viewport}` : "",
        framed ? "homepage-text-layout--framed" : ""
      ].join(" ")}
    >
      <SiteHeader variant="landing" />
      <main className="homepage-text-layout__main">
        <section
          aria-labelledby="homepage-text-layout-heading"
          className="homepage-text-layout__hero-region"
        >
          <div className="homepage-text-layout__hero-group">
            <div className="homepage-text-layout__logo-container">
              <Image
                alt=""
                className="homepage-text-layout__logo-artwork"
                src={playbookyLogo}
              />
            </div>
            <HomepageHeroText />
          </div>
        </section>

        <p className="homepage-text-layout__guidance">
          Tell PlayBooky what you are trying to make happen and it will shape a
          workshop path around your goal.
        </p>

        <section
          aria-label="Describe your workshop challenge"
          className="homepage-text-layout__composer-region"
        >
          <div className="homepage-text-layout__composer-shell">
            <AIComposer viewport={isMobile ? "mobile" : "desktop"} />
          </div>
        </section>
      </main>
    </div>
  );
}

export function HomepageComposerLayout({
  framed = false,
  viewport
}: {
  framed?: boolean;
  viewport?: HomepageTextLayoutViewport;
}) {
  const isMobile = viewport === "mobile";

  return (
    <div
      className={[
        "homepage-text-layout",
        "homepage-composer-layout",
        viewport ? `homepage-text-layout--${viewport}` : "",
        viewport ? `homepage-composer-layout--${viewport}` : "",
        framed ? "homepage-text-layout--framed" : "",
        framed ? "homepage-composer-layout--framed" : ""
      ].join(" ")}
      id="top"
    >
      <HomepageComposerWash />
      <SiteHeader variant="landing" />
      <main className="homepage-text-layout__main">
        <section
          aria-labelledby="homepage-text-layout-heading"
          className="homepage-text-layout__hero-region"
        >
          <div className="homepage-text-layout__hero-group">
            <div className="homepage-text-layout__logo-container">
              <Image
                alt=""
                className="homepage-text-layout__logo-artwork"
                src={playbookyLogo}
              />
            </div>
            <HomepageHeroText />
          </div>
        </section>

        <section
          aria-label="Describe your workshop challenge"
          className="homepage-composer-layout__composer-region"
        >
          <div className="homepage-composer-layout__composer-stack">
            <div className="homepage-composer-guidance">
              <p>Not sure what workshop you need?</p>

              <GuideMeInsteadLink className="homepage-composer-guidance__link" />
            </div>

            <div className="homepage-composer-layout__composer-shell">
              <HomepageComposerController
                viewport={isMobile ? "mobile" : "desktop"}
              />
            </div>
          </div>
        </section>
      </main>
      {framed ? null : <HomepageMarketingSections />}
    </div>
  );
}
