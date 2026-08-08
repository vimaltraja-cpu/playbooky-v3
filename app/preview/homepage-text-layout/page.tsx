import { HomepageTextLayout } from "@/components/product/HomepageTextLayout";
import { SiteBackgroundWash } from "@/components/ui/SiteBackgroundWash";

type PreviewViewport =
  | "mobile"
  | "tablet-portrait"
  | "tablet-landscape"
  | "desktop"
  | "large-desktop"
  | "xl-desktop";

function getLayoutViewport(viewport?: string) {
  if (viewport === "mobile") {
    return "mobile";
  }

  if (viewport === "tablet-portrait" || viewport === "tablet-landscape") {
    return viewport;
  }

  return "desktop";
}

export default async function HomepageTextLayoutPreviewPage({
  searchParams
}: {
  searchParams?: Promise<{ viewport?: PreviewViewport }>;
}) {
  const params = await searchParams;

  return (
    <>
      <SiteBackgroundWash />
      <HomepageTextLayout viewport={getLayoutViewport(params?.viewport)} />
    </>
  );
}
