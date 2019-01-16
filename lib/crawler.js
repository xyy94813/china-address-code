const puppeteer = require("puppeteer-core");

async function crawler({ chromePath, dataWebSite }) {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: chromePath
  });
  const page = await browser.newPage();
  await page.goto(dataWebSite);
  await page.waitForSelector(".article", {
    visible: true,
    timeout: 0
  });
  const latestDataUrl = await page.$eval(
    "table.article tbody tr:nth-child(2) td:nth-child(2) a",
    ele => ele.href
  );
  await page.goto(`${latestDataUrl}`);

  await page.waitForSelector("table", {
    visible: true,
    timeout: 0
  });
  const allOriginData = await page.$eval("table tbody", ele =>
    [...ele.children]
      .filter((item, index) => index > 2 && index < ele.children.length - 9) // tbody has title and footer !!!!!!
      .map(item => {
        const [uselessEle, codeEle, nameEle] = item.children;
        const code = codeEle.textContent;
        const name = nameEle.textContent;
        return {
          code,
          name
        };
      })
  );
  browser.close();

  return allOriginData;
}

module.exports = crawler;
