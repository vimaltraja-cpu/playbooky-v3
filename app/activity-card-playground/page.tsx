import {
  ActivityCard,
  type ActivityCardData
} from "@/components/ui/ActivityCard";

const approvalActivity: ActivityCardData = {
  description:
    "Map the customer’s journey from beginning to end to uncover opportunities.",
  duration: "15 minutes",
  illustration: "/assets/activities/Problem Framing.png",
  title: "Problem Framing",
  workshopType: "Journey Mapping Workshop"
};

export default function ActivityCardPlaygroundPage() {
  return (
    <main className="min-h-screen bg-[#F4F4F2] px-6 py-10 text-[#171614]">
      <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-10">
        <h1 className="font-sans text-sm font-medium tracking-normal text-[#4B4A46]">
          Activity Card Playground
        </h1>

        <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:items-start md:gap-12">
          <section
            aria-labelledby="activity-card-builder-heading"
            className="flex flex-col items-center gap-4"
          >
            <h2
              className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-[#6D6B66]"
              id="activity-card-builder-heading"
            >
              Builder
            </h2>
            <ActivityCard activity={approvalActivity} variant="builder" />
          </section>

          <section
            aria-labelledby="activity-card-library-heading"
            className="flex flex-col items-center gap-4"
          >
            <h2
              className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-[#6D6B66]"
              id="activity-card-library-heading"
            >
              Library
            </h2>
            <ActivityCard activity={approvalActivity} variant="library" />
          </section>
        </div>
      </div>
    </main>
  );
}
