var vows = require('vows'),
	assert = require('assert'),
	Image = require('../imagick').Image;

vows.describe('Image Magick javascript module').addBatch({
	'cropping image': {

		'with sane values': {
			topic: new Image('fixtures/source.jpg'),
			
			'should crop normally': function(image){
				var targetImage = 'temp/cropped.jpg';
				image.crop(200, 400, 180, 100).save(targetImage);
				var croppedImage = new Image(targetImage);
				assert.equal(croppedImage.size[0], 200);
				assert.equal(croppedImage.size[1], 380);
			}
		},
		
		'with negative offsets': {
			topic: new Image('fixtures/source.jpg'),
			
			'should crop normally': function(image){
				var targetImage = 'temp/cropped2.jpg';
				image.crop(20, 20, -10, -10).save(targetImage);
				var croppedImage = new Image(targetImage);
				assert.equal(croppedImage.size[0], 10);
				assert.equal(croppedImage.size[1], 10);
			}
		}

	}
}).export(module);