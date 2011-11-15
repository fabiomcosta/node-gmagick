var vows = require('vows'),
    assert = require('assert'),
    path = require('path'),
    Image = require('../gmagick').Image;


var fixturePath = path.join(__dirname, 'fixtures'),
    sourceImagePath = path.join(fixturePath, 'source.jpg');


var newImage = function(){
    return new Image(sourceImagePath);
};

vows.describe('Image Magick javascript module').addBatch({
    'creating instance': {
        'should not throw any error on an existent image': function(){
            assert.doesNotThrow(newImage);
        },
        'should throw error on a non defined path': function(){
            assert.throws(function(){
                new Image();
            }, /should be specified/);
        },
        'should throw error on a non-existent path': function(){
            assert.throws(function(){
                new Image('fixtures/inexistent_source.jpg');
            }, /does not exists/);
        }
    },

    'the image methods': {
        topic: newImage,

        'readSync method': {
            'should throw error on a non defined path': function(topic){
                assert.throws(function(){
                    topic.readSync();
                }, /should be specified/);
            },
            'should throw error on a non-existent path': function(topic){
                assert.throws(function(){
                    topic.readSync('fixtures/inexistent_source.jpg');
                }, /does not exists/);
            }
        },

        'read method': {
            topic: function(){
                newImage().read(sourceImagePath, this.callback);
            },
            'should make the image available while on the callback': function(err, image){
                assert.equal(image, 1);
                //assert.equal(image.size[0], 640);
                //assert.equal(image.size[1], 480);
            }
        },

        'writeSync method': {
            topic: function(old){
                return old.writeSync('temp/temp.jpg');
            },
            'written image should exist': function(topic){
                assert.ok(path.existsSync('temp/temp.jpg'));
            },
            'with written image': {
                topic: function(){
                    return new Image('temp/temp.jpg');
                },
                'should have the same width of the original': function(topic){
                    assert.ok(topic.size[0], 640);
                },
                'should have the same heigth of the original': function(topic){
                    assert.ok(topic.size[1], 480);
                }
            }
        },

        'crop method': {
            'with sane values': {
                topic: function(){
                    return newImage().crop(200, 380, 0, 0);
                },
                'should have the defined width from crop': function(topic){
                    assert.equal(topic.size[0], 200);
                },
                'should have the defined height from crop': function(topic){
                    assert.equal(topic.size[1], 380);
                }
            },
            'with incorrect values': {
                'should throw an error with negative offsets': function(topic){
                    assert.throws(function(){
                        topic.crop(20, 20, -10, -10);
                    }, /invalid crop region/);
                },
                'with a crop bigger than the image size': {
                    topic: function(){
                        return newImage().crop(700, 700, 0, 0);
                    },
                    'should keep the image integrity on width bigger than the images': function(topic){
                        assert.equal(topic.size[0], 640);
                    },
                    'should keep the image integrity on height bigger than the images': function(topic){
                        assert.equal(topic.size[1], 480);
                    }
                }
            }
        },
        //'resize method': {
            //topic: function(){
                //return newImage().resize(200, 300);
            //},
            //'should have the defined width from the resize method': function(topic){
                //assert.equal(topic.size[0], 200);
            //},
            //'should have the defined height from the resize method': function(topic){
                //assert.equal(topic.size[0], 300);
            //}
        //}
    }
    
}).export(module);

