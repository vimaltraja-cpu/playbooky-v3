import type { DiagnosisIconKey } from "@/lib/design-system/diagnosis-icons";

export type DiagnosisQuestionId =
  "goals" | "challenges" | "context" | "participants" | "outcome";

export type DiagnosisOption = {
  description: string;
  iconKey: DiagnosisIconKey;
  id: string;
  label: string;
};

export type DiagnosisQuestion = {
  id: DiagnosisQuestionId;
  label: string;
  options: DiagnosisOption[];
};

export const diagnosisQuestions: DiagnosisQuestion[] = [
  {
    id: "goals",
    label: "Goals",
    options: [
      {
        description:
          "Bring people into alignment around a shared goal or direction.",
        iconKey: "align-a-team",
        id: "align-a-team",
        label: "Align a team"
      },
      {
        description:
          "Build a clearer picture of the problem before deciding what to do.",
        iconKey: "understand-a-problem",
        id: "understand-a-problem",
        label: "Understand a problem"
      },
      {
        description:
          "Help the group compare options and commit to a direction.",
        iconKey: "make-decisions",
        id: "make-decisions",
        label: "Make decisions"
      },
      {
        description:
          "Generate fresh possibilities, concepts, or opportunity areas.",
        iconKey: "new-ideas",
        id: "new-ideas",
        label: "Generate new ideas"
      },
      {
        description:
          "Turn a chosen direction into clear next steps and ownership.",
        iconKey: "create-an-action-plan",
        id: "create-an-action-plan",
        label: "Create an action plan"
      },
      {
        description:
          "Explore the situation and decide which workshop goal fits best.",
        iconKey: "not-sure",
        id: "not-sure",
        label: "Not sure yet"
      }
    ]
  },
  {
    id: "challenges",
    label: "Challenges",
    options: [
      {
        description:
          "People are pulling in different directions or interpreting priorities differently.",
        iconKey: "alignment-issues",
        id: "alignment-issues",
        label: "Alignment issues"
      },
      {
        description:
          "The team has too many competing priorities and needs sharper focus.",
        iconKey: "unclear-priorities",
        id: "unclear-priorities",
        label: "Unclear priorities"
      },
      {
        description:
          "There are too many possible directions and the group needs to narrow them down.",
        iconKey: "too-many-ideas",
        id: "too-many-ideas",
        label: "Too many ideas"
      },
      {
        description:
          "Important choices are taking too long or circling without resolution.",
        iconKey: "slow-decision-making",
        id: "slow-decision-making",
        label: "Slow decision making"
      },
      {
        description:
          "Next steps are unclear because ownership and accountability are not settled.",
        iconKey: "lack-of-ownership",
        id: "lack-of-ownership",
        label: "Lack of ownership"
      },
      {
        description:
          "The team needs to understand what is affecting delivery, quality, or momentum.",
        iconKey: "performance-issues",
        id: "performance-issues",
        label: "Performance issues"
      }
    ]
  },
  {
    id: "context",
    label: "Context",
    options: [
      {
        description:
          "A new team, project, or initiative needs shared direction from the start.",
        iconKey: "new-team-or-initiative",
        id: "new-team-or-initiative",
        label: "New team or initiative"
      },
      {
        description:
          "The organisation is growing and needs clearer ways to coordinate work.",
        iconKey: "scaling-or-growth",
        id: "scaling-or-growth",
        label: "Scaling or growth"
      },
      {
        description:
          "The group is navigating a shift in strategy, structure, product, or process.",
        iconKey: "change-or-transition",
        id: "change-or-transition",
        label: "Change or transition"
      },
      {
        description:
          "Teams need to work across boundaries with better shared understanding.",
        iconKey: "cross-functional-collaboration",
        id: "cross-functional-collaboration",
        label: "Cross-functional collaboration"
      },
      {
        description:
          "The work needs stronger agreement on what matters most right now.",
        iconKey: "focus-priorities",
        id: "focus-priorities",
        label: "Focus priorities"
      },
      {
        description:
          "There is useful context, but the best workshop frame still needs to emerge.",
        iconKey: "not-sure-1",
        id: "context-not-sure",
        label: "Not sure"
      }
    ]
  },
  {
    id: "participants",
    label: "Participants",
    options: [
      {
        description:
          "The people closest to the work need to align, decide, or plan together.",
        iconKey: "core-team-members",
        id: "core-team-members",
        label: "Core team members"
      },
      {
        description:
          "Team leads need a shared view of priorities, decisions, and next steps.",
        iconKey: "team-leads-or-managers",
        id: "team-leads-or-managers",
        label: "Team leads or managers"
      },
      {
        description:
          "Senior stakeholders need to align around direction, trade-offs, or commitment.",
        iconKey: "executives-or-sponsors",
        id: "executives-or-sponsors",
        label: "Executives or sponsors"
      },
      {
        description:
          "Users or customers should contribute evidence, feedback, or lived experience.",
        iconKey: "customers-or-users",
        id: "customers-or-users",
        label: "Customers or users"
      },
      {
        description:
          "Other teams need to be involved because the work crosses ownership boundaries.",
        iconKey: "other-departments",
        id: "other-departments",
        label: "Other departments"
      },
      {
        description:
          "The right group is not yet clear and should be shaped during diagnosis.",
        iconKey: "not-sure-2",
        id: "participants-not-sure",
        label: "Not sure"
      }
    ]
  },
  {
    id: "outcome",
    label: "Outcome",
    options: [
      {
        description:
          "Everyone leaves with a shared understanding of the goal, problem, or direction.",
        iconKey: "clear-alignment",
        id: "clear-alignment",
        label: "Clear alignment"
      },
      {
        description:
          "The group leaves with stronger choices and clearer trade-offs.",
        iconKey: "better-decisions",
        id: "better-decisions",
        label: "Better decisions"
      },
      {
        description:
          "The session produces practical actions, owners, and next steps.",
        iconKey: "actionable-plan",
        id: "actionable-plan",
        label: "Actionable plan"
      },
      {
        description:
          "Participants build trust, shared ownership, and healthier ways of working.",
        iconKey: "stronger-collaboration",
        id: "stronger-collaboration",
        label: "Stronger collaboration"
      },
      {
        description:
          "The team leaves knowing which priorities matter most and why.",
        iconKey: "focus-priorities",
        id: "outcome-focus-priorities",
        label: "Focused priorities"
      },
      {
        description:
          "The workshop should reveal the right outcome as the group makes sense of the challenge.",
        iconKey: "not-sure-yet",
        id: "outcome-not-sure-yet",
        label: "Not sure yet"
      }
    ]
  }
];

export const diagnosisQuestionTabs = diagnosisQuestions.map(
  ({ id, label }) => ({
    id,
    label
  })
);

export const diagnosisGridPreviewOptions = diagnosisQuestions[0].options;
