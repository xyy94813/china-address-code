const fs = require('fs');

const logger = require('./logger');
const Address = require('./Address');

async function writeDataToFiles({
  originData,
  originDataPath,
  allProvincePath,
  allCityPath,
  allAreaPath,
  treeStructPath,
}) {
  const allAddress = originData.map(
    ({ code, name }) => new Address(code, name),
  );

  const writeFilePromises = [
    new Promise((resolve) => {
      fs.writeFile(
        originDataPath,
        JSON.stringify(allAddress.map((item) => item.toArray(true))),
        () => {
          logger.info('Write origin data to %s success.', originDataPath);
          resolve();
        },
      );
    }),
  ];

  // // Split raw data into provinces, cities, and districts
  const allProvinces = [];
  const allCities = [];
  const allDistricts = [];

  allAddress.forEach((item) => {
    if (item.level === Address.LEVEL.PROVINCE) {
      allProvinces.push(item);
    } else if (item.level === Address.LEVEL.CITY) {
      allCities.push(item);
    } else if (item.level === Address.LEVEL.DISTRICTS) {
      allDistricts.push(item);
    }
  });

  writeFilePromises.push(
    new Promise((resolve) => {
      fs.writeFile(
        allProvincePath,
        JSON.stringify(allProvinces.map((item) => item.toArray(true))),
        () => {
          logger.info('Write all provinces to %s success.', allProvincePath);
          resolve();
        },
      );
    }),
    new Promise((resolve) => {
      fs.writeFile(
        allCityPath,
        JSON.stringify(allCities.map((item) => item.toArray(true))),
        () => {
          logger.info('Write all cities to %s success.', allCityPath);
          resolve();
        },
      );
    }),
    new Promise((resolve) => {
      fs.writeFile(
        allAreaPath,
        JSON.stringify(allDistricts.map((item) => item.toArray(true))),
        () => {
          logger.info('Write all districts to %s success.', allAreaPath);
          resolve();
        },
      );
    }),
  );

  const toArrayTreeNode = (address) => {
    const formattedData = address.toArray(true);
    formattedData.push([]);
    return formattedData;
  };

  const generateTreeStruct = () => {
    const treeStruct = allProvinces.map(toArrayTreeNode);

    // 直辖市 没有市级 区域编码
    const specialCities = [
      new Address('110100', '北京市'),
      new Address('120100', '天津市'),
      new Address('310100', '上海市	'),
      new Address('500100', '重庆市区'),
      new Address('500200', '重庆郊县'),
    ];

    allCities.concat(specialCities).forEach((city) => {
      const belongsProvinceShortCode = city.code.slice(0, 2);
      const belongsProvince = treeStruct.find(
        ([provinceShortCode]) => provinceShortCode === belongsProvinceShortCode,
      );
      const allCitiesOfBelongsProvince = belongsProvince[2];
      allCitiesOfBelongsProvince.push(toArrayTreeNode(city));
    });

    allDistricts.forEach((district) => {
      const belongsProvinceCode = district.code.slice(0, 2);
      const belongsProvince = treeStruct.find(
        ([provinceCode]) => provinceCode === belongsProvinceCode,
      );
      const allCitiesOfBelongsProvince = belongsProvince[2];
      const belongsCityCode = district.code.slice(0, 4);
      let belongsCity = allCitiesOfBelongsProvince.find(
        ([cityShortCode]) => belongsCityCode === cityShortCode,
      );
      // 处理直辖行政单位，例如仙桃市，五指山市 等。
      if (!belongsCity) {
        belongsCity = [belongsCityCode, '直辖行政单位', []];
        allCitiesOfBelongsProvince.push(belongsCity);
      }
      const allDistrictsOfBelongsCity = belongsCity[2];
      allDistrictsOfBelongsCity.push(district.toArray());
    });

    return treeStruct;
  };

  writeFilePromises.push(
    new Promise((resolve) => {
      fs.writeFile(
        treeStructPath, JSON.stringify(generateTreeStruct()),
        () => {
          logger.info('write tree struct to %s success.', treeStructPath);
          resolve();
        },
      );
    }),
  );

  return Promise.all(writeFilePromises);
}

module.exports = writeDataToFiles;
