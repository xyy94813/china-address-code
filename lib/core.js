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
  let originData;
  try {
    originData = await crawler({
      chromePath,
    })
  } catch (error) {
    logger.error(error);
    process.exit(0);
  }

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
