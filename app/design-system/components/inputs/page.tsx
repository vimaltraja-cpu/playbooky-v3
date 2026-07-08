import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";

const inputStates = [
  {
    name: "Default",
    helper: "Short helper text explains the expected input.",
    value: "",
    tone: "default"
  },
  {
    name: "Hover",
    helper: "Border and surface lift slightly on hover.",
    value: "",
    tone: "hover"
  },
  {
    name: "Focus",
    helper: "The focus ring is visible and calm.",
    value: "",
    tone: "focus"
  },
  {
    name: "Filled",
    helper: "Filled fields keep label and helper context visible.",
    value: "A thoughtful answer",
    tone: "filled"
  },
  {
    name: "Disabled",
    helper: "Disabled inputs remain legible but unavailable.",
    value: "Unavailable option",
    tone: "disabled"
  },
  {
    name: "Error",
    helper: "Error copy tells the user how to recover.",
    value: "Missing detail",
    tone: "error"
  },
  {
    name: "Success",
    helper: "Success copy confirms the value is accepted.",
    value: "Ready to use",
    tone: "success"
  }
];

const sharedInputClass =
  "w-full rounded-2xl border bg-[color:var(--panel)] px-4 py-3 text-sm leading-6 text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)]";

const toneClasses: Record<string, string> = {
  default:
    "border-[color:var(--line)] shadow-[0_8px_24px_rgba(36,31,24,0.04)]",
  hover:
    "border-[color:var(--accent)] bg-white shadow-[0_14px_34px_rgba(36,31,24,0.08)]",
  focus:
    "border-[color:var(--accent-strong)] ring-4 ring-[rgba(54,92,85,0.16)]",
  filled:
    "border-[color:var(--line)] bg-white shadow-[0_8px_24px_rgba(36,31,24,0.05)]",
  disabled:
    "border-[color:var(--line)] bg-[color:var(--panel-soft)] text-[color:var(--muted)] opacity-75",
  error:
    "border-[color:var(--rose)] bg-white ring-4 ring-[rgba(156,91,97,0.12)]",
  success:
    "border-[color:var(--accent)] bg-white ring-4 ring-[rgba(54,92,85,0.12)]"
};

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m21 21-4.35-4.35" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 8v5" />
      <path d="M12 17h.01" />
      <path d="M10.3 4.3 2.8 17.1A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.9L13.7 4.3a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

function FieldFrame({
  title,
  helper,
  children
}: {
  title: string;
  helper: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[color:var(--line)] bg-white/55 p-5 shadow-[0_18px_45px_rgba(36,31,24,0.05)]">
      <h4 className="text-sm font-semibold text-[color:var(--foreground)]">
        {title}
      </h4>
      <div className="mt-4">{children}</div>
      <p className="mt-3 text-xs leading-5 text-[color:var(--muted)]">
        {helper}
      </p>
    </article>
  );
}

function FieldLabel({
  htmlFor,
  children
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-[color:var(--foreground)]"
    >
      {children}
    </label>
  );
}

function TextInputPreview({
  state,
  index
}: {
  state: (typeof inputStates)[number];
  index: number;
}) {
  const id = `text-input-${index}`;
  const isDisabled = state.tone === "disabled";
  const isError = state.tone === "error";
  const isSuccess = state.tone === "success";

  return (
    <FieldFrame title={state.name} helper={state.helper}>
      <FieldLabel htmlFor={id}>Project name</FieldLabel>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]">
          <SearchIcon />
        </span>
        <input
          id={id}
          readOnly
          disabled={isDisabled}
          aria-invalid={isError}
          placeholder="Name this playbook"
          defaultValue={state.value}
          className={`${sharedInputClass} ${toneClasses[state.tone]} pl-11 pr-11`}
        />
        {(isError || isSuccess) && (
          <span
            className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${
              isError ? "text-[color:var(--rose)]" : "text-[color:var(--accent)]"
            }`}
          >
            {isError ? <AlertIcon /> : <CheckIcon />}
          </span>
        )}
      </div>
      <p
        className={`mt-2 text-xs leading-5 ${
          isError
            ? "text-[color:var(--rose)]"
            : isSuccess
              ? "text-[color:var(--accent)]"
              : "text-[color:var(--muted)]"
        }`}
      >
        {isError
          ? "Add a clear name before continuing."
          : isSuccess
            ? "This name is available."
            : "Use a concise name your team will recognize."}
      </p>
    </FieldFrame>
  );
}

function TextareaPreview({
  state,
  index
}: {
  state: (typeof inputStates)[number];
  index: number;
}) {
  const id = `textarea-${index}`;
  const isDisabled = state.tone === "disabled";
  const isError = state.tone === "error";
  const isSuccess = state.tone === "success";

  return (
    <FieldFrame title={state.name} helper={state.helper}>
      <FieldLabel htmlFor={id}>Facilitator notes</FieldLabel>
      <textarea
        id={id}
        readOnly
        disabled={isDisabled}
        aria-invalid={isError}
        rows={4}
        placeholder="Add context, constraints, or prompts..."
        defaultValue={
          state.value
            ? `${state.value}. The group needs a little more context.`
            : ""
        }
        className={`${sharedInputClass} ${toneClasses[state.tone]} min-h-32 resize-none`}
      />
      <p
        className={`mt-2 text-xs leading-5 ${
          isError
            ? "text-[color:var(--rose)]"
            : isSuccess
              ? "text-[color:var(--accent)]"
              : "text-[color:var(--muted)]"
        }`}
      >
        {isError
          ? "Notes must be specific enough to guide the session."
          : isSuccess
            ? "Notes are clear enough for review."
            : "Optional context helps the playbook feel tailored."}
      </p>
    </FieldFrame>
  );
}

function SearchInputPreview({
  state,
  index
}: {
  state: (typeof inputStates)[number];
  index: number;
}) {
  const id = `search-input-${index}`;
  const isDisabled = state.tone === "disabled";
  const isError = state.tone === "error";
  const isSuccess = state.tone === "success";

  return (
    <FieldFrame title={state.name} helper={state.helper}>
      <FieldLabel htmlFor={id}>Search library</FieldLabel>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]">
          <SearchIcon />
        </span>
        <input
          id={id}
          type="search"
          readOnly
          disabled={isDisabled}
          aria-invalid={isError}
          placeholder="Search playbooks"
          defaultValue={state.value || (state.tone === "filled" ? "Workshop" : "")}
          className={`${sharedInputClass} ${toneClasses[state.tone]} pl-11 pr-11`}
        />
        {(isError || isSuccess) && (
          <span
            className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${
              isError ? "text-[color:var(--rose)]" : "text-[color:var(--accent)]"
            }`}
          >
            {isError ? <AlertIcon /> : <CheckIcon />}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">
        Search should stay lightweight and predictable.
      </p>
    </FieldFrame>
  );
}

const anatomyItems = [
  "Label",
  "Input surface",
  "Placeholder or value",
  "Optional leading icon",
  "Optional trailing icon",
  "Helper, error, or success text"
];

const tokenRows = [
  ["Colour", "Uses existing CSS colour tokens: foreground, muted, panel, panel-soft, line, accent, accent-strong, rose."],
  ["Typography", "Uses the portal type stack with Geist-first fallback and small, readable labels."],
  ["Spacing", "TODO: replace prototype spacing utilities with approved semantic spacing tokens when code tokens exist."],
  ["Radius", "TODO: replace prototype rounded-2xl radius with approved input/control radius token."],
  ["Elevation", "TODO: replace prototype shadows with approved elevation tokens."]
];

export default function InputsPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/components/inputs" />

        <section className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
              Components / Forms
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
              Inputs
            </h2>
            <p className="mt-5 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
              A calm, accessible input family for collecting short text, longer
              notes, and search queries inside future PlayBooky flows.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <section
              id="purpose"
              className="rounded-2xl border border-[color:var(--line)] bg-white/55 p-6"
            >
              <h3 className="text-lg font-semibold">Purpose</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                Inputs help users provide concise, structured information
                without breaking the calm rhythm of the page.
              </p>
            </section>
            <section className="rounded-2xl border border-[color:var(--line)] bg-white/55 p-6">
              <h3 className="text-lg font-semibold">When to use</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                Use Text Input for short answers, Textarea for longer context,
                and Search Input when the user is narrowing a known collection.
              </p>
            </section>
            <section className="rounded-2xl border border-[color:var(--line)] bg-white/55 p-6">
              <h3 className="text-lg font-semibold">Quality bar</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                Labels, helper text, clear focus, and state-specific feedback
                are required before product use.
              </p>
            </section>
          </div>

          <section id="anatomy" className="mt-12">
            <h3 className="text-2xl font-semibold">Anatomy</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {anatomyItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[color:var(--line)] bg-white/55 px-4 py-3 text-sm font-medium"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section id="variants" className="mt-12">
            <h3 className="text-2xl font-semibold">Variants</h3>
            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <TextInputPreview state={inputStates[0]} index={100} />
              <TextareaPreview state={inputStates[0]} index={100} />
              <SearchInputPreview state={inputStates[0]} index={100} />
            </div>
          </section>

          <section id="states" className="mt-12">
            <h3 className="text-2xl font-semibold">States</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
              Every input variant must define default, hover, focus, filled,
              disabled, error, success, helper text, label, and optional icon
              behaviour before product use.
            </p>
          </section>

          <section id="responsive" className="mt-12">
            <h3 className="text-2xl font-semibold">Responsive behaviour</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {["Desktop", "Tablet", "Mobile"].map((viewport) => (
                <div
                  key={viewport}
                  className="rounded-2xl border border-[color:var(--line)] bg-white/55 p-5"
                >
                  <h4 className="text-sm font-semibold">{viewport}</h4>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                    Inputs keep labels above fields, preserve readable helper
                    text, and use full available width inside their container.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="accessibility" className="mt-12">
            <h3 className="text-2xl font-semibold">Accessibility notes</h3>
            <ul className="mt-4 grid gap-3 text-sm leading-7 text-[color:var(--muted)] lg:grid-cols-2">
              <li>Labels are visible and connected to each field.</li>
              <li>Focus state uses border and ring, not colour alone.</li>
              <li>Error and success states include text and icon treatment.</li>
              <li>Disabled fields remain legible but visually unavailable.</li>
            </ul>
          </section>

          <section id="tokens" className="mt-12">
            <h3 className="text-2xl font-semibold">Token usage</h3>
            <div className="mt-5 overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white/55">
              {tokenRows.map(([category, usage]) => (
                <div
                  key={category}
                  className="grid gap-2 border-b border-[color:var(--line)] p-4 last:border-b-0 sm:grid-cols-[160px_1fr]"
                >
                  <div className="text-sm font-semibold">{category}</div>
                  <div className="text-sm leading-7 text-[color:var(--muted)]">
                    {usage}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="previews" className="mt-12">
            <h3 className="text-2xl font-semibold">Preview examples</h3>
            <div className="mt-6 space-y-10">
              <div>
                <h4 className="text-lg font-semibold">Text Input</h4>
                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {inputStates.map((state, index) => (
                    <TextInputPreview
                      key={`text-${state.name}`}
                      state={state}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Textarea</h4>
                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {inputStates.map((state, index) => (
                    <TextareaPreview
                      key={`textarea-${state.name}`}
                      state={state}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Search Input</h4>
                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {inputStates.map((state, index) => (
                    <SearchInputPreview
                      key={`search-${state.name}`}
                      state={state}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
          </div>
        </section>
      </div>
    </main>
  );
}
