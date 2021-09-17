const PROVINCE_CODE_REGEXP = /^\d{2}0{4}$/;
const CITY_CODE_REGEXP = /^\d{4}0{2}$/;

class Address {

  static LEVEL = {
    PROVINCE: 1,
    CITY: 2,
    DISTRICTS: 3,
  }

  #code;
  #name;

  constructor(code, name) {
    this.#code = code;
    this.#name = name;
  }

  get code() {
    return this.#code;
  }

  get shortCode() {
    if (this.level === Address.LEVEL.PROVINCE) {
      return this.#code.slice(0, 2)
    } else if (this.level === Address.LEVEL.CITY) {
      return this.#code.slice(0, 4)
    } 
    return this.#code;
  }

  get name() {
    return this.#name;
  }

  get parentCode() {
    let parentCode;
    if (this.level === Address.LEVEL.DISTRICTS) {
      parentCode = this.#code.slice(0, 4)
    } else if (this.level === Address.LEVEL.CITY) {
      parentCode = this.#code.slice(0, 2)
    } else {
      parentCode = ''
    }

    return parentCode.padEnd(6, '0');
  }

  get level() {
    if (PROVINCE_CODE_REGEXP.test(this.code)) {
      return Address.LEVEL.PROVINCE;
    } else if (CITY_CODE_REGEXP.test(this.code)) {
      return Address.LEVEL.CITY;
    } else {
      return Address.LEVEL.DISTRICTS;
    }
  }

  toArray(shortCode = true) {
    if (!shortCode) return [this.code, this.name];
    return [this.shortCode, this.name];
  }
}

module.exports = Address;
