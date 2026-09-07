import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

await mkdir("/workspace/screenshots", { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const errors = [];

async function shot(page, name) {
  await page.screenshot({ path: `/workspace/screenshots/${name}`, fullPage: false });
}

function track(page, bag) {
  page.on("pageerror", (e) => bag.push("page:" + String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") bag.push("console:" + m.text());
  });
}

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const mErr = [];
track(mobile, mErr);

await mobile.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await mobile.waitForTimeout(500);
await shot(mobile, "m-01-veil.png");

await mobile.getByRole("button", { name: /part the veil/i }).click();
await mobile.waitForTimeout(500);
await shot(mobile, "m-02-home.png");

const homeText = await mobile.locator("body").innerText();
const hasBing = /\/bing/i.test(homeText);
const hasPicForPic = /pic for pic/i.test(homeText);
const hasPics = /Princess|Knight|Sae|Steven/.test(homeText);
const hasNav = await mobile.getByRole("navigation", { name: /primary/i }).count();

await mobile.getByRole("button", { name: /^\/bing/i }).click();
await mobile.waitForTimeout(400);
await shot(mobile, "m-03-bing.png");

await mobile.getByRole("button", { name: /princess/i }).first().click();
await mobile.waitForTimeout(700);
await shot(mobile, "m-04-bing-reply.png");

await mobile.getByRole("button", { name: /^table$/i }).click();
await mobile.waitForTimeout(400);
await shot(mobile, "m-05-select.png");

await mobile.getByRole("button", { name: /begin the walk/i }).click();
await mobile.waitForTimeout(700);
await shot(mobile, "m-06-table.png");

const rollVisible = await mobile.getByRole("button", { name: /roll the die/i }).isVisible();
const overflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
);

await mobile.getByRole("button", { name: /roll the die/i }).click();
await mobile.waitForTimeout(2800);
await shot(mobile, "m-07-rolled.png");

await mobile.getByRole("button", { name: /^listen$/i }).click();
await mobile.waitForTimeout(800);
await shot(mobile, "m-08-listen.png");

await mobile.getByRole("button", { name: /walk the room/i }).click();
await mobile.waitForTimeout(300);
await shot(mobile, "m-09-listen-walk.png");

await mobile.getByRole("button", { name: /^fold$/i }).click();
await mobile.waitForTimeout(400);
await shot(mobile, "m-10-fold.png");

await mobile.getByRole("button", { name: /pic for pic/i }).click();
await mobile.waitForTimeout(400);
await shot(mobile, "m-11-nav-pic.png");

const desk = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const dErr = [];
track(desk, dErr);
await desk.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await desk.waitForTimeout(400);
await desk.getByRole("button", { name: /part the veil/i }).click();
await desk.waitForTimeout(400);
await shot(desk, "d-01-home.png");
await desk.getByRole("button", { name: /sit at the table/i }).click();
await desk.waitForTimeout(400);
await shot(desk, "d-02-select.png");

console.log(
  JSON.stringify(
    {
      hasBing,
      hasPicForPic,
      hasPics,
      hasNav: hasNav > 0,
      rollVisible,
      overflow,
      mobileErrors: mErr,
      desktopErrors: dErr,
    },
    null,
    2,
  ),
);

await browser.close();
