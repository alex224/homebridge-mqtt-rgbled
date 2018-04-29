# homebridge-lw12-rgb-ledstrip

Plugin for LED Strips controlled by MQTT topics for Homebridge (https://www.amazon.de/gp/product/B00GMAS7U2)

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g git+https://github.com/alex224/homebridge-mqtt-rgbled.git
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Requirement for opposite part - the led controller
- the controller supports topics for setting the on/off-state (switch), the brightness and the color (as a hex value)
- the controller supports a topic to request the current state (stateRequest) and sends the answer on another topic (stateAnswer)

# Configuration

Configuration sample file:

 ```
	"accessories": [
		{
			"accessory": "MQTT-RGB-LED",
			"name": "Bed light",

			"broker" : {
				"url": "mqtt://docker"
			},

			"topics" : {
				"brightness" : "/home/device/esp-bedroom/brightness",
				"switch" : "/home/device/esp-bedroom/switch",
				"color" : "/home/device/esp-bedroom/color",
				"stateRequest" : "/home/device/esp-bedroom/getstate",
				"stateAnswer" : "/home/device/esp-bedroom/state"
			}
		}
	]
```
