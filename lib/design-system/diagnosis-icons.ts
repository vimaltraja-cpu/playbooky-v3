import { createElement } from "react";
import type { ComponentProps, CSSProperties, ReactElement } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

import actionablePlanIcon from "@/assets/icons/actionable-plan.svg";
import alignATeamIcon from "@/assets/icons/align-a-team.svg";
import alignmentIssuesIcon from "@/assets/icons/alignment-issues.svg";
import betterDecisionsIcon from "@/assets/icons/better-decisions.svg";
import changeOrTransitionIcon from "@/assets/icons/change-or-transition.svg";
import clearAlignmentIcon from "@/assets/icons/clear-alignment.svg";
import coreTeamMembersIcon from "@/assets/icons/core-team-members.svg";
import createAnActionPlanIcon from "@/assets/icons/create-an-action-plan.svg";
import crossFunctionalCollaborationIcon from "@/assets/icons/cross-functional-collaboration.svg";
import customersOrUsersIcon from "@/assets/icons/customers-or-users.svg";
import executivesOrSponsorsIcon from "@/assets/icons/executives-or-sponsors.svg";
import focusPrioritiesIcon from "@/assets/icons/focus-priorities.svg";
import lackOfOwnershipIcon from "@/assets/icons/lack-of-ownership.svg";
import makeDecisionsIcon from "@/assets/icons/make-decisions.svg";
import newIdeasIcon from "@/assets/icons/new-ideas.svg";
import newTeamOrInitiativeIcon from "@/assets/icons/new-team-or-initiative.svg";
import notSureIcon from "@/assets/icons/not-sure.svg";
import notSure1Icon from "@/assets/icons/not-sure-1.svg";
import notSure2Icon from "@/assets/icons/not-sure-2.svg";
import notSureYetIcon from "@/assets/icons/not-sure-yet.svg";
import notSureYet1Icon from "@/assets/icons/not-sure-yet-1.svg";
import otherDepartmentsIcon from "@/assets/icons/other-departments.svg";
import performanceIssuesIcon from "@/assets/icons/performance-issues.svg";
import scalingOrGrowthIcon from "@/assets/icons/scaling-or-growth.svg";
import slowDecisionMakingIcon from "@/assets/icons/slow-decision-making.svg";
import strongerCollaborationIcon from "@/assets/icons/stronger-collaboration.svg";
import teamLeadsOrManagersIcon from "@/assets/icons/team-leads-or-managers.svg";
import tooManyIdeasIcon from "@/assets/icons/too-many-ideas.svg";
import unclearPrioritiesIcon from "@/assets/icons/unclear-priorities.svg";
import understandAProblemIcon from "@/assets/icons/understand-a-problem.svg";

type IconAsset = string | StaticImageData;

export type DiagnosisIconProps = Omit<
  ComponentProps<typeof Image>,
  "alt" | "src"
> & {
  alt?: string;
};

export type DiagnosisIconComponent = (
  props: DiagnosisIconProps
) => ReactElement;

function createDiagnosisIcon(
  icon: IconAsset,
  defaultWidth = 72,
  defaultHeight = 70
): DiagnosisIconComponent {
  function DiagnosisIcon({
    alt = "",
    height = defaultHeight,
    style,
    width = defaultWidth,
    ...props
  }: DiagnosisIconProps) {
    const mergedStyle: CSSProperties = {
      display: "block",
      flex: "0 0 auto",
      height,
      objectFit: "contain",
      width,
      ...style
    };

    return createElement(Image, {
      ...props,
      alt,
      decoding: props.decoding ?? "async",
      height,
      priority: props.priority ?? false,
      src: icon,
      style: mergedStyle,
      unoptimized: props.unoptimized ?? true,
      width
    });
  }

  return DiagnosisIcon;
}

export const ActionablePlanIcon = createDiagnosisIcon(actionablePlanIcon);
export const AlignATeamIcon = createDiagnosisIcon(alignATeamIcon);
export const AlignmentIssuesIcon = createDiagnosisIcon(alignmentIssuesIcon);
export const BetterDecisionsIcon = createDiagnosisIcon(betterDecisionsIcon);
export const ChangeOrTransitionIcon = createDiagnosisIcon(
  changeOrTransitionIcon
);
export const ClearAlignmentIcon = createDiagnosisIcon(clearAlignmentIcon);
export const CoreTeamMembersIcon = createDiagnosisIcon(coreTeamMembersIcon);
export const CreateAnActionPlanIcon = createDiagnosisIcon(
  createAnActionPlanIcon
);
export const CrossFunctionalCollaborationIcon = createDiagnosisIcon(
  crossFunctionalCollaborationIcon
);
export const CustomersOrUsersIcon = createDiagnosisIcon(customersOrUsersIcon);
export const ExecutivesOrSponsorsIcon = createDiagnosisIcon(
  executivesOrSponsorsIcon
);
export const FocusPrioritiesIcon = createDiagnosisIcon(focusPrioritiesIcon);
export const LackOfOwnershipIcon = createDiagnosisIcon(lackOfOwnershipIcon);
export const MakeDecisionsIcon = createDiagnosisIcon(makeDecisionsIcon);
export const NewIdeasIcon = createDiagnosisIcon(newIdeasIcon);
export const NewTeamOrInitiativeIcon = createDiagnosisIcon(
  newTeamOrInitiativeIcon
);
export const NotSureIcon = createDiagnosisIcon(notSureIcon);
export const NotSure1Icon = createDiagnosisIcon(notSure1Icon);
export const NotSure2Icon = createDiagnosisIcon(notSure2Icon);
export const NotSureYetIcon = createDiagnosisIcon(notSureYetIcon);
export const NotSureYet1Icon = createDiagnosisIcon(notSureYet1Icon);
export const OtherDepartmentsIcon = createDiagnosisIcon(otherDepartmentsIcon);
export const PerformanceIssuesIcon = createDiagnosisIcon(performanceIssuesIcon);
export const ScalingOrGrowthIcon = createDiagnosisIcon(scalingOrGrowthIcon);
export const SlowDecisionMakingIcon = createDiagnosisIcon(
  slowDecisionMakingIcon
);
export const StrongerCollaborationIcon = createDiagnosisIcon(
  strongerCollaborationIcon
);
export const TeamLeadsOrManagersIcon = createDiagnosisIcon(
  teamLeadsOrManagersIcon
);
export const TooManyIdeasIcon = createDiagnosisIcon(tooManyIdeasIcon);
export const UnclearPrioritiesIcon = createDiagnosisIcon(unclearPrioritiesIcon);
export const UnderstandAProblemIcon = createDiagnosisIcon(
  understandAProblemIcon
);

export const diagnosisIcons = {
  "actionable-plan": ActionablePlanIcon,
  "align-a-team": AlignATeamIcon,
  "alignment-issues": AlignmentIssuesIcon,
  "better-decisions": BetterDecisionsIcon,
  "change-or-transition": ChangeOrTransitionIcon,
  "clear-alignment": ClearAlignmentIcon,
  "core-team-members": CoreTeamMembersIcon,
  "create-an-action-plan": CreateAnActionPlanIcon,
  "cross-functional-collaboration": CrossFunctionalCollaborationIcon,
  "customers-or-users": CustomersOrUsersIcon,
  "executives-or-sponsors": ExecutivesOrSponsorsIcon,
  "focus-priorities": FocusPrioritiesIcon,
  "lack-of-ownership": LackOfOwnershipIcon,
  "make-decisions": MakeDecisionsIcon,
  "new-ideas": NewIdeasIcon,
  "new-team-or-initiative": NewTeamOrInitiativeIcon,
  "not-sure": NotSureIcon,
  "not-sure-1": NotSure1Icon,
  "not-sure-2": NotSure2Icon,
  "not-sure-yet": NotSureYetIcon,
  "not-sure-yet-1": NotSureYet1Icon,
  "other-departments": OtherDepartmentsIcon,
  "performance-issues": PerformanceIssuesIcon,
  "scaling-or-growth": ScalingOrGrowthIcon,
  "slow-decision-making": SlowDecisionMakingIcon,
  "stronger-collaboration": StrongerCollaborationIcon,
  "team-leads-or-managers": TeamLeadsOrManagersIcon,
  "too-many-ideas": TooManyIdeasIcon,
  "unclear-priorities": UnclearPrioritiesIcon,
  "understand-a-problem": UnderstandAProblemIcon
} as const satisfies Record<string, DiagnosisIconComponent>;

export type DiagnosisIconKey = keyof typeof diagnosisIcons;

export const diagnosisIconKeys = Object.keys(
  diagnosisIcons
) as DiagnosisIconKey[];

export function getDiagnosisIcon(iconKey: DiagnosisIconKey) {
  return diagnosisIcons[iconKey];
}
