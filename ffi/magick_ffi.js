var api = require('./api').api;
var fs = require('fs');
var FFI = require('node-ffi');

var Image = function(path, callback){
    var self = this;
    this.wand = api.NewMagickWand();
    if (typeof path == 'string'){
        fs.readFile(path, function(error, data){
            if (error) throw error;
            api.MagickReadImageBlob(self.wand, data, data.length);
            callback.apply(self);
        });
    }
}

Image.prototype.save = function(path, callback){
    var self = this;
    var size = new FFI.Pointer(FFI.sizeOf('size_t'));
    //console.log(FFI);
    //console.log(this.wand);
    var buffer = api.MagickGetImageBlob(this.wand, size);
    //console.log('chega aqui', buffer, size, size.getSizeT());
    //debugger;
    var bufferSize = size.getSizeT();
    console.log(bufferSize);
    //for (var i = 0; i < bufferSize; i++){
        //console.log(buffer.seek(i).getCString());
    //}

    //if (typeof path == 'string'){
        //fs.writeFile(path, buffer, function(error){
            //if (error) throw error;
            //callback && callback.apply(self);
            //api.MagickRelinquishMemory(buffer);
        //});
    //}
}

var img = new Image('tests/fixtures/source.jpg', function(){
    this.save('copy.jpg');
});



//var wand = lib.NewMagickWand();
//lib.MagickReadImage(wand, 'tests/fixtures/source.jpg');
//lib.MagickWriteImage(wand, 'copy.jpg');

