const puppeteer = require("puppeteer");

const DEBUG = false

const [, , HACKMD_EMAIL, HACKMD_PWD] = process.argv;

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("https://hackmd.io/login", { waitUntil: "networkidle2" });
  await page.type("input[type=email]", HACKMD_EMAIL);
  await page.type("input[type=password]", HACKMD_PWD);
  if (DEBUG) await page.screenshot({path: 'login-scren.png'});
  await page.click("input[type=submit]");

  await new Promise((resolve) =>
    page.on("framenavigated", (frame) => {
      const url = frame.url();
      console.warn(`navigated to ${url}`);
      if (url === "https://hackmd.io/?nav=overview") resolve(frame);
    })
  );

  console.warn("waiting...");
  await page.waitForTimeout(5000); // wait for 5 seconds

  await page.setRequestInterception(true);

  page
    .goto("https://hackmd.io/exportAllNotes")
    .catch((e) => console.warn("(i) ignored error:", e.message));

  const interceptedRequest = await new Promise((resolve) => {
    page.on("request", (req) => {
      console.warn(`intercepted ${req.method()} ${req.url()}`)
      req.abort();
      resolve(req);
    });
  });

  const cookies = await page.cookies();
  const options = {
    encoding: null,
    headers: {
      ...interceptedRequest.headers,
      "Cookie": cookies.map((ck) => ck.name + "=" + ck.value).join(";"),
    },
  };

  // resend the request
  const response = await fetch(interceptedRequest.url(), options);
  const blob = await response.blob()
  console.warn(`downloading ${blob.size} bytes, type: ${blob.type}...`)
  process.stdout.write(Buffer.from(await blob.arrayBuffer()));
  await browser.close();
})();
