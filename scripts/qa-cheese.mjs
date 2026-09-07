import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push("page:" + String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console:" + m.text());
});

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.screenshot({ path: "/workspace/screenshots/01-title.png", fullPage: true });

await page.getByRole("button", { name: /sit at the table/i }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: "/workspace/screenshots/02-select.png", fullPage: true });

await page.getByRole("button", { name: /begin the walk/i }).click();
await page.waitForTimeout(800);
const text = await page.locator("body").innerText();
console.log("AFTER_BEGIN_SNIP", text.slice(0, 400).replace(/\n/g, " | "));
await page.screenshot({ path: "/workspace/screenshots/03-table.png", fullPage: true });

const roll = page.getByRole("button", { name: /roll the die/i });
console.log("ROLL_VISIBLE", await roll.count());
if (await roll.count()) {
  await roll.click();
  await page.waitForTimeout(3200);
}
await page.screenshot({ path: "/workspace/screenshots/04-rolled.png", fullPage: true });

if (await page.getByRole("button", { name: /leave table/i }).count()) {
  await page.getByRole("button", { name: /leave table/i }).click();
  await page.waitForTimeout(300);
}
await page.getByRole("button", { name: /listen at the wall/i }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/workspace/screenshots/05-listen.png", fullPage: true });
const listenBtn = page.getByRole("button", { name: /^listen$/i });
if (await listenBtn.count()) await listenBtn.click();
await page.waitForTimeout(300);
await page.screenshot({ path: "/workspace/screenshots/06-listen-wall.png", fullPage: true });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mErr = [];
mobile.on("pageerror", (e) => mErr.push(String(e)));
await mobile.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await mobile.waitForTimeout(400);
await mobile.screenshot({ path: "/workspace/screenshots/07-mobile-title.png", fullPage: true });
await mobile.getByRole("button", { name: /sit at the table/i }).click();
await mobile.waitForTimeout(300);
await mobile.getByRole("button", { name: /begin the walk/i }).click();
await mobile.waitForTimeout(600);
await mobile.screenshot({ path: "/workspace/screenshots/08-mobile-table.png", fullPage: true });
const overflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
);

console.log(JSON.stringify({ desktopErrors: errors, mobileErrors: mErr, mobileOverflow: overflow }, null, 2));
await browser.close();
