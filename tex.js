var fs = require('fs');
var library = require('./library');

var code = fs.readFileSync('tex.wasm');

var pages = require('./commonMemory').pages;
var memory = new WebAssembly.Memory({initial: pages, maximum: pages});

var buffer = new Uint8Array(memory.buffer);
var f = fs.openSync('core.dump', 'r');
if (fs.readSync(f, buffer, 0, pages * 65536) != pages * 65536)
	throw 'Could not load memory dump';

library.setMemory(memory.buffer);
library.setInput(` ${process.argv[2]} \n\\end\n`);

WebAssembly.instantiate(code, { library: library, env: { memory: memory } }).then(() => {
	// Save the files used by this instance to a json file.
	let filesystem = library.getUsedFiles();

	// Don't save the input filename or the generated aux filename.
	delete filesystem[process.argv[2]];
	delete filesystem[process.argv[2].replace(/\.tex/, ".aux")];

	fs.writeFileSync('tex-files-resolved.json', JSON.stringify(filesystem, null, '\t'));
	fs.writeFileSync('tex-files.json', JSON.stringify(Object.keys(filesystem), null, '\t'));
});
