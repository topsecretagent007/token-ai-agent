import { expect, test } from "@playwright/test";

test(
  "InputComponent",
  { tag: ["@release", "@workspace"] },
  async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[data-testid="mainpage_title"]', {
      timeout: 30000,
    });

    await page.waitForSelector('[id="new-project-btn"]', {
      timeout: 30000,
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
      timeout: 30000,
    });
    await page.getByTestId("blank-flow").click();
    await page.getByTestId("sidebar-search-input").click();
    await page.getByTestId("sidebar-search-input").fill("Chroma");

    await page.waitForTimeout(1000);

    await page
      .getByTestId("vectorstoresChroma DB")
      .dragTo(page.locator('//*[@id="react-flow-id"]'));
    await page.mouse.up();
    await page.mouse.down();
    await page.waitForSelector('[data-testid="fit_view"]', {
      timeout: 100000,
    });

    await page.getByTestId("fit_view").click();
    await page.getByTestId("zoom_out").click();
    await page.getByTestId("zoom_out").click();
    await page.getByTestId("zoom_out").click();
    await page.getByTestId("popover-anchor-input-collection_name").click();
    await page
      .getByTestId("popover-anchor-input-collection_name")
      .fill("collection_name_test_123123123!@#$&*(&%$@");

    let value = await page
      .getByTestId("popover-anchor-input-collection_name")
      .inputValue();

    if (value != "collection_name_test_123123123!@#$&*(&%$@") {
      expect(false).toBeTruthy();
    }

    await page.getByTestId("div-generic-node").click();

    await page.getByTestId("more-options-modal").click();
    await page.getByTestId("advanced-button-modal").click();

    await page
      .locator('//*[@id="showchroma_server_cors_allow_origins"]')
      .click();
    expect(
      await page
        .locator('//*[@id="showchroma_server_cors_allow_origins"]')
        .isChecked(),
    ).toBeTruthy();

    await page.locator('//*[@id="showchroma_server_grpc_port"]').click();
    expect(
      await page.locator('//*[@id="showchroma_server_grpc_port"]').isChecked(),
    ).toBeTruthy();

    await page.locator('//*[@id="showchroma_server_host"]').click();
    expect(
      await page.locator('//*[@id="showchroma_server_host"]').isChecked(),
    ).toBeTruthy();

    await page.locator('//*[@id="showchroma_server_http_port"]').click();
    expect(
      await page.locator('//*[@id="showchroma_server_http_port"]').isChecked(),
    ).toBeTruthy();

    await page.locator('//*[@id="showchroma_server_ssl_enabled"]').click();
    expect(
      await page
        .locator('//*[@id="showchroma_server_ssl_enabled"]')
        .isChecked(),
    ).toBeTruthy();

    await page
      .locator('//*[@id="showchroma_server_cors_allow_origins"]')
      .click();
    expect(
      await page
        .locator('//*[@id="showchroma_server_cors_allow_origins"]')
        .isChecked(),
    ).toBeFalsy();

    await page.locator('//*[@id="showchroma_server_grpc_port"]').click();
    expect(
      await page.locator('//*[@id="showchroma_server_grpc_port"]').isChecked(),
    ).toBeFalsy();

    await page.locator('//*[@id="showchroma_server_host"]').click();
    expect(
      await page.locator('//*[@id="showchroma_server_host"]').isChecked(),
    ).toBeFalsy();

    await page.locator('//*[@id="showchroma_server_http_port"]').click();
    expect(
      await page.locator('//*[@id="showchroma_server_http_port"]').isChecked(),
    ).toBeFalsy();

    await page.locator('//*[@id="showchroma_server_ssl_enabled"]').click();
    expect(
      await page
        .locator('//*[@id="showchroma_server_ssl_enabled"]')
        .isChecked(),
    ).toBeFalsy();

    let valueEditNode = await page
      .getByTestId("popover-anchor-input-collection_name-edit")
      .inputValue();

    if (valueEditNode != "collection_name_test_123123123!@#$&*(&%$@") {
      expect(false).toBeTruthy();
    }

    await page
      .getByTestId("popover-anchor-input-collection_name-edit")
      .fill("NEW_collection_name_test_123123123!@#$&*(&%$@ÇÇÇÀõe");

    await page.waitForTimeout(1000);
    await page.getByText("Close").last().click();

    const plusButtonLocator = page.getByTestId("input-collection_name");
    const elementCount = await plusButtonLocator?.count();
    if (elementCount === 0) {
      expect(true).toBeTruthy();

      await page.getByTestId("div-generic-node").click();

      await page.getByTestId("more-options-modal").click();
      await page.getByTestId("advanced-button-modal").click();

      await page.getByText("Close").last().click();

      let value = await page
        .getByTestId("popover-anchor-input-collection_name")
        .inputValue();

      if (value != "NEW_collection_name_test_123123123!@#$&*(&%$@ÇÇÇÀõe") {
        expect(false).toBeTruthy();
      }
    }
  },
);
