// DEBUGGING
// cd /Users/alex/Dev/NodeJS/homebridge
// DEBUG=* node debug ./bin/homebridge -D -P ../homebridge-mqtt-rgbled/


var Service, Characteristic;

/**
 * @module homebridge
 * @param {object} homebridge Export functions required to create a
 *                            new instance of this plugin.
 */
module.exports = function(homebridge){
    console.log("homebridge API version: " + homebridge.version);

    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-mqtt-rgbled', 'MQTT-RGB-LED', MQTT_RGB);
};

/**
 * Parse the config and instantiate the object.
 *
 * @summary Constructor
 * @constructor
 * @param {function} log Logging function
 * @param {object} config Your configuration object
 */
function MQTT_RGB(log, config) {
    //create instance for one stripe to store state
    log("Config: " + config);
    var me = this;
    
    this.stripe = require("./mqtt-rgbled-mod")(log, config, function(data) {
        if (data) {
            me.lightbulbService.getCharacteristic(Characteristic.On).setValue(data.power, undefined, 'myListener');
            me.lightbulbService.getCharacteristic(Characteristic.Hue).setValue(data.hue, undefined, 'myListener');
            me.lightbulbService.getCharacteristic(Characteristic.Saturation).setValue(data.saturation, undefined, 'myListener');
            me.lightbulbService.getCharacteristic(Characteristic.Brightness).setValue(data.brightness, undefined, 'myListener');
        }
        log("listerner: state changed " + data)
    });

    this.log = log;
    this.name                          = config.name;
}

/**
 * @augments MQTT_RGB
 */
MQTT_RGB.prototype = {

    /** Required Functions **/
    identify: function(callback) {
        this.log('Identify requested!');
        //TODO - blink a litte bit
        callback();
    },

    getServices: function() {
        // You may OPTIONALLY define an information service if you wish to override
        // default values for devices like serial number, model, etc.
        var informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, 'MQTT RGB LED')
            .setCharacteristic(Characteristic.Model, 'MQTT RGB LED version-1')
            .setCharacteristic(Characteristic.SerialNumber, 'MQTT RGB LED Serial');

        this.log('creating Lightbulb service');
        var lightbulbService = new Service.Lightbulb(this.name);

        // Handle on/off
        lightbulbService
            .getCharacteristic(Characteristic.On)
            .on('get', this.getPowerState.bind(this))
            .on('set', this.setPowerState.bind(this));

        // Handle brightness
        this.log('... adding Brightness');
        lightbulbService
            .addCharacteristic(new Characteristic.Brightness())
            .on('get', this.getBrightness.bind(this))
            .on('set', this.setBrightness.bind(this));

        // Handle color
        this.log('... adding Hue');
        lightbulbService
            .addCharacteristic(new Characteristic.Hue())
            .on('get', this.getHue.bind(this))
            .on('set', this.setHue.bind(this));

        this.log('... adding Saturation');
        lightbulbService
            .addCharacteristic(new Characteristic.Saturation())
            .on('get', this.getSaturation.bind(this))
            .on('set', this.setSaturation.bind(this));

        this.lightbulbService = lightbulbService;

        //request current state to start with correct values at startup
        var me = this;
        setTimeout(() => {
            me.getPowerState(function() {}); //only to publish to the getstate topic
        }, 1000);

        return [informationService, lightbulbService];
    },

    /**
     * Gets power state of led stripe.
     * @param {function} homebridge-callback function(error, result)
     */
    getPowerState: function(callback) {
        var result = this.stripe.getPowerState();
        this.log('... powerState: ' + result);
        callback(null, result);
    },

    /**
     * Gets power state of led stripe.
     * @param state true = on, false = off
     * @param {function} homebridge-callback function(error, result)
     */
    setPowerState: function(state, callback, origin) {
        if (origin == 'myListener') {
            callback(undefined, state);
        }
        var me = this;
        this.log('... setting powerState to ' + state);
        this.stripe.setPowerState(state, function(success) {
            me.log('... setting powerState success: ' + success);
            callback(undefined, state);
        });
    },

    /**
     * Gets brightness of led stripe.
     * @param {function} homebridge-callback function(error, level)
     */
    getBrightness: function(callback) {
        var result = this.stripe.getBrightness();
        this.log('... brightness: ' + result);
        callback(null, result);
    },

    /**
     * Sets brightness of led stripe.
     * @param {number} level 0-100
     * @param {function} callback The callback that handles the response.
     */
    setBrightness: function(level, callback, origin) {
        if (origin == 'myListener') {
            callback(undefined, level);
        }
        var me = this;
        this.log('... setting brightness to ' + level);
        this.stripe.setBrightness(level, function(success) {
            me.log('... setting brightness success: ' + success);
            callback(undefined, success)
        });
    },

    /**
     * Gets hue of led stripe.
     * @param {function} homebridge-callback function(error, level)
     */
    getHue: function(callback) {
        var result = this.stripe.getHue();
        this.log('... hue: ' + result);
        callback(null, result);
    },

    /**
     * Sets hue of led stripe.
     * @param {number} level 0-360
     * @param {function} callback The callback that handles the response.
     */
    setHue: function(level, callback, origin) {
        if (origin == 'myListener') {
            callback(undefined, level);
        }
        var me = this;
        this.log('... setting hue to ' + level);
        this.stripe.setHue(level, function(success) {
            me.log('... setting hue success: ' + success);
            callback(undefined, success)
        });
    },

    /**
     * Gets saturation of led stripe.
     * @param {function} homebridge-callback function(error, level)
     */
    getSaturation: function(callback) {
        var result = this.stripe.getSaturation();
        this.log('... saturation: ' + result);
        callback(null, result);
    },

    /**
     * Sets saturation of led stripe.
     * @param {number} level 0-100
     * @param {function} callback The callback that handles the response.
     */
    setSaturation: function(level, callback, origin) {
        if (origin == 'myListener') {
            callback(undefined, level);
        }
        var me = this;
        this.log('... setting saturation to ' + level);
        this.stripe.setSaturation(level, function(success) {
            me.log('... setting saturation success: ' + success);
            callback(undefined, success)
        });
    }

};