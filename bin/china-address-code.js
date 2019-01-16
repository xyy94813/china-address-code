#!/usr/bin/env node
const program = require("commander");
const path = require("path");

const main = require("../lib/core");
const { version } = require("../package.json");

const resolveArgPath = val => path.resolve(process.cwd(), val);

program
  .version(version, "-v, --version")
  .usage("[options] <file ...>")
  .option(
    "-c, --chromium <file>",
    "The chromium path",
    resolveArgPath,
    process.env.CHROMIUM_PATH
  )
  .option(
    "-o, --output <dir>",
    "The output dir path",
    resolveArgPath,
    process.env.OUTPUT_DIR || "dist"
  )
  .parse(process.argv);

const OUT_PATH = path.join(program.output, "china_address_code.json");
const ALL_PROVINCE_PATH = path.join(
  program.output,
  "china_province_address_code.json"
);
const ALL_CITY_PATH = path.join(program.output, "china_city_address_code.json");
const ALL_AREA_PATH = path.join(program.output, "china_area_address_code.json");
const TREE_STRUCT_PATH = path.join(
  program.output,
  "china_address_code_tree.json"
);

main({
  chromePath: program.chromium,
  originDataPath: OUT_PATH,
  allProvincePath: ALL_PROVINCE_PATH,
  allCityPath: ALL_CITY_PATH,
  allAreaPath: ALL_AREA_PATH,
  treeStructPath: TREE_STRUCT_PATH
});
