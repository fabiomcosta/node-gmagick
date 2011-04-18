#!/usr/bin/env node

var Image = require('gmagick').Image;

new Image('pywand.jpg').saveSync('example.jpg');
