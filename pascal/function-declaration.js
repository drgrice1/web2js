'use strict';

var Environment = require('./environment.js');

module.exports = class FunctionDeclaration {
  constructor(identifier, params, resultType, block) {
    this.identifier = identifier;
    this.params = params;
    this.resultType = resultType;
    this.block = block;
  }

  generate(environment) {
    var code  = "";
    var params = [];

    environment = new Environment(environment);
    
    for( var i in this.params ) {
      var param = this.params[i];

      for( var j in param.names ) {
        environment.variables[param.names[j].name] = this.params[i].type;
        //var name = param.names[j].generate(environment);
	var name = param.names[j].name;
        params.push( name );
      }
    }
    
    if (this.resultType) {
      environment.functionIdentifier = this.identifier;
    }

    var id = this.identifier.generate(environment);
    
    code = code + `function ${id}(${params.join(',')}) {\n`;
    code = code + `trace("${id}");\n`;

    for( var i in this.params ) {
      var param = this.params[i];

      for( var j in param.names ) {
	if (param.type.name == "memoryword") {
	  var n = param.names[j].name;
	  code = code + `/*BADBAD*/var ${n}_int = new Int32Array(${n}.buffer);\n`;      
	  code = code + `var ${n}_gr = new Float32Array(${n}.buffer);\n`;
	  code = code + `var ${n}_hh = new Uint16Array(${n}.buffer);\n`;
	  code = code + `var ${n}_qqqq = new Uint8Array(${n}.buffer);`;	  
	  
	}
      }
    }

    
    if (this.resultType) {
      code = code + `var _${id}; /* has result type ${this.resultType.generate(environment)} */\n`;
    }
    code = code + this.block.generate(environment);
    code = code + `trace_exit("${id}");\n`;    
    if (this.resultType) {
      code = code + `return _${id};\n`;
    }
    code = code + "}\n";

    if (this.resultType) {
      environment.functionIdentifier = undefined;
    }
    
    return code;
  }
  
};
