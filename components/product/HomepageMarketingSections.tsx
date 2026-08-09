import { HowItWorksStage } from "@/components/product/HowItWorksStage";

const WORKSHOP_TYPES = [
  {
    title: "Alignment",
    example: "e.g. get a team pointed at the same outcome"
  },
  {
    title: "Prioritisation",
    example: "e.g. get a team unstuck on Q3 priorities"
  },
  {
    title: "Discovery",
    example: "e.g. surface what users actually need"
  },
  {
    title: "Strategy",
    example: "e.g. shape a direction the group can own"
  },
  {
    title: "Problem solving",
    example: "e.g. move from stuck to a workable path"
  },
  {
    title: "Ideation",
    example: "e.g. generate options without losing focus"
  }
] as const;

const PRICE_TIERS = [
  {
    name: "Explore",
    price: "Coming soon",
    intent: "Try the path from challenge to playbook.",
    features: [
      "Challenge input and diagnosis",
      "Recommended playbook",
      "Core workshop types"
    ],
    cta: { href: "#top", label: "Start with your challenge" },
    featured: false
  },
  {
    name: "Facilitator",
    price: "Coming soon",
    intent: "Build and run workshops with the guide.",
    features: [
      "Everything in Explore",
      "Workshop builder",
      "Facilitator guide",
      "Save and reuse sessions"
    ],
    cta: { href: "#top", label: "Start with your challenge" },
    featured: true
  },
  {
    name: "Team / Org",
    price: "Talk to us",
    intent: "Collaboration now, Live later for teams.",
    features: [
      "Everything in Facilitator",
      "Shared workspace",
      "PlayBooky Live when ready",
      "Org-wide standards"
    ],
    cta: { href: "#top", label: "Start with your challenge" },
    featured: false
  }
] as const;

const FAQ_ITEMS = [
  {
    question: "What is PlayBooky?",
    answer:
      "PlayBooky helps you turn a real challenge into a facilitator-ready workshop — from diagnosis and playbook through to the guide you run with."
  },
  {
    question: "Do I need facilitation experience?",
    answer:
      "No. PlayBooky is built to amplify facilitators and support people who are newer to workshop design, without replacing judgment in the room."
  },
  {
    question: "Is this just an activity library?",
    answer:
      "No. You start from the challenge. PlayBooky diagnoses what you need, then recommends and assembles a workshop — you are not browsing disconnected activities first."
  },
  {
    question: "Can I change the recommended workshop?",
    answer:
      "Yes. After you get a playbook, you can refine activities, timing, and sequence in the builder before you run the session."
  },
  {
    question: "What is PlayBooky Live?",
    answer:
      "PlayBooky Live is the upcoming live facilitation experience for in-session support and feeding. It sits after the guide in the product roadmap."
  },
  {
    question: "When will pricing be final?",
    answer:
      "The tiers on this page are placeholders while we lock commercial details. You can still start with your challenge today."
  }
] as const;

export function HomepageMarketingSections() {
  return (
    <div className="homepage-marketing">
      <section
        aria-labelledby="how-it-works-heading"
        className="homepage-marketing-section homepage-marketing-section--process"
        id="how-it-works"
      >
        <div className="homepage-marketing-section__inner homepage-marketing-section__inner--process">
          <HowItWorksStage />
        </div>
      </section>

      <section
        aria-labelledby="workshops-heading"
        className="homepage-marketing-section"
        id="workshops"
      >
        <div className="homepage-marketing-section__inner">
          <header className="homepage-marketing-section__header">
            <h2
              className="homepage-marketing-section__heading"
              id="workshops-heading"
            >
              Workshops shaped around the outcome
            </h2>
            <p className="homepage-marketing-section__lede">
              PlayBooky starts from the challenge, not a library of activities.
              These are the kinds of sessions it is built to design.
            </p>
          </header>

          <ul className="homepage-marketing-workshops">
            {WORKSHOP_TYPES.map((type) => (
              <li className="homepage-marketing-workshops__item" key={type.title}>
                <h3 className="homepage-marketing-workshops__title">
                  {type.title}
                </h3>
                <p className="homepage-marketing-workshops__example">
                  {type.example}
                </p>
              </li>
            ))}
          </ul>

          <p className="homepage-marketing-workshops__note">
            Not sure which?{" "}
            <a href="#top">Use Guide me instead</a>
          </p>
        </div>
      </section>

      <section
        aria-labelledby="price-heading"
        className="homepage-marketing-section"
        id="price"
      >
        <div className="homepage-marketing-section__inner">
          <header className="homepage-marketing-section__header">
            <h2
              className="homepage-marketing-section__heading"
              id="price-heading"
            >
              Price
            </h2>
            <p className="homepage-marketing-section__lede">
              Placeholder tiers while we lock commercial details. Designed so one
              workshop&apos;s prep time pays for itself.
            </p>
          </header>

          <div className="homepage-marketing-price-grid">
            {PRICE_TIERS.map((tier) => (
              <article
                className={[
                  "homepage-marketing-price-tier",
                  tier.featured
                    ? "homepage-marketing-price-tier--featured"
                    : ""
                ].join(" ")}
                key={tier.name}
              >
                {tier.featured ? (
                  <p className="homepage-marketing-price-tier__badge">
                    Recommended
                  </p>
                ) : null}
                <h3 className="homepage-marketing-price-tier__name">
                  {tier.name}
                </h3>
                <p className="homepage-marketing-price-tier__price">
                  {tier.price}
                </p>
                <p className="homepage-marketing-price-tier__intent">
                  {tier.intent}
                </p>
                <ul className="homepage-marketing-price-tier__features">
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <a
                  className="homepage-marketing-price-tier__cta"
                  href={tier.cta.href}
                >
                  {tier.cta.label}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="faq-heading"
        className="homepage-marketing-section"
        id="faq"
      >
        <div className="homepage-marketing-section__inner">
          <header className="homepage-marketing-section__header">
            <h2
              className="homepage-marketing-section__heading"
              id="faq-heading"
            >
              Frequently asked questions
            </h2>
            <p className="homepage-marketing-section__lede">
              Quick answers about how PlayBooky works and what to expect.
            </p>
          </header>

          <div className="homepage-marketing-faq">
            {FAQ_ITEMS.map((item) => (
              <details
                className="homepage-marketing-faq__item"
                key={item.question}
              >
                <summary className="homepage-marketing-faq__question">
                  {item.question}
                </summary>
                <p className="homepage-marketing-faq__answer">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="homepage-marketing-footer">
        <p>PlayBooky — make great workshops accessible to every team.</p>
      </footer>
    </div>
  );
}
