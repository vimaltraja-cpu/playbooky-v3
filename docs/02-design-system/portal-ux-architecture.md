# Design Portal UX Architecture

This document defines how the PlayBooky Design Portal should behave as an experience.

It describes the portal interaction model, page layouts, review surfaces, inspection tools, and future collaboration patterns. It does not define code implementation.

## Portal Philosophy

The Design Portal is the operating surface for PlayBooky design decisions.

It must feel calm, precise, premium, and deeply usable. It should have the confidence and craft of a mature internal design system while keeping PlayBooky's own character: clear, thoughtful, practical, and built around intent before interface.

The portal must help contributors:

- Find the right system decision quickly.
- Understand why it exists.
- Inspect how it behaves.
- Compare approved options.
- See whether something is ready for product use.
- Trace decisions back to documentation.
- Move from design guidance to implementation without guessing.

The portal is not a gallery, playground, marketing page, or loose archive. It is a governed product environment for humans and AI agents.

Experience principles:

- Quiet interface, strong hierarchy.
- System status is always visible.
- The current approved path is obvious.
- Historical work is available without competing with current guidance.
- Examples use realistic PlayBooky content.
- Inspection tools stay close to the thing being inspected.
- Pages scale from quick scanning to deep review.
- AI-readable structure and human-readable craft support each other.

## Navigation

Navigation must make the system feel finite, knowable, and well ordered.

The primary navigation follows the Design Portal information architecture:

1. Foundation
2. Design System
3. Foundations
4. Layout
5. Components
6. Product Components
7. Patterns
8. Motion
9. Assets
10. AI
11. Product

Navigation behaviour:

- Top-level sections remain stable.
- Labels are literal and match documentation terminology.
- Current section and current page are visually clear.
- Product-eligible items can be filtered without changing the underlying hierarchy.
- Deep links must work for every source-of-truth page.
- Navigation must expose status where it helps decision-making.
- Navigation must never hide source-of-truth pages behind decorative group names.

The portal should support two common navigation modes:

- Browse: moving through sections, categories, and related pages.
- Inspect: staying on one item while switching variants, states, viewports, code, accessibility, and history.

## Sidebar Behaviour

The sidebar is the main orientation tool on desktop and large tablet layouts.

Desktop sidebar:

- Persistent on all portal pages.
- Shows top-level sections and current-section children.
- Highlights active section and active page.
- Includes search access.
- Shows status markers for governed items where useful.
- Supports collapsible groups for large component sets.
- Keeps the active page visible even when groups are collapsed.

Tablet sidebar:

- May become narrower, collapsible, or drawer-based.
- Must preserve section context.
- Must keep search available.
- Must not remove access to status filters or page hierarchy.

Mobile sidebar:

- Becomes a drawer, sheet, or section switcher.
- Must expose all top-level sections.
- Must preserve breadcrumbs and search access.
- Must not require horizontal scrolling.

Sidebar interaction rules:

- Expanding one group must not unexpectedly collapse the current active path.
- Collapsed groups must preserve unread or status indicators when relevant.
- Long lists should support local filtering.
- Section order must not change based on usage.

## Search

Search is a fast access layer over the same source-of-truth system.

Search must support:

- Page titles.
- Section names.
- Component names.
- Token names.
- Pattern names.
- Asset names.
- Props and data fields.
- Variants.
- States.
- Status.
- Confidence rating.
- Related docs.
- Related code.
- Used-in references.
- Decision history where practical.

Search results should show:

- Title.
- Section.
- Type.
- Status.
- Confidence rating where applicable.
- Short description.
- Matching reason.
- Related source links.

Search behaviour:

- Source-of-truth pages rank above examples.
- Current items rank above Approved alternatives when both match.
- Rejected and Deprecated results are visible only when explicitly included or when the query clearly seeks history.
- Search must support keyboard-first use.
- Empty search should suggest common entry points and recently reviewed areas.
- Search must not create a second taxonomy.

## Breadcrumbs

Breadcrumbs show location, not history.

Every leaf page must include breadcrumbs using the same labels as navigation and URL hierarchy.

Breadcrumb rules:

- Visible on desktop, tablet, and mobile.
- Truncated only when space requires it.
- Always preserve the current page title.
- Each parent crumb links to its portal page.
- Breadcrumbs must not include lifecycle status or version unless the current page is a history record.

## Status Badges

Status badges make lifecycle state immediately visible.

Supported statuses:

- Exploring
- Improved
- Approved
- Current
- Rejected
- Deprecated

Badge behaviour:

- Every governed page shows status in the page header.
- Status appears in cards, search results, related links, and dashboards where useful.
- Current and Approved must be visually distinct.
- Rejected and Deprecated must never look product-eligible.
- Status badges may include tooltips explaining eligibility.
- Status changes must be connected to decision history.

Product eligibility:

- Current: preferred for product use.
- Approved: allowed for product use.
- Exploring, Improved, Rejected, Deprecated: not allowed for new product use.

## Confidence Badges

Confidence badges communicate readiness.

Supported confidence levels:

1. Experimental
2. Prototype
3. Visually directional
4. Usability ready
5. Production ready

Badge behaviour:

- Confidence appears next to lifecycle status on governed pages.
- Confidence appears in dashboards and search results where readiness matters.
- Ratings 4 and 5 may be product-eligible only when lifecycle status is Approved or Current.
- Ratings 1, 2, and 3 must feel visibly provisional.
- Confidence badges should explain what evidence is missing when confidence is low.

## Version History

Version history shows how an item changed over time.

Each governed item should expose:

- Current version.
- Previous versions where meaningful.
- Change summary.
- Date.
- Owner or approver.
- Migration impact.
- Related decision entries.

Version history behaviour:

- Current version is shown first.
- Older versions are available but visually secondary.
- Deprecated or rejected versions must not appear as available choices.
- Breaking changes must show migration notes.
- Version history should connect to used-in impact.

## Decision History

Decision history explains why a direction exists.

Decision history should include:

- Date.
- Status.
- Decision summary.
- Rationale.
- Owner or approver.
- Impact.
- Related documentation.
- Related implementation where available.

Decision history behaviour:

- Newest decisions appear first.
- Decisions can be filtered by lifecycle status.
- Rejected decisions remain visible as rationale, not as selectable examples.
- Approval decisions must explain the basis for approval.
- AI agents and reviewers must be able to trace the current recommendation back through decision history.

## Responsive Preview

Responsive preview is the portal's primary inspection surface for layout behaviour.

Each component, layout primitive, product component, and relevant pattern page should include desktop, tablet, and mobile previews.

Preview behaviour:

- Preview surfaces use realistic PlayBooky content.
- Preview containers have stable dimensions.
- Viewport size is labelled.
- Breakpoint source is linked to foundation breakpoint guidance.
- Content wrapping, truncation, hiding, reordering, and disclosure changes are visible.
- Preview state must not drift from documented rules.

Responsive preview must support inspection without implying that preview size is the only supported viewport.

## Desktop / Tablet / Mobile Switching

Viewport switching must be direct and predictable.

Controls:

- Desktop
- Tablet
- Mobile

Switching behaviour:

- The selected viewport remains active while changing variants or states.
- The portal preserves scroll position where useful.
- The selected viewport label shows the relevant breakpoint range when known.
- If a viewport is not documented, the page must mark it incomplete.
- Mobile preview must never be inferred from desktop preview.
- Tablet preview must be explicitly documented even when behaviour matches another viewport.

## Variant Switching

Variant switching lets contributors compare approved presentations.

Variant controls should:

- List only documented variants.
- Show the default variant first.
- Use stable names that match props and documentation.
- Preserve selected viewport and state when possible.
- Disable impossible combinations with a clear reason.

Variant behaviour:

- Selecting a variant updates preview, props, code example, accessibility notes, and relevant usage rules.
- Undocumented variants must not appear.
- Experimental variants must be clearly marked and excluded from product-eligible views.

## State Switching

State switching exposes interaction, system, and content states.

State controls should include relevant states such as:

- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Empty
- Error
- Success
- Selected
- Expanded
- Collapsed

State behaviour:

- States must match documented behaviour.
- Unsupported states appear only when the page explains why they are unsupported.
- Focus state must be inspectable for interactive components.
- Error and loading states must show content behaviour, not only styling.
- State changes should update code and accessibility guidance where relevant.

## Motion Playback

Motion playback lets contributors inspect timing, easing, causality, and reduced-motion behaviour.

Motion controls should support:

- Play.
- Pause.
- Replay.
- Slow playback.
- Reduced-motion mode.
- Motion token display.

Motion behaviour:

- Motion must be tied to documented triggers.
- Playback must identify duration and easing tokens.
- Reduced-motion behaviour must be visible.
- Decorative or undocumented motion must not appear.
- Motion must not be required to understand the page.

## Code Viewer

The code viewer connects guidance to implementation.

Code viewer content should include:

- Import path.
- Default usage.
- Variant examples.
- Important state examples.
- Props or data contract references.
- Token references where useful.
- Implementation status.

Code viewer behaviour:

- Code examples must use documented props only.
- Code examples must update when selected variant or state changes.
- Product-eligible examples must use Approved or Current items only.
- If implementation is pending, the viewer must say so clearly.
- Copy actions should copy only valid examples.
- Code must be secondary to intent, usage, and accessibility guidance, not a replacement for them.

## Accessibility Viewer

The accessibility viewer shows how the item supports inclusive use.

Accessibility viewer content should include:

- Semantic role or native element.
- Keyboard behaviour.
- Focus behaviour.
- Accessible name, role, and value.
- Screen reader announcement notes.
- Colour contrast requirements.
- Touch target requirements.
- Error announcement behaviour.
- Disabled behaviour.
- Reduced-motion behaviour.
- Known limitations or exceptions.

Accessibility viewer behaviour:

- Interactive components must expose keyboard and focus guidance.
- Missing accessibility requirements must block Approval and Current readiness.
- Accessibility notes should update with selected variant, state, and viewport where behaviour changes.
- Exceptions must link to approved exception records.

## Related Components

Related Components help contributors choose the right system part.

Each related component link should include:

- Component name.
- Relationship type.
- Status.
- Confidence.
- When to use it instead.

Relationship types:

- Alternative
- Dependency
- Companion
- Parent
- Child

Related component behaviour:

- Alternatives must include decision guidance.
- Dependencies must explain what is inherited.
- Deprecated components must show replacement guidance.
- Related links must not become a generic list of nearby pages.

## Related Patterns

Related Patterns connect components and foundations to reusable workflows.

Each related pattern link should include:

- Pattern name.
- Relationship to the current page.
- Status.
- Confidence where applicable.
- Behaviour inherited from the pattern.

Pattern relationship behaviour:

- Pattern rules must not silently override component rules.
- Conflicts must be surfaced for review.
- Pattern links should help contributors understand multi-component behaviour.

## Related Tokens

Related Tokens expose the foundation decisions behind visual behaviour.

Related token links should include:

- Token name.
- Category.
- Status.
- Intended use.
- Example rendering where visual.

Related token behaviour:

- Token links must point to approved foundation token pages or entries.
- Missing token needs must be shown as gaps, not invented values.
- Deprecated tokens must show replacement guidance.
- Token relationships should update when selected variant, state, or viewport changes.

## Used In

Used In shows impact and adoption.

Used-in references should include:

- Product pages.
- Product flows.
- Patterns.
- Components.
- Design Portal pages.
- Legacy usage where relevant.

Each reference should show:

- Usage context.
- Usage status.
- Link.
- Version or status dependency where useful.

Used-in behaviour:

- Active usage must be easy to distinguish from planned or legacy usage.
- Breaking changes must highlight affected usage.
- Missing used-in tracking must be shown as unknown, not treated as unused.

## Cross-Links

Cross-links turn the portal into a navigable decision graph.

Cross-links may connect:

- Portal pages to documentation.
- Portal pages to code.
- Components to related tokens.
- Components to patterns.
- Patterns to product decisions.
- Assets to usage rules.
- AI rules to quality gates.
- History entries to approvals.

Cross-link rules:

- Links must be purposeful.
- Link labels must explain the relationship.
- Links should support both human navigation and AI retrieval.
- Broken links must be treated as documentation defects.
- Cross-links must not duplicate the sidebar hierarchy.

## Portal Homepage

The portal homepage is the front door to the operating system.

It should show:

- System purpose.
- Current readiness summary.
- Primary sections.
- Product-eligible system areas.
- Recent decisions.
- Open review items.
- Token and component health indicators.
- Quick search.
- Links to constitution and quality gates.

Homepage behaviour:

- It should help a new contributor understand where to start.
- It should help a returning contributor resume work.
- It should avoid marketing-style hero treatment.
- It should make the system feel active, governed, and trustworthy.

## Portal Dashboards

Dashboards summarize system health.

Useful dashboards:

- System readiness.
- Component status.
- Token coverage.
- Accessibility review status.
- Responsive documentation coverage.
- Motion coverage.
- Deprecated items and migration windows.
- Review queue.
- Used-in impact.
- Documentation freshness.

Dashboard behaviour:

- Dashboards must link to source-of-truth pages.
- Metrics must explain their source.
- Dashboards must not become a separate approval surface.
- Unknown data should be labelled as unknown.
- Dashboards should support filtering by section, status, confidence, owner, and review need.

## Portal Page Layouts

Portal pages should use a consistent inspection layout.

Common page regions:

- Breadcrumbs.
- Page header.
- Status and confidence metadata.
- Summary.
- Primary content.
- Inspection tools.
- Related links.
- Decision history.
- Documentation and code links.

Layout behaviour:

- The main recommendation appears before historical alternatives.
- Metadata stays close to the title.
- Review-critical warnings appear near the top.
- Long pages should have local section navigation.
- Inspection panels may be sticky on desktop when useful.
- Mobile pages should preserve all content while simplifying layout.

## Component Page Layout

Component pages are the most interactive portal pages.

Recommended layout:

- Header with title, category, status, confidence, version, owner, and last updated.
- Purpose, user need, and success criteria.
- Live preview with viewport, variant, state, and motion controls.
- Usage rules and do/don't guidance.
- Anatomy.
- Props and data contract.
- Accessibility viewer.
- Code viewer.
- Related components, patterns, and tokens.
- Used-in references.
- Version and decision history.
- Quality gate and acceptance criteria.

Component page behaviour:

- Preview controls must update code and accessibility context where relevant.
- Default variant and state are shown first.
- Product-eligible guidance is visually separated from exploration.
- Missing required sections must be visible as readiness gaps.

## Foundation Page Layout

Foundation pages explain low-level system rules.

Recommended layout:

- Header with category, status, owner, and last reviewed date.
- Category purpose.
- Naming rules.
- Token list or architecture guidance.
- Usage rules.
- Responsive behaviour where applicable.
- Accessibility impact where applicable.
- Validation rules.
- Related components, patterns, and code.
- Decision history.

Foundation page behaviour:

- Token values must appear only when approved.
- Proposed tokens must be visually separated from approved tokens.
- Deprecated tokens must include replacement guidance.
- Token category pages must link back to the foundation token architecture.

## Pattern Page Layout

Pattern pages explain reusable workflows and multi-component behaviours.

Recommended layout:

- Header with status, confidence, owner, and version.
- Purpose, user need, and success criteria.
- Pattern overview.
- Flow or sequence.
- Component dependencies.
- State and edge-case behaviour.
- Responsive behaviour.
- Accessibility requirements.
- Motion guidance.
- Data requirements where relevant.
- Related components, tokens, product decisions, and examples.
- Used-in references.
- Decision history.

Pattern page behaviour:

- Patterns should show how components work together.
- Patterns must not hide component-level restrictions.
- Conflicts between pattern and component rules must be surfaced.

## Motion Page Layout

Motion pages explain motion principles, behaviours, and reusable motion patterns.

Recommended layout:

- Header with status, confidence, owner, and last reviewed date.
- Motion purpose.
- Behavioural rule or pattern.
- Trigger.
- Duration and easing tokens.
- Enter and exit behaviour.
- Reduced-motion behaviour.
- Playback preview.
- Usage rules.
- Accessibility impact.
- Related components, patterns, and tokens.
- Decision history.

Motion page behaviour:

- Motion previews must include reduced-motion mode.
- Duration and easing must reference approved tokens.
- Motion must be explained by purpose, not decoration.

## Asset Page Layout

Asset pages govern visual and brand assets.

Recommended layout:

- Header with asset category, status, owner, and last reviewed date.
- Asset purpose.
- Approved assets.
- Usage rules.
- Do and don't guidance.
- Accessibility and content considerations.
- File locations or implementation references.
- Related components, patterns, and product decisions.
- Deprecated or rejected assets.
- Decision history.

Asset page behaviour:

- Approved assets must be visually inspectable.
- Legacy or rejected assets must not look available for use.
- Asset usage must link to product or component contexts where known.

## Documentation Integration

Documentation and portal pages are connected but not identical.

Documentation integration must support:

- Links from portal pages to governing docs.
- Links from docs to portal pages where implementation exists.
- Clear distinction between specification, portal presentation, and code.
- Freshness indicators where useful.
- Conflict reporting when docs and portal disagree.

Integration behaviour:

- A portal page should show its supporting documentation links.
- A documentation page should be reachable from the relevant portal area.
- Missing documentation must appear as a readiness gap.
- Documentation excerpts may appear in the portal when they help inspection, but the portal must link to the canonical doc.

## Case-Study Presentation Mode

Case-study presentation mode lets the portal show the quality and reasoning of the system without weakening its operational role.

Presentation mode should:

- Emphasize narrative, rationale, and selected examples.
- Show system maturity and craft.
- Hide internal noise that is not useful to the audience.
- Preserve status and source-of-truth integrity.
- Avoid presenting unapproved work as final.

Presentation mode must not:

- Become a separate source of truth.
- Change lifecycle status.
- Hide critical readiness warnings for internal users.
- Replace operational portal pages.

## Review Mode

Review mode helps contributors evaluate readiness.

Review mode should show:

- Required evidence.
- Missing sections.
- Quality gate checklist.
- Accessibility review status.
- Responsive review status.
- Token review status.
- Motion review status.
- Used-in impact.
- Open questions.
- Required owners.

Review behaviour:

- Reviewers can inspect evidence without leaving the page.
- Failed checks are visible and actionable.
- Unknown evidence is marked unknown.
- Review mode cannot approve work by itself unless approval authority and required evidence are present.

## Approval Mode

Approval mode records readiness decisions.

Approval mode should support:

- Owner review.
- Status change.
- Confidence change.
- Approval rationale.
- Required evidence summary.
- Migration impact where relevant.
- Decision history entry.
- Timestamp and approver.

Approval behaviour:

- Approval requires all required evidence.
- Approval cannot silently skip missing accessibility, responsive, motion, token, data, or quality checks.
- Approval must create or update decision history.
- Approval must not be available to users without the relevant decision authority.
- If approval is blocked, the portal should explain why.

## Future Collaboration Mode

Future collaboration mode should help multiple contributors and AI agents work safely in the same system.

Future collaboration features may include:

- Page comments.
- Review threads.
- Suggested edits.
- AI-generated readiness summaries.
- Ownership requests.
- Change proposals.
- Conflict detection.
- Watch lists.
- Notifications for affected owners.
- Review assignments.

Collaboration behaviour:

- Comments and suggestions must not become source-of-truth decisions until approved.
- AI suggestions must be labelled.
- Open questions should stay linked to the page or decision they affect.
- Contributors should see when a page has active review work.
- Conflicts between docs, portal, and code should be surfaced before approval.

## Acceptance Criteria

This UX architecture is accepted when:

- The portal philosophy is defined.
- Navigation, sidebar, search, and breadcrumbs are specified.
- Status, confidence, version, and decision history behaviours are defined.
- Interactive inspection controls are specified for viewport, variant, state, and motion.
- Code and accessibility viewers are defined.
- Related components, patterns, tokens, used-in references, and cross-links are defined.
- Homepage and dashboard expectations are documented.
- Component, foundation, pattern, motion, and asset page layouts are documented.
- Documentation integration is defined.
- Case-study presentation, review, approval, and future collaboration modes are defined.
- The document describes experience architecture only and does not require code implementation.
