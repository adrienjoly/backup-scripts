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

  const xRequest = await new Promise((resolve) => {
    page.on("request", (interceptedRequest) => {
      console.warn(`intercepted ${interceptedRequest.method()} ${interceptedRequest.url()}`)
      interceptedRequest.abort();
      resolve(interceptedRequest);
    });
  });

  const options = {
    encoding: null,
    headers: xRequest.headers,
  };

  /* add the cookies */
  const cookies = await page.cookies();
  options.headers.Cookie = cookies
    .map((ck) => ck.name + "=" + ck.value)
    .join(";");

  console.warn(xRequest.url(), options)

  /* resend the request */
  const response = await fetch(xRequest.url(), options);
  console.warn({body: await response.body }) // => ReadableStream { locked: false, state: 'readable', supportsBYOB: false }

  // const body = await response.arrayBuffer()
  const blob = await response.blob()
  console.warn({blob}) // => Blob { size: 50654, type: 'application/zip; charset=utf-8' } }
  const body = await blob.stream()
  console.warn({body}) // => ReadableStream { locked: false, state: 'readable', supportsBYOB: false }
  const buffer = await blob.arrayBuffer()
  console.warn({buffer})
  process.stdout.write(Buffer.from(buffer));
  // fs.writeFileSync("coucou.zip", buffer)
  

  // await new Promise((resolve, reject) => {
  //   body.pipeTo(process.stdout.writable);
  //   body.on("error", reject);
  //   process.stdout.fileStream.on("finish", resolve);
  // });


  // process.stdout.write(Buffer.from(base64String, 'base64').toString('utf8'), 'utf-8');
  // console.warn({size})
  // fs.writeFileSync("coucou.zip", text, "utf-8")
  // process.stdout.write(text, "utf-8");

  // console.warn("waiting...");
  // await page.waitForTimeout(5000); // wait for 5 seconds

  // await page.screenshot({path: 'example4.png'});
  console.warn("closing");
  await browser.close();
})();
