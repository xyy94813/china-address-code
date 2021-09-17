const crawler = require("./crawler");
const logger = require("./logger");
const writer = require("./writer");

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
