#!/usr/bin/env node
const program = require('commander');
const path = require('path');
const fs = require('fs');
const main = require('../lib/core');
const { version } = require('../package.json');

const resolveArgPath = (val) => path.resolve(process.cwd(), val);

program
  .version(version, '-v, --version')
  .usage('[options] <file ...>')
  .option('-c, --chromium <path>', 'The chromium path', resolveArgPath)
  .option('-o, --output [dir]', 'The output dir path', resolveArgPath)
  .parse(process.argv);

function getChromiumPath() {
  return program.chromium || resolveArgPath(process.env.CHROMIUM_PATH);
}

function getOutputDirPath() {
  return program.output || resolveArgPath(process.env.OUTPUT_DIR || 'dist');
}

const CHROMIUM_PATH = getChromiumPath();

if (!CHROMIUM_PATH) {
  throw Error('Miss chromium path.');
}

const DIR_PATH = getOutputDirPath();

try {
  fs.readdirSync(DIR_PATH);
} catch (error) {
  fs.mkdirSync(DIR_PATH);
}

const OUT_PATH = path.join(program.output, 'china_address_code.json');
const ALL_PROVINCE_PATH = path.join(
  program.output,
  'china_province_address_code.json',
);
const ALL_CITY_PATH = path.join(program.output, 'china_city_address_code.json');
const ALL_AREA_PATH = path.join(program.output, 'china_area_address_code.json');
const TREE_STRUCT_PATH = path.join(
  program.output,
  'china_address_code_tree.json',
);

main({
  chromePath: program.chromium,
  originDataPath: OUT_PATH,
  allProvincePath: ALL_PROVINCE_PATH,
  allCityPath: ALL_CITY_PATH,
  allAreaPath: ALL_AREA_PATH,
  treeStructPath: TREE_STRUCT_PATH,
});
