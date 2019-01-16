const fs = require("fs");

const logger = require("./logger");
const Address = require("./Address");

function writeDataToFiles({
  originData,
  originDataPath,
  allProvincePath,
  allCityPath,
  allAreaPath,
  treeStructPath
}) {
  const allAddress = originData.map(
    ({ code, name }) => new Address(code, name)
  );

  fs.writeFile(originDataPath, JSON.stringify(allAddress), () => {
    logger.info("write all address to %s success.", originDataPath);
  });

  // Split raw data into provinces, cities, and districts
  const allProvice = [];
  const allCity = [];
  const allDistricts = [];

  allAddress.forEach(item => {
    if (/^\d{2}0{4}/.test(item.code)) {
      allProvice.push(item);
    } else if (/^\d{4}0{2}/.test(item.code)) {
      allCity.push(item);
    } else if (/^\d{4}([1-9]\d|\d[1-9])/.test(item.code)) {
      allDistricts.push(item);
    }
  });

  // 直辖市 没有市级 区域编码
  const specilCity = [
    new Address("110100", "北京市"),
    new Address("120100", "天津市"),
    new Address("310100", "上海市	"),
    new Address("500100", "重庆市")
  ];

  allCity.push(...specilCity);

  fs.writeFile(allProvincePath, JSON.stringify(allProvice), () => {
    logger.info("write all province to %s success.", allProvincePath);
  });

  fs.writeFile(allCityPath, JSON.stringify(allCity), () => {
    logger.info("write all city to %s success.", allCityPath);
  });

  fs.writeFile(allAreaPath, JSON.stringify(allDistricts), () => {
    logger.info("write all districts to %s success.", allAreaPath);
  });

  const treestruct = allProvice.map(province => ({
    ...province,
    children: allCity
      .filter(city => city.parentCode === province.code)
      .map(city => ({
        ...city,
        // 峡谷关 东莞 三沙 儋州 嘉峪关市 没有第三级行政区域
        children: allDistricts
          .filter(districts => districts.parentCode === city.code)
          .map(districts => ({
            ...districts
          }))
      }))
  }));

  fs.writeFile(treeStructPath, JSON.stringify(treestruct), () => {
    logger.info("write treestruct to %s success. ", treeStructPath);
  });
}

module.exports = writeDataToFiles;
