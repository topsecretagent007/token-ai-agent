import { expect, test } from "@playwright/test";

test(
  "user should be able to manually save a flow when the auto_save is off",
  { tag: ["@release", "@api", "@database"] },
  async ({ page }) => {
    await page.route("**/api/v1/config", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          auto_saving: false,
          frontend_timeout: 0,
        }),
        headers: {
          "content-type": "application/json",
          ...route.request().headers(),
        },
      });
    });

    await page.goto("/");
    await page.locator("span").filter({ hasText: "My Collection" }).isVisible();

    await page.waitForSelector('[data-testid="mainpage_title"]', {
      timeout: 5000,
    });

    await page.waitForSelector('[id="new-project-btn"]', {
      timeout: 5000,
    });

    let modalCount = 0;
    try {
      const modalTitleElement = await page?.getByTestId("modal-title");
      if (modalTitleElement) {
        modalCount = await modalTitleElement.count();
      }
    } catch (error) {
      modalCount = 0;
    }

    while (modalCount === 0) {
      await page.getByText("New Flow", { exact: true }).click();
      await page.waitForTimeout(3000);
      modalCount = await page.getByTestId("modal-title")?.count();
    }

    await page.waitForSelector('[data-testid="blank-flow"]', {
      timeout: 5000,
    });

    await page.getByTestId("blank-flow").click();

    await page.getByTestId("sidebar-search-input").click();
    await page.getByTestId("sidebar-search-input").fill("NVIDIA");

    await page.waitForTimeout(1000);

    await page
      .getByTestId("modelsNVIDIA")
      .dragTo(page.locator('//*[@id="react-flow-id"]'));
    await page.mouse.up();
    await page.mouse.down();

    await page.waitForSelector('[data-testid="fit_view"]', {
      timeout: 5000,
    });

    await page.getByTestId("fit_view").click();

    expect(await page.getByText("Saved").isVisible()).toBeTruthy();

    await page
      .getByText("Saved")
      .first()
      .hover()
      .then(async () => {
        await page.waitForTimeout(1000);
        await page.getByText("Auto-saving is disabled").nth(0).isVisible();
        await page
          .getByText("Enable auto-saving to avoid losing progress.")
          .nth(0)
          .isVisible();
      });

    expect(await page.getByTestId("save-flow-button").isEnabled()).toBeTruthy();

    await page.waitForSelector("text=loading", {
      state: "hidden",
      timeout: 5000,
    });

    await page.getByTestId("icon-ChevronLeft").last().click();

    expect(
      await page
        .getByText("Unsaved changes will be permanently lost.")
        .isVisible(),
    ).toBeTruthy();

    await page.getByText("Exit Anyway", { exact: true }).click();

    await page.getByText("Untitled document").first().click();

    await page.waitForSelector('[data-testid="icon-ChevronLeft"]', {
      timeout: 5000,
    });

    expect(await page.getByText("NVIDIA").isVisible()).toBeFalsy();

    await page.getByTestId("sidebar-search-input").click();
    await page.getByTestId("sidebar-search-input").fill("NVIDIA");

    await page.waitForTimeout(1000);

    await page
      .getByTestId("modelsNVIDIA")
      .dragTo(page.locator('//*[@id="react-flow-id"]'));
    await page.mouse.up();
    await page.mouse.down();

    await page.waitForSelector('[data-testid="fit_view"]', {
      timeout: 5000,
    });

    await page.getByTestId("fit_view").click();

    await page.getByTestId("icon-ChevronLeft").last().click();

    await page.getByText("Save And Exit", { exact: true }).click();

    await page.getByText("Untitled document").first().click();

    await page.waitForSelector("text=loading", {
      state: "hidden",
      timeout: 5000,
    });

    await page.waitForTimeout(5000);

    expect(await page.getByTestId("title-NVIDIA").isVisible()).toBeTruthy();

    await page.getByTestId("sidebar-search-input").click();
    await page.getByTestId("sidebar-search-input").fill("NVIDIA");

    await page.waitForTimeout(1000);

    await page
      .getByTestId("modelsNVIDIA")
      .dragTo(page.locator('//*[@id="react-flow-id"]'));
    await page.mouse.up();
    await page.mouse.down();

    await page.waitForSelector('[data-testid="fit_view"]', {
      timeout: 5000,
    });

    await page.getByTestId("fit_view").click();

    await page.getByTestId("save-flow-button").click();
    await page.getByTestId("icon-ChevronLeft").last().click();

    const replaceButton = await page.getByTestId("replace-button").isVisible();

    if (replaceButton) {
      await page.getByTestId("replace-button").click();
    }

    const saveExitButton = await page
      .getByText("Save And Exit", { exact: true })
      .last()
      .isVisible();

    if (saveExitButton) {
      await page.getByText("Save And Exit", { exact: true }).last().click();
    }

    await page.getByText("Untitled document").first().click();

    await page.waitForSelector('[data-testid="icon-ChevronLeft"]', {
      timeout: 5000,
    });

    await page.waitForTimeout(5000);

    const nvidiaNumber = await page.getByTestId("title-NVIDIA").count();
    expect(nvidiaNumber).toBe(2);
  },
);
