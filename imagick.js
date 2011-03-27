var Image = exports.Image = require('./_build/default/binding').Image;

Image.prototype.crop = function(width, height, offsetX, offsetY){
	if ((width + offsetX <= 0) || (height + offsetY <= 0)){
		throw new Error(arguments + " make an invalid crop region.");
	}
	return this._crop(width, height, offsetX, offsetY);
};