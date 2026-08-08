const { chromium } = require("playwright");

(async () => {
  const url = process.argv[2] || "http://localhost:3411/preview/recommendation-reveal-to-grid";
  const browser = await chromium.launch();

  async function shot(width, height, label) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `/tmp/shot-${label}-before.png` });

    const continueBtn = page.getByRole("button", { name: "Continue" });
    if (await continueBtn.count()) {
      await continueBtn.click();
      await page.waitForTimeout(2200);
      await page.screenshot({ path: `/tmp/shot-${label}-after.png` });
    } else {
      console.log(`[${label}] no Continue button found`);
    }

    await page.close();
  }

  await shot(1440, 900, "desktop");
  await shot(390, 844, "mobile");

  await browser.close();
  console.log("done");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
