
var fs = require('fs');
var colors = require('./colors-util');

var config = JSON.parse(fs.readFileSync('./sample-config.json', 'utf8')).accessories[0];

var led = require('./mqtt-rgbled-mod')(console.log, config, function(state) {
	console.log("State changed to " + JSON.stringify(state));
});

//var hsv = colors.rgb2hsb(50, 150, 250);
//var rgb = colors.hsb2rgb(hsv.h * 360.0, hsv.s * 100.0, hsv.v * 100.0);

//return;

//wait until connected
setTimeout(function() {

	//console.log("switch: " + led.getPowerState());
	//console.log("hue: " + led.getHue());
	//console.log("saturation: " + led.getSaturation());
	//console.log("brightness: " + led.getBrightness());

	setTimeout(function() {
		console.log("");
		//console.log("switch: " + led.getPowerState());
		//console.log("hue: " + led.getHue());
		//console.log("saturation: " + led.getSaturation());
		console.log("brightness: " + led.getBrightness());
			
	}, 2000);

	led.setPowerState(true, function(result) { console.log("setPowerStateResult: " + result); });
	led.setHue(27, function(result) { console.log("setHue: " + result); });
	led.setSaturation(60, function(result) { console.log("setSaturation: " + result); });
	led.setBrightness(98, function(result) { console.log("setBrightness: " + result); });

}, 1000);
