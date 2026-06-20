import { test, expect } from "@playwright/test";

test.describe("Shehnai Indian Restaurant site", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/index.html");
  });

  test("has RTL Arabic html + correct title", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page).toHaveTitle(/شهناي/);
  });

  test("hero headline and signature mandala render", async ({ page }) => {
    await expect(page.locator(".hero h1")).toBeVisible();
    await expect(page.locator(".mandala")).toHaveCount(1);
    await expect(page.locator(".particles")).toHaveCount(1);
  });

  test("cites the real Google rating 4.7", async ({ page }) => {
    await expect(page.locator(".trust")).toContainText("4.7");
    await expect(page.locator(".trust")).toContainText("765");
  });

  test("every img references an existing file with alt", async ({ page }) => {
    const imgs = page.locator("img");
    const n = await imgs.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const img = imgs.nth(i);
      await expect(img).toHaveAttribute("alt", /.+/);
      const natural = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(natural, `image ${i} should load`).toBeGreaterThan(0);
    }
  });

  test("no invented prices — uses 'حسب القائمة'", async ({ page }) => {
    await expect(page.locator("#dishes")).toContainText("حسب القائمة");
    await expect(page.locator("#dishes")).not.toContainText("ريال");
  });

  test("gender-neutral copy — no احجزي/اطلبي/لكِ", async ({ page }) => {
    const body = await page.locator("body").innerText();
    expect(body).not.toContain("احجزي");
    expect(body).not.toContain("اطلبي");
    expect(body).not.toContain("لكِ");
    expect(body).toContain("احجز");
  });

  test("full-screen mobile menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".burger").click();
    const menu = page.locator(".mobile-menu");
    await expect(menu).toHaveClass(/open/);
    const box = await menu.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(380);
    await page.locator(".mm-close").click();
    await expect(menu).not.toHaveClass(/open/);
  });

  test("reservation form builds WhatsApp link + toast", async ({ page, context }) => {
    await page.fill("#name", "محمد العتيبي");
    await page.fill("#phone", "0531234567");
    await page.selectOption("#guests", "3-4");
    await page.fill("#date", "2026-07-01");
    const popupPromise = context.waitForEvent("page").catch(() => null);
    await page.locator(".btn-submit").click();
    await expect(page.locator(".toast")).toHaveClass(/show/, { timeout: 3000 });
    const popup = await popupPromise;
    if (popup) expect(popup.url()).toContain("wa.me/966531914513");
  });

  test("floating FABs present (whatsapp, call, maps)", async ({ page }) => {
    await expect(page.locator(".fab-wa")).toHaveAttribute("href", /wa\.me\/966531914513/);
    await expect(page.locator(".fab-call")).toHaveAttribute("href", /tel:0531914513/);
    await expect(page.locator(".fab-map")).toHaveAttribute("href", /google\.com\/maps/);
  });

  test("no horizontal scroll at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(overflow).toBeFalsy();
  });

  test("JSON-LD Restaurant schema with aggregateRating", async ({ page }) => {
    const ld = await page.locator('script[type="application/ld+json"]').innerText();
    const data = JSON.parse(ld);
    expect(data["@type"]).toBe("Restaurant");
    expect(data.servesCuisine).toBe("Indian");
    expect(data.aggregateRating.ratingValue).toBe("4.7");
    expect(data.aggregateRating.reviewCount).toBe("765");
  });
});
