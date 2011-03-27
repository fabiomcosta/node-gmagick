var vows = require('vows'),
	assert = require('assert'),
	Image = require('../imagick').Image;

vows.describe('Image Magick javascript module').addBatch({
	'cropping image': {

		topic: function(){
			return new Image('fixtures/source.jpg');
		},

		'we get a cropped image': function(image){
			var targetImage = 'temp/cropped.jpg';
			image.crop(200, 400, 180, 100).save(targetImage);
			var croppedImage = new Image(targetImage);
			assert.equal(croppedImage.size[0], 200);
			assert.equal(croppedImage.size[1], 380);
		}
	}
}).export(module);