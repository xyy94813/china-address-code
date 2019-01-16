class Address {
  constructor(code, name) {
    this.code = code;
    this.name = name;
    this.parentCode = this.code
      .replace(/\d{2}0*$/, "")
      .padEnd(code.length, "0");
  }
}

module.exports = Address;
