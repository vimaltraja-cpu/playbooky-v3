# Development Workflow

This document defines the complete lifecycle for every piece of work in PlayBooky V3.

Every task, whether performed by a human or AI agent, must follow this workflow. The workflow applies to documentation, Design Portal pages, components, product components, patterns, tokens, assets, data contracts, product pages, infrastructure decisions, and implementation code.

The Constitution remains the highest authority. If this workflow conflicts with the Constitution, the Constitution wins and this document must be corrected.

## Workflow Principles

- Work must move from intent to specification before interface or code.
- Documentation is the specification layer.
- The Design Portal is the live implementation layer for Approved and Current design system decisions.
- Code is the execution layer.
- Product screens may use only Approved or Current system items with confidence rating 4 or 5.
- AI agents must stop on governance conflicts instead of guessing.
- Every stage must produce enough evidence for the next stage to proceed safely.

## Stage 1: Idea

### Purpose

Identify a need, opportunity, defect, or system gap before committing to a solution.

### Inputs

- User request.
- Product need.
- Design system gap.
- Bug report.
- Accessibility issue.
- Technical debt.
- AI or human observation.

### Outputs

- Clear problem statement.
- Initial user need.
- Initial scope.
- Known uncertainty.
- Suggested owner or decision source.

### Required Documents

- Constitution.
- Product vision or roadmap when the idea affects product direction.
- Relevant component, pattern, token, layout, asset, or AI documentation when it exists.

### Required Approvals

- Product owner approval for product-facing ideas.
- Design system owner approval for design system ideas.
- Vimal Raja approval when ownership is unclear.

### AI Responsibilities

- Read the Constitution before shaping the idea.
- Identify whether the idea belongs in product, design system, engineering, accessibility, content, motion, tokens, AI behaviour, or data.
- Check for existing documentation that already covers the need.
- Avoid proposing interface or code before intent is clear.

### Exit Criteria

- The need is understandable.
- The affected area is identified.
- Initial owner or decision source is recorded.
- The idea is either accepted for specification or rejected with rationale.

### Validation

- Confirm the idea does not duplicate an existing Approved or Current item.
- Confirm the idea has a user, system, or governance need.
- Confirm the idea has a clear next document to update or create.

### Failure Conditions

- The idea is only a visual preference with no stated purpose.
- The idea duplicates an existing Approved or Current item.
- The affected owner cannot be identified.
- The idea conflicts with the Constitution.

### Escalation Path

Escalate to Vimal Raja when ownership, priority, or constitutional fit is unclear.

## Stage 2: Specification

### Purpose

Turn the idea into documented intent, requirements, acceptance criteria, and governance metadata.

### Inputs

- Accepted idea.
- Existing documentation.
- Existing portal page.
- Existing implementation.
- User need and success criteria.

### Outputs

- Specification document or updated source-of-truth page.
- Purpose.
- User need.
- Success criteria.
- Lifecycle status.
- Confidence rating.
- Owner.
- Decision history entry.

### Required Documents

- Constitution.
- Component page template for reusable components.
- Information architecture for portal pages.
- Relevant foundation, layout, component, pattern, asset, product, AI, or data documentation.

### Required Approvals

- Product approval for product-facing specifications.
- Design system approval for reusable UI, patterns, layout, tokens, or portal decisions.
- Accessibility, content, motion, token, engineering, or data approval when the specification touches those areas.

### AI Responsibilities

- Draft or update the specification in the correct source-of-truth location.
- Use the canonical lifecycle and confidence models.
- Mark uncertainty explicitly.
- Avoid inventing approval, owner, or confidence evidence.
- Report conflicts between existing docs and the Constitution.

### Exit Criteria

- Purpose, user need, and success criteria are documented.
- Required status metadata exists.
- Affected source-of-truth pages are identified.
- Required approvals for moving to architecture review are known.

### Validation

- Check the specification against the Constitution.
- Check that product eligibility is not claimed before approval.
- Check that required fields are not empty or marked with unresolved placeholders.

### Failure Conditions

- Purpose, user need, or success criteria are missing.
- Status or confidence conflicts with the canonical models.
- Specification contradicts a higher-trust source.
- Required governance owner is missing.

### Escalation Path

Escalate to the affected decision owner. Escalate to Vimal Raja when multiple owners disagree.

## Stage 3: Architecture Review

### Purpose

Confirm that the proposed work fits PlayBooky architecture, design system structure, data boundaries, and long-term maintainability before portal or code work begins.

### Inputs

- Specification.
- Existing code structure.
- Existing component taxonomy.
- Data contracts.
- Token and layout rules.
- Used-in references.

### Outputs

- Architecture decision.
- Component, product component, pattern, token, data, or library placement.
- API and prop contract direction.
- Migration notes when the change affects existing use.
- Risks and constraints.

### Required Documents

- Constitution.
- Information architecture.
- Component page template.
- Relevant engineering, token, data, component, product component, layout, and pattern docs.

### Required Approvals

- Engineering approval for implementation architecture.
- Design system approval for taxonomy, reuse, and portal placement.
- Data approval for data contracts or database implications.
- Token approval for new or changed token needs.

### AI Responsibilities

- Inspect existing code and documentation before recommending architecture.
- Identify reusable UI, shared logic, and product-specific component boundaries.
- Check for duplicate or overlapping components.
- Stop if architecture conflicts with governance.

### Exit Criteria

- Correct location for the work is defined.
- Shared logic, reusable UI, and product-specific UI boundaries are clear.
- API, props, and data contract expectations are documented.
- Breaking-change and migration risks are known.

### Validation

- Confirm reusable UI belongs in `components`.
- Confirm product-specific components belong in `components/product`.
- Confirm shared non-UI logic belongs in `lib`.
- Confirm product pages compose and pass data instead of owning reusable UI.

### Failure Conditions

- Architecture requires one-off product UI.
- Architecture bypasses the Design Portal.
- API or data contract is not typed.
- Existing usage impact is unknown for a breaking change.

### Escalation Path

Escalate to engineering and design system owners. Escalate to Vimal Raja for unresolved architecture or taxonomy decisions.

## Stage 4: Portal Implementation

### Purpose

Represent the approved specification in the Design Portal as the live implementation layer before product use.

### Inputs

- Specification.
- Architecture review outcome.
- Component or pattern requirements.
- Token, motion, accessibility, content, and data requirements.

### Outputs

- Portal page or updated portal page.
- Live examples when implementation exists.
- Status tag.
- Confidence rating.
- Related links.
- Used-in references.
- Decision history.

### Required Documents

- Constitution.
- Information architecture.
- Component page template for components.
- Relevant section documentation for foundations, layout, components, patterns, assets, AI, or product.

### Required Approvals

- Design system approval for portal structure and source-of-truth representation.
- Content approval for portal language.
- Accessibility approval for accessibility guidance.
- Motion, token, or data approval when those areas are represented.

### AI Responsibilities

- Implement or update the portal page according to the documented template.
- Ensure portal content matches the specification.
- Avoid mock examples that appear production-ready unless clearly labelled.
- Report missing implementation, missing examples, or conflicting guidance.

### Exit Criteria

- Portal page exists in the correct IA location.
- Status, confidence, owner, version, and last reviewed metadata are visible.
- Required sections are complete or explicitly marked as not applicable.
- Portal page links to supporting docs and code when code exists.

### Validation

- Check the page against the IA.
- Check component pages against the page template.
- Check lifecycle and confidence values.
- Check that live examples use real implementation when code exists.

### Failure Conditions

- Portal page does not match the specification.
- Portal page hides status, confidence, or owner metadata.
- Portal examples diverge from production code without being labelled.
- Portal page creates a second source of truth.

### Escalation Path

Escalate to design system owner. Escalate to Vimal Raja if portal and documentation cannot be aligned.

## Stage 5: Self Validation

### Purpose

Require the contributor or AI agent to verify their own work before asking for review.

### Inputs

- Updated docs.
- Updated portal page.
- Updated code when code exists.
- Quality gate checklist.

### Outputs

- Self-review summary.
- List of changed files.
- Validation results.
- Known issues or blockers.
- Confirmed next review owner.

### Required Documents

- Constitution.
- Quality gate.
- Relevant source-of-truth docs.
- Development workflow.

### Required Approvals

- No external approval is required to complete self validation, but self validation must be complete before design review or engineering validation.

### AI Responsibilities

- Run required checks for the type of change.
- Compare docs, portal, and code for alignment.
- Report changed files.
- Report skipped checks with reasons.
- Stop on conflicts instead of hiding uncertainty.

### Exit Criteria

- Quality gate checklist is complete.
- Known issues are fixed or documented as blockers.
- Required validation commands or manual reviews are complete.
- Changed files are listed.

### Validation

- Confirm lint, typecheck, and build requirements.
- Confirm responsive, accessibility, reduced-motion, token, product safety, and documentation checks.
- Confirm no random token values or one-off product UI were introduced.

### Failure Conditions

- Required checks fail.
- Contributor cannot explain changed files.
- Docs, portal, and code do not align.
- AI agent guesses around a governance conflict.

### Escalation Path

Escalate failed governance checks to the relevant owner. Escalate unresolved conflicts to Vimal Raja.

## Stage 6: Design Review

### Purpose

Evaluate whether the work meets PlayBooky design system standards, product intent, accessibility expectations, responsive behaviour, content quality, and motion rules.

### Inputs

- Specification.
- Portal implementation.
- Self-validation summary.
- Live examples or screenshots.
- Accessibility, motion, token, and content notes.

### Outputs

- Design review decision.
- Required changes.
- Approved design evidence.
- Decision history update.

### Required Documents

- Constitution.
- Component page template.
- Relevant foundation, layout, component, pattern, motion, asset, and product docs.

### Required Approvals

- Design system approval.
- Product approval for product-facing work.
- Accessibility approval for interactive or content-bearing UI.
- Content approval for visible language.
- Motion approval when motion exists.
- Token approval when token usage changes.

### AI Responsibilities

- Prepare review evidence.
- Point reviewers to affected docs, portal pages, and code.
- Identify unresolved risks.
- Do not mark work Approved or Current unless approval evidence exists.

### Exit Criteria

- Design review is approved or returned with required changes.
- Required changes are documented.
- Decision history is updated.
- Affected owners have approved or blocked the work.

### Validation

- Confirm intent, usability, accessibility, responsive, motion, content, and token requirements.
- Confirm Approved and Current claims are supported by evidence.
- Confirm product pages use only product-eligible items.

### Failure Conditions

- Design intent is unclear.
- Component duplicates an existing pattern without rationale.
- Accessibility, responsive, content, token, or motion evidence is missing.
- Reviewers disagree on governance.

### Escalation Path

Escalate to the relevant decision owner. Escalate cross-area conflicts to Vimal Raja.

## Stage 7: Approval

### Purpose

Authorize the work for product use, implementation, or release according to lifecycle status and confidence rules.

### Inputs

- Specification.
- Architecture review.
- Portal implementation.
- Self validation.
- Design review outcome.
- Required owner approvals.

### Outputs

- Approved status when product use is allowed.
- Current status when the item is the preferred active implementation.
- Confidence rating 4 or 5 for product-eligible items.
- Approval record.
- Updated decision history.

### Required Documents

- Constitution.
- Source-of-truth specification.
- Portal page.
- Decision history.
- Quality gate checklist.

### Required Approvals

- Design system and engineering approval for components and product components.
- Product approval for product-facing work.
- Accessibility and content approval for interactive or content-bearing work.
- Motion, token, AI, or data approval when affected.
- Vimal Raja approval when final ownership is unclear or contested.

### AI Responsibilities

- Verify approval evidence before changing status.
- Avoid promoting lifecycle status without approval.
- Record approval context in decision history when instructed.
- Report missing approval evidence.

### Exit Criteria

- Required approvals are recorded.
- Lifecycle status is correct.
- Confidence rating is correct.
- Product eligibility is clear.
- Decision history reflects the approval.

### Validation

- Confirm status is one of the canonical statuses.
- Confirm product-eligible work is Approved or Current with confidence rating 4 or 5.
- Confirm docs, portal, and code are aligned when implementation exists.

### Failure Conditions

- Approval evidence is missing.
- Confidence rating is below product eligibility.
- Required owner has not reviewed.
- Status is promoted silently.

### Escalation Path

Escalate missing or disputed approval to Vimal Raja.

## Stage 8: Implementation

### Purpose

Build the approved work in code while preserving documented intent, architecture, accessibility, data contracts, and portal alignment.

### Inputs

- Approved specification.
- Architecture review.
- Portal page.
- Component API and data contract.
- Design review decisions.

### Outputs

- Code implementation.
- Typed props.
- Updated examples.
- Updated tests when required.
- Updated documentation and portal links.

### Required Documents

- Constitution.
- Approved specification.
- Portal page.
- Relevant engineering, component, token, data, accessibility, and motion docs.

### Required Approvals

- Engineering approval for code structure and API.
- Design system approval for component implementation.
- Accessibility, motion, token, content, and data approvals when implementation affects those areas.

### AI Responsibilities

- Inspect existing code before editing.
- Keep changes scoped.
- Use approved components, tokens, and layout rules.
- Preserve user and developer work.
- Report changed files and validation results.

### Exit Criteria

- Code matches approved docs and portal guidance.
- Props and data contracts are typed.
- Product pages compose approved components.
- Shared logic and reusable UI are placed correctly.
- Breaking changes include migration notes.

### Validation

- Check architecture boundaries.
- Check typed props and data contracts.
- Check token usage.
- Check no one-off product page UI or direct product styling was introduced.
- Check docs, portal, and code alignment.

### Failure Conditions

- Code bypasses approved portal guidance.
- Product page owns reusable UI.
- Props or data contracts are untyped.
- Breaking change lacks migration notes.
- Random token values are introduced.

### Escalation Path

Escalate architecture, API, or migration issues to engineering and design system owners. Escalate unresolved conflicts to Vimal Raja.

## Stage 9: Engineering Validation

### Purpose

Verify that implementation is technically correct, maintainable, typed, buildable, and aligned with architecture rules.

### Inputs

- Code implementation.
- Tests.
- Documentation.
- Portal page.
- Self-validation notes.

### Outputs

- Engineering validation result.
- Test results.
- Build results.
- Required fixes.
- Residual risk notes.

### Required Documents

- Constitution.
- Quality gate.
- Architecture review notes.
- Relevant implementation docs.

### Required Approvals

- Engineering approval.
- Design system approval when implementation changes shared components.
- Data approval when data contracts or integrations are changed.

### AI Responsibilities

- Run required validation commands.
- Report failures exactly enough to act on.
- Fix failures within scope.
- Do not claim validation passed if checks were skipped or failed.

### Exit Criteria

- Lint passes for code changes.
- Typecheck passes for code changes.
- Build passes for application-impacting changes.
- Tests pass when tests exist or are required.
- Residual technical risk is documented.

### Validation

- Run lint, typecheck, build, and targeted tests as required.
- Review API stability, typed props, dependency direction, and migration notes.
- Confirm implementation does not create hidden product-only UI.

### Failure Conditions

- Required command fails.
- Required command is skipped without reason.
- Implementation breaks architecture boundaries.
- Migration risk is unresolved.

### Escalation Path

Escalate unresolved technical failures to engineering owner. Escalate scope or governance conflict to Vimal Raja.

## Stage 10: QA

### Purpose

Confirm the work behaves correctly in realistic conditions before release.

### Inputs

- Validated implementation.
- Portal examples.
- Acceptance criteria.
- Test data or mock data.
- Accessibility and responsive requirements.

### Outputs

- QA result.
- Defect list.
- Visual, responsive, accessibility, and interaction findings.
- Release recommendation or blocker list.

### Required Documents

- Constitution.
- Quality gate.
- Specification.
- Portal page.
- Acceptance criteria.

### Required Approvals

- QA or reviewer approval for release readiness.
- Accessibility approval for accessibility-sensitive work.
- Product approval for product-facing behaviour.

### AI Responsibilities

- Verify against acceptance criteria.
- Test desktop, tablet, and mobile behaviour for UI changes.
- Check reduced-motion behaviour when motion exists.
- Use realistic mock data and avoid PII.
- Report defects clearly.

### Exit Criteria

- Acceptance criteria pass.
- No release blockers remain.
- Responsive, accessibility, motion, data, and content checks pass.
- Known non-blocking issues are documented.

### Validation

- Manual or automated interaction checks.
- Responsive review on desktop, tablet, and mobile.
- Accessibility review against WCAG 2.2 AA expectations.
- Data state checks for loading, empty, error, invalid, and long content states when the component accepts data.

### Failure Conditions

- Acceptance criteria fail.
- Accessibility blocker exists.
- Responsive layout breaks.
- Product behaviour does not match the approved specification.
- Mock or AI-generated data is misleading.

### Escalation Path

Escalate defects to the responsible implementation owner. Escalate release blockers to Vimal Raja when priority or scope is disputed.

## Stage 11: Release

### Purpose

Make the approved and validated work available for product use or active system reference.

### Inputs

- Approval record.
- Engineering validation result.
- QA result.
- Updated docs.
- Updated portal page.
- Updated code.

### Outputs

- Released work.
- Current or Approved status confirmation.
- Release notes or decision history entry.
- Migration notes when replacing existing work.
- Updated used-in tracking.

### Required Documents

- Constitution.
- Portal page.
- Decision history.
- Migration notes when required.
- Release notes when required.

### Required Approvals

- Final release approval from the responsible owner.
- Vimal Raja approval for major product, governance, or system-level release decisions.

### AI Responsibilities

- Confirm release evidence is complete.
- Confirm working tree and changed files are understood.
- Update decision history or release notes when instructed.
- Avoid claiming release if deployment or publish steps were not performed.

### Exit Criteria

- Work is released or ready for release according to the agreed process.
- Status and confidence are accurate.
- Used-in tracking is updated.
- Migration notes are available when required.

### Validation

- Confirm docs, portal, and code match.
- Confirm no unresolved blockers remain.
- Confirm product eligibility rules are satisfied.
- Confirm release notes and decision history are current.

### Failure Conditions

- Release occurs without approval.
- Status does not match actual readiness.
- Migration guidance is missing.
- Used-in tracking is stale.

### Escalation Path

Escalate release readiness disputes to the responsible owner. Escalate final release conflicts to Vimal Raja.

## Stage 12: Maintenance

### Purpose

Keep released work accurate, usable, governed, and aligned as the product and design system evolve.

### Inputs

- Released component, pattern, token, asset, page, data contract, or code.
- Usage feedback.
- Defects.
- Accessibility findings.
- Product changes.
- Dependency updates.

### Outputs

- Updated docs.
- Updated portal page.
- Updated code.
- Updated status, confidence, owner, and last reviewed metadata.
- Decision history entries.
- Maintenance backlog when issues cannot be fixed immediately.

### Required Documents

- Constitution.
- Relevant source-of-truth page.
- Used-in tracking.
- Decision history.
- Quality gate.

### Required Approvals

- Relevant owner approval for meaningful changes.
- Engineering approval for API or implementation changes.
- Design system approval for behaviour or usage changes.
- Accessibility, content, motion, token, or data approval when affected.

### AI Responsibilities

- Check used-in references before changes.
- Preserve backward compatibility unless migration is approved.
- Update decision history for meaningful changes.
- Report stale docs, portal examples, or code.

### Exit Criteria

- Released work remains aligned across docs, portal, and code.
- Metadata is current.
- Known issues are fixed, documented, or escalated.
- Product usage remains safe.

### Validation

- Run relevant quality gates.
- Confirm used-in tracking.
- Confirm docs, portal, and code alignment.
- Confirm no new duplicate component or pattern was introduced.

### Failure Conditions

- Documentation drifts from code or portal.
- Used-in tracking becomes unreliable.
- Component API changes without migration notes.
- Accessibility, responsive, motion, token, or data requirements regress.

### Escalation Path

Escalate maintenance drift to the relevant owner. Escalate repeated drift or ownership gaps to Vimal Raja.

## Stage 13: Deprecation

### Purpose

Remove an item from new product use while protecting existing product surfaces and preserving historical context.

### Inputs

- Deprecated candidate.
- Replacement guidance.
- Used-in tracking.
- Migration plan.
- Defect, duplication, product, or architecture rationale.

### Outputs

- Deprecated status.
- Deprecation reason.
- Replacement guidance.
- Migration notes.
- Deprecation window.
- Updated used-in tracking.
- Archive plan when usage reaches zero.

### Required Documents

- Constitution.
- Source-of-truth page.
- Decision history.
- Used-in tracking.
- Migration notes.

### Required Approvals

- Design system approval for component, pattern, layout, token, or asset deprecation.
- Product approval when product surfaces are affected.
- Engineering approval for migration feasibility.
- Accessibility, content, motion, token, or data approval when affected.
- Vimal Raja approval when deprecation has broad product or governance impact.

### AI Responsibilities

- Check used-in references before recommending deprecation.
- Identify replacement guidance.
- Avoid deleting active product dependencies.
- Record decision history when instructed.
- Report migration risks and ownership gaps.

### Exit Criteria

- Deprecated status is visible.
- New product usage is blocked by rule.
- Existing usage has a migration path.
- Deprecation window is documented.
- Historical record is preserved.

### Validation

- Confirm no new product usage is introduced.
- Confirm replacement guidance exists.
- Confirm migration notes cover affected usage.
- Confirm archive happens only after active usage reaches zero.

### Failure Conditions

- Deprecation lacks replacement guidance.
- Active usage is deleted without migration.
- Used-in tracking is incomplete.
- Product teams cannot identify the approved alternative.

### Escalation Path

Escalate deprecation disputes to design system, engineering, and product owners. Escalate unresolved impact or priority conflicts to Vimal Raja.
