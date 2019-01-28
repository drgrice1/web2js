'use strict';

module.exports = class FileType {
  constructor(type) {
    this.fileType = true;
    this.type = type;
  }

  initializer(e) {
    return `new FileHandle()`;
  }
  
  generate(e) {
    return `file of type ${this.type.generate(e)}`;
  }
};