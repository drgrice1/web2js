'use strict';

module.exports = class SubrangeType {
  constructor(lower,upper) {
    this.lower = lower;
    this.upper = upper;
  }

  range(e) {
    return `(${this.upper.generate(e)})-(${this.lower.generate(e)})+1`;
  }
  
  intish(e) {
    if ((typeof this.upper.number == "number") &&
        (typeof this.lower.number == "number")) {
      var signed = "Uint";
      var r = this.upper.number - this.lower.number;
      if (this.lower.number < 0) {
        r = r * 2;
        signed = "Int";
      }
      
      if (r <= 255)
        return `${signed}8`;
      
      if (r <= 65536)
        return `${signed}16`;
      
      return `${signed}32`;        
    }

    return "Uint32";
  }
  
  initializer(e) {
    return `0`;
  }
  
  generate(e) {
    return `range ${this.lower.generate(e)}..${this.upper.generate(e)}`;
  }
}