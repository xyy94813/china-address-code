const crawler = require("./crawler");
const logger = require("./logger");
const writer = require("./writer");

const DATA_WEB_SITE = `http://www.mca.gov.cn/article/sj/xzqh`;

async function main({
  chromePath,
  originDataPath,
  allProvincePath,
  allCityPath,
  allAreaPath,
  treeStructPath
}) {
  logger.info("Begin crawl data...");
  const originData = await crawler({
    chromePath,
    dataWebSite: DATA_WEB_SITE
  }).catch(logger.error);
  logger.info("End crawl data...");

  logger.info("Begin write data to files...");
  writer({
    originData,
    originDataPath,
    allProvincePath,
    allCityPath,
    allAreaPath,
    treeStructPath
  });
}

module.exports = main;
