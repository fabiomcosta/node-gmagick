var FFI = require('node-ffi'),
	path = require('path'),
	spawn = require('child_process').spawn;

var magickWandConfigOutput = '';
var magickWandConfig = spawn('MagickWand-config', ['--prefix']);
magickWandConfig.stdout.setEncoding('utf8');
magickWandConfig.stdout.on('data', function(data){
	magickWandConfigOutput += data.trim();
});
magickWandConfig.on('exit', function(code){
	if (code == 0){
		var libRoot = path.join(magickWandConfigOutput, 'lib');
		var libPossibleNames = ['libWand', 'libMagickWand'];
		var lib;
		libPossibleNames.forEach(function(libName){
			var libPath = path.join(libRoot, libName);
			try {
				lib = new FFI.Library(libPath, {
					NewMagickWand: ['pointer', []],
					MagickReadImage: ['pointer', ['pointer', 'string']],
					MagickWriteImage: ['pointer', ['pointer', 'string']],
					//MagickNewImage: ['', []],
					//MagickReadImageBlob: ['', []]
				});
			} catch(e){ console.log(e); };
		});
		if (!lib){
			throw new Error('Did not found MagickWand');
		}
		var wand = lib.NewMagickWand();
		lib.MagickReadImage(wand, 'tests/fixtures/source.jpg');
		lib.MagickWriteImage(wand, 'omg.jpeg');
	} else {
		throw new Error('Something wrong happened while trying to get the path to libMagickWand.');
	}
});
