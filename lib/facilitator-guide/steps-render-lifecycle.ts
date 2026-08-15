export const FACILITATOR_STEPS_BUILD_DURATION_MS = 1280;
export const FACILITATOR_STEPS_ENTRANCE_DELAY_MS = 360;

export function getFacilitatorStepsIdentity(
  activityKey: string | undefined,
  stepIds: string[]
) {
  return activityKey ?? stepIds.join("|");
}

export function getFacilitatorStepsReadyDelay(
  hasPlayedEntranceBuild: boolean,
  prefersReducedMotion: boolean
) {
  if (prefersReducedMotion) {
    return 0;
  }

  return (
    FACILITATOR_STEPS_BUILD_DURATION_MS +
    (hasPlayedEntranceBuild ? 0 : FACILITATOR_STEPS_ENTRANCE_DELAY_MS)
  );
}
