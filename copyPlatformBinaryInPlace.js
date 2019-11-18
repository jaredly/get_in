#!/usr/bin/env node

var fs = require('fs');

var arch = process.arch;
var platform = process.platform;

if (arch === 'ia32') {
	arch = 'x86';
}

if (platform === 'win32') {
	platform = 'win';
}

copyBinary('bin/get_in_ppx-' + platform + '-' + arch + '.exe', 'ppx');
copyBinary('bin/bsb6/get_in_ppx-' + platform + '-' + arch + '.exe', 'ppx6');

function copyBinary(filename, destFilename) {
	var supported = fs.existsSync(filename);

	if (!supported) {
		console.error('get_in_ppx does not support this platform :(');
		console.error('');
		console.error('get_in_ppx comes prepacked as built binaries to avoid large');
		console.error('dependencies at build-time.');
		console.error('');
		console.error('If you want get_in_ppx to support this platform natively,');
		console.error('please open an issue at our repository, linked above. Please');
		console.error('specify that you are on the ' + platform + ' platform,');
		console.error('on the ' + arch + ' architecture.');

		if (!process.env.IS_GET_IN_PPX_CI) {
			process.exit(1);
		}
	}

	if (process.env.IS_GET_IN_PPX_CI) {
		console.log('get_in_ppx: IS_GET_IN_PPX_CI has been set, skipping moving binary in place');
		process.exit(0);
	}

	if (!fs.existsSync(destFilename)) {
		copyFileSync(filename, destFilename);
		fs.chmodSync(destFilename, 0755);
	}

	var destFilenameExe = destFilename + '.exe';
	if (!fs.existsSync(destFilenameExe)) {
		copyFileSync(filename, destFilenameExe);
		fs.chmodSync(destFilenameExe, 0755);
	}
}

function copyFileSync(source, dest) {
	if (typeof fs.copyFileSync === 'function') {
		fs.copyFileSync(source, dest);
	} else {
		fs.writeFileSync(dest, fs.readFileSync(source));
	}
}
