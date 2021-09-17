const puppeteer = require('puppeteer-core');

const DATA_WEB_SITE = 'http://www.mca.gov.cn/article/sj/xzqh';

async function crawler({ chromePath }) {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: chromePath,
  });
  const page = await browser.newPage();
  await page.goto(DATA_WEB_SITE);
  await page.waitForSelector('.article', {
    visible: true,
    timeout: 0,
  });

  const latestAnnouncementUrl = await page.$eval(
    'table.article tbody',
    (ele) => {
      for (let $tr of ele.children) {
        const $a = $tr.querySelector('.artitlelist');
        if (/中华人民共和国行政区划代码$/.test($a.title)) {
          return $a.href;
        }
      }
      throw Error('Not founded Article');
    },
  );

  await page.goto(latestAnnouncementUrl, { timeout: 0 });

  const dataURl = await page.$eval('#zoom p a', (ele) => {
    return ele.href;
  });

  await page.goto(dataURl, { timeout: 0 });

  await page.waitForSelector('table', {
    visible: true,
    timeout: 0,
  });

  const allOriginData = await page.$eval('table tbody', (ele) => {
    const data = [];
    // tbody has title and footer !!!!!!
    const lastIndex = ele.children.length - 9;
    for (let i = 3; i < lastIndex; ++i) {
      const [, codeEle, nameEle] = ele.children[i].children;
      const code = codeEle.textContent.trim();
      // 三沙市，南山区，西沙区 未提供行政编码
      if (code) {
        const name = nameEle.textContent.trim();
        data.push({
          code,
          name,
        });
      }
    }
    return data;
  });

  browser.close();

  return allOriginData;
}

module.exports = crawler;
