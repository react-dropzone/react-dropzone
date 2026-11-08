import {expect, test} from "@playwright/test";

// Routes that must survive client-side hydration, not merely return 200 HTML.
// A dependency bump can white-screen these while the SSR'd markup still looks
// fine to a plain HTTP probe (e.g. react-dropzone#1512: waku dropped the
// router `unstable_events` API that vocs' ScrollRestoration calls `.on()` on,
// throwing during hydration and blanking the page).
const routes = ["/", "/guide/getting-started", "/examples/basic"];

for (const route of routes) {
  test(`docs page hydrates without errors: ${route}`, async ({page}) => {
    const errors: string[] = [];
    // Uncaught exceptions thrown during hydration — the #1512 failure mode.
    page.on("pageerror", err => errors.push(`pageerror: ${err.message}`));

    await page.goto(route, {waitUntil: "networkidle"});

    // Primary, precise signal: no uncaught exception escaped during hydration.
    expect(errors, `unexpected errors on ${route}:\n${errors.join("\n")}`).toEqual([]);

    // Secondary blank-screen guard: the app unmounts to an empty page when
    // hydration throws, so the main content region must exist and be non-empty.
    const content = page.locator("#vocs-content");
    await expect(content).toBeVisible();
    await expect(content).not.toBeEmpty();
  });
}

test("selected files can be removed and cleared using the keyboard", async ({page}) => {
  await page.goto("/examples/basic", {waitUntil: "networkidle"});
  const example = page.locator("section.container").filter({has: page.getByRole("heading", {name: "Selected files"})});
  const input = example.locator('input[type="file"]');
  const files = [
    {name: "first.txt", mimeType: "text/plain", buffer: Buffer.from("first")},
    {name: "second.txt", mimeType: "text/plain", buffer: Buffer.from("second")}
  ];
  let dialogs = 0;
  page.on("filechooser", () => dialogs++);
  await input.setInputFiles(files);
  await expect(example.getByRole("listitem")).toHaveCount(2);

  const remove = example.getByRole("button", {name: "Remove first.txt"});
  await remove.focus();
  await page.keyboard.press("Enter");
  await expect(example.getByRole("listitem")).toHaveCount(1);
  await expect(example.getByRole("listitem")).toContainText("second.txt");

  const clear = example.getByRole("button", {name: "Clear files"});
  await clear.focus();
  await page.keyboard.press("Enter");
  await expect(example.getByRole("listitem")).toHaveCount(0);
  await expect(clear).toBeDisabled();
  expect(await input.evaluate((element: HTMLInputElement) => element.files?.length)).toBe(0);

  await input.setInputFiles(files);
  await expect(example.getByRole("listitem")).toHaveCount(2);
  expect(dialogs).toBe(0);
});
