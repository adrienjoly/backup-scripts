const fs = require("fs");
const https = require("https");
const { BlockList } = require("net");
const puppeteer = require("puppeteer");

const [, , HACKMD_EMAIL, HACKMD_PWD] = process.argv;

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("https://hackmd.io/login", { waitUntil: "networkidle2" });
  await page.type("input[type=email]", HACKMD_EMAIL);
  await page.type("input[type=password]", HACKMD_PWD);
  //  await page.screenshot({path: 'example.png'});
  await page.click("input[type=submit]");
  //   await page.waitForTimeout(5000); // wait for 5 seconds
  const frame = await new Promise((resolve) =>
    page.on("framenavigated", (frame) => {
      const url = frame.url();
      console.warn(`navigated to ${url}`);
      if (url === "https://hackmd.io/?nav=overview") resolve(frame);
    })
  );
  // await page.screenshot({path: 'example2.png'});
  // await page.goto('https://hackmd.io/settings#note', { waitUntil: 'networkidle2' });
  // await page.screenshot({ path: "example3.png" });

  let fn = async (uri) => {
    const res = await fetch(uri, { credentials: "same-origin" });
    const blob = await res.blob();
    // const bufferArray = await blob.arrayBuffer();
    return {
      size: blob.size,
      text: await blob.text(),
      // base64String: btoa([].reduce.call(new Uint8Array(bufferArray),function(p,c){return p+String.fromCharCode(c)},'')),
    };
  };

  // await page.goto('https://hackmd.io/exportAllNotes', { waitUntil: 'networkidle2' });
  // const { size, text, base64String } = await page.evaluate(fn, 'https://hackmd.io/exportAllNotes')

  browser.on("targetcreated", async (target) => {
    let s = target.url();
    console.warn("targetcreated", s);
    // //the test opens an about:blank to start - ignore this
    // if (s == 'about:blank') {
    //     return;
    // }
    // //unencode the characters after removing the content type
    // s = s.replace("data:text/csv;charset=utf-8,", "");
    // //clean up string by unencoding the %xx
    // ...
    // fs.writeFile("/tmp/download.csv", s, function(err) {
    //     if(err) {
    //         console.log(err);
    //         return;
    //     }
    //     console.log("The file was saved!");
    // });
  });

  // page.on('response', async function pageOnResponseRequest(response) {
  //   // if (response.frame() === page.mainFrame() && response.request().isNavigationRequest()) {
  //     const statusCode = response.status();
  //     const headers = response.headers();
  //     console.warn('onresponse', { url: response.url(), isNavigReq: response.request().isNavigationRequest(), statusCode, headers})

  //     if (response.url() !== "https://hackmd.io/exportAllNotes") return;

  //     try {
  //       // console.warn("response", await response.text())
  //       fs.writeFileSync('coucou.zip', await response.buffer())
  //       // At this point you have access to status code and headers which you can use to detect that it's an html document, an image, a downloadable document, etc...
  //       console.warn("done saveing coucou.zip")
  //     } catch (err) {
  //       console.warn(err)
  //     }
  //   // }
  // });

  console.warn("waiting...");
  await page.waitForTimeout(5000); // wait for 5 seconds

  await page.setRequestInterception(true);

  /*const response = await*/ page
    .goto("https://hackmd.io/exportAllNotes")
    .catch((e) => console.warn("skipped error", e.message));
  // await fs.writeFileSync('coucou.zip', await response.buffer())

  const xRequest = await new Promise((resolve) => {
    page.on("request", (interceptedRequest) => {
      console.warn(
        "intercepted",
        interceptedRequest.method(),
        interceptedRequest.url()
      );
      interceptedRequest.abort(); //stop intercepting requests
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
