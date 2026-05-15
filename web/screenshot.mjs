import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const routes = [
  { path: "/onboarding", file: "01-onboarding.png" },
  { path: "/", file: "02-home.png" },
  { path: "/meals", file: "03-meals.png" },
  { path: "/meals/breakfast", file: "04-meal-detail.png" },
  { path: "/workout", file: "05-workout.png" },
  { path: "/sleep", file: "06-sleep.png" },
  { path: "/reminders", file: "07-reminders.png" },
  { path: "/profile", file: "08-profile.png" },
];

await mkdir("screenshots", { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 440, height: 920 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

for (const r of routes) {
  await page.goto(`http://127.0.0.1:3100${r.path}`, { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: `
      nav.fixed { position: static !important; transform: none !important; left: auto !important; width: 100% !important; max-width: 440px !important; margin: 16px auto 0 !important; }
      body main { padding-bottom: 0 !important; }
    `,
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `screenshots/${r.file}`, fullPage: true });
  console.log("captured", r.file);
}

await browser.close();
