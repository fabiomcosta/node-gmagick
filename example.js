var imagick = require('./build/default/imagick');

var sourceImage = 'source.jpg';
var targetImage = 'cropped.jpg';

var image = new imagick.Image(sourceImage);

image.crop(200, 400, 180, 100);

image.save(targetImage);

console.log('Image cropped at ./' + targetImage);

