const puppeteer = require("puppeteer");

const { DEBUG } = process.env; // for verbose logs, pass DEBUG='*'

const [, , HACKMD_EMAIL, HACKMD_PWD] = process.argv;

const interceptRequests = async (page) => {
  await page.setRequestInterception(true);
  return {
    untilRequest: (targetURL) =>
      new Promise((resolve) => {
        const handler = (req) => {
          if (req.url() === targetURL) {
            req.abort();
            page.off("request", handler);
            page.setRequestInterception(false).then(() => resolve(req));
          } else {
            req.continue();
          }
        };
        page.on("request", handler);
      }),
  };
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // login
  if (DEBUG) console.warn(`connecting to hackmd.io...`);
  await page.goto("https://hackmd.io/login", { waitUntil: "networkidle2" });
  if (DEBUG) console.warn(`logging in to hackmd.io...`);
  await page.type("input[type=email]", HACKMD_EMAIL);
  await page.type("input[type=password]", HACKMD_PWD);
  if (DEBUG) await page.screenshot({ path: "login-scren.png" });
  if (DEBUG) console.warn(`submitting credentials...`);
  const intercept = await interceptRequests(page);
  await page.click("input[type=submit]");
  const interceptedRequest = await intercept.untilRequest(
    "https://hackmd.io/me"
  );

  // request the backup
  if (DEBUG) console.warn(`requesting notes...`);
  const cookies = await page.cookies();
  const response = await fetch("https://hackmd.io/exportAllNotes", {
    encoding: null,
    headers: {
      ...interceptedRequest.headers,
      Cookie: cookies.map((ck) => ck.name + "=" + ck.value).join(";"),
    },
  });

  // download the backup
  if (DEBUG) console.warn(`downloading notes...`);
  const blob = await response.blob();
  console.warn(`downloading ${blob.size} bytes, type: ${blob.type}...`);
  process.stdout.write(Buffer.from(await blob.arrayBuffer()));
  await browser.close();
})();
