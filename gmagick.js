var CImage = require('./_build/default/binding').Image;
var path = require('path');

var pathShouldBeSpecifiedError = new Error('Image path should be specified.');
var pathDoesNotExistsError = new Error('Image path does not exists.');
var invalidCropRegionError = new Error('Passed values make an invalid crop region.');

var Image = exports.Image = function(imagePath){
    this.reset().readSync(imagePath);
};

Image.prototype.reset = function(){
    this._image = new CImage;
    return this;
};

Image.prototype.readSync = function(imagePath){
    if (imagePath == null){
        throw pathShouldBeSpecifiedError;
    }
    if (!path.existsSync(imagePath)){
        throw pathDoesNotExistsError;
    }
    // check for image path
    // Image path does not exists.
    this._image.read(imagePath);
    return this;
};

Image.prototype.writeSync = function(imagePath){
    if (imagePath == null){
        throw pathShouldBeSpecifiedError;
    }
    this._image.write(imagePath);
    return this;
};

Image.prototype.crop = function(width, height, offsetX, offsetY){
    if ((offsetX < 0) || (offsetY < 0)){
        throw invalidCropRegionError;
    }
    this._image.crop(width, height, offsetX, offsetY);
    return this;
};

Image.prototype.__defineGetter__('size', function(){
    return this._image.size;
});
