var CImage = require('./_build/default/binding').Image;

var pathError = new Error('Image path should be specified');


var Image = exports.Image = function(path){
    this.reset().readSync(path);
};

Image.prototype.reset = function(){
    this._image = new CImage;
    return this;
};

Image.prototype.readSync = function(path){
    if (path == null){
        throw pathError;
    }
    // check for image path
    // Image path does not exists.
    this._image.read(path);
    return this;
};

Image.prototype.saveSync = function(path){
    if (path == null){
        throw pathError;
    }
    this._image.save(path);
    return this;
};


