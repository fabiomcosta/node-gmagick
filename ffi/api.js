var FFI = require('node-ffi'),
    path = require('path');

var api = {};

var libPossibleNames = ['libMagickWand', 'libWand'];
libPossibleNames.forEach(function(libName){
    try {
        api = new FFI.Library(libName, {
            NewMagickWand: ['pointer', []],
            MagickReadImageBlob: ['pointer', ['pointer', 'string', 'int']],
            MagickReadImage: ['pointer', ['pointer', 'string']],
            MagickWriteImage: ['pointer', ['pointer', 'string']],
            MagickGetImageBlob: ['pointer', ['pointer', 'size_t']],
            MagickRelinquishMemory: ['pointer', ['string']]
            //MagickNewImage: ['', []],
            //MagickReadImageBlob: ['', []]
        });
    } catch(e){};
});

if (!api){
    throw new Error('Did not found MagickWand');
}

exports.api = api;

//var wand = lib.NewMagickWand();
//lib.MagickReadImage(wand, 'tests/fixtures/source.jpg');
//lib.MagickWriteImage(wand, 'copy.jpg');

