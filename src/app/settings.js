import document from "document";
import { preferences } from "user-settings";
import { units } from "user-settings";
import { user } from "user-profile";
import * as fs from "fs";
import * as messaging from "messaging";
import { me as appbit } from "appbit";
import { me as device } from "device";
import { locale } from "user-settings";

import * as bm from "./bm.js";
import * as date from "./date.js"
import * as battery from "./battery.js"
import * as time from "./time.js"
import * as hr from "./hr.js"
import * as activity from "./activity.js"
import * as state from "./state.js"

// SETTINGS
export const SETTINGS_TYPE = "cbor";
export const SETTINGS_FILE = "settingsV1.cbor";
export let settings = loadSettings();
export let root = document.getElementById('root');
export let backgroundEl = document.getElementById('background');

export function applySettings() {
  if (!loadSettings) {
   return;
  }
  
  try {
    if (settings.hasOwnProperty("distanceUnit") && settings["distanceUnit"].values) {
      activity.distanceUnitSet(settings["distanceUnit"].values[0].value);
    }    
            
    if (settings.hasOwnProperty("dateFormat") && settings["dateFormat"].values) {
      date.setDateFormat(settings["dateFormat"].values[0].value); 
    } 
            
    if (settings.hasOwnProperty("timeFormat") && settings["timeFormat"].values) {
      time.setTimeFormat(settings["timeFormat"].values[0].value); 
    } 
    
    if (settings.hasOwnProperty("isAmPm")) {
      time.setIsAmPm(!!settings["isAmPm"]); 
    } 
    
    if (settings.hasOwnProperty("showSeconds")) {
      time.setShowSeconds(!!settings["showSeconds"]); 
    } 
    
    if (settings.hasOwnProperty("showLeadingZero")) {
      time.setShowLeadingZero(!!settings["showLeadingZero"]); 
    }
    
    if (settings.hasOwnProperty("flashDots")) {
      time.setFlashDots(!!settings["flashDots"]); 
    }
    
    if (settings.hasOwnProperty("hearRateZoneVis")) {
      hr.setHrZoneVis(!!settings["hearRateZoneVis"]); 
    } 
    
    if (settings.hasOwnProperty("BMIVis")) {
      bm.setBMIVis(!!settings["BMIVis"]); 
    } 
    
    if (settings.hasOwnProperty("BMRVis")) {
      bm.setBMRVis(!!settings["BMRVis"]); 
    } 
    
    if (settings.hasOwnProperty("timeColour") && settings["timeColour"]) {
      time.timeHourEl.style.fill = settings["timeColour"];
      time.timeColonEl.style.fill = settings["timeColour"];
      time.timeMinuteEl.style.fill = settings["timeColour"];
      time.timeSecEl.style.fill = settings["timeColour"];
      time.timeAmPmEl.style.fill = settings["timeColour"];
    }

    if (settings.hasOwnProperty("dateColour") && settings["dateColour"]) {
      date.dateEl.style.fill = settings["dateColour"];
      date.dayEl.style.fill = settings["dateColour"];
    }

    if (settings.hasOwnProperty("isHeartbeatAnimation")) {
      hr.isHeartbeatAnimationSet(!!settings.isHeartbeatAnimation); 
    }

    if (settings.hasOwnProperty("backgroundColour") && settings["backgroundColour"]) {
      backgroundEl.style.fill = settings["backgroundColour"];     
    }

    if (settings.hasOwnProperty("heartColour") && settings["heartColour"]) {
      hr.hrIconDiastoleEl.style.fill = settings["heartColour"];
      hr.hrIconSystoleEl.style.fill = settings["heartColour"];         
    }          

    if (settings.hasOwnProperty("heartRateColour") && settings["heartRateColour"]) {
      hr.hrCountEl.style.fill = settings["heartRateColour"];    
      hr.hrRestingEl.style.fill = settings["heartRateColour"];
      hr.hrZoneEl.style.fill = settings["heartRateColour"];
    }         

    if (settings.hasOwnProperty("bmColour") && settings["bmColour"]) {
      bm.bmrZoneEl.style.fill = settings["bmColour"];   
      bm.bmiZoneEl.style.fill = settings["bmColour"];
    }
    
    if (settings.hasOwnProperty("showBatteryPercent")) {
      battery.setShowBatteryPercent(!!settings["showBatteryPercent"]); 
    } 
        
    if (settings.hasOwnProperty("battery0Colour") && settings["battery0Colour"]) {
        battery.setColour0(settings["battery0Colour"]);
    }
        
    if (settings.hasOwnProperty("battery25Colour") && settings["battery25Colour"]) {
        battery.setColour25(settings["battery25Colour"]);
    }
        
    if (settings.hasOwnProperty("battery50Colour") && settings["battery50Colour"]) {
        battery.setColour50(settings["battery50Colour"]);
    }
        
    if (settings.hasOwnProperty("battery75Colour") && settings["battery75Colour"]) {
        battery.setColour75(settings["battery75Colour"]);
    }
        
    if (settings.hasOwnProperty("batteryBackgroundColour") && settings["batteryBackgroundColour"]) {
        battery.batteryLineBack.style.fill = settings["batteryBackgroundColour"];
    }

    for (var i=0; i < activity.goalTypes.length; i++) {
      var goalType = activity.goalTypes[i];      
      var goalTypeColourProp = goalType + "Colour";
      if (settings.hasOwnProperty(goalTypeColourProp) && settings[goalTypeColourProp]) {
        activity.progressEls[i].count.style.fill = settings[goalTypeColourProp];
        activity.progressEls[i].icon.style.fill = settings[goalTypeColourProp];
        activity.progressEls[i].line.style.fill = settings[goalTypeColourProp];
      }

      if (settings.hasOwnProperty("progressBackgroundColour") && settings["progressBackgroundColour"]) {
        activity.progressEls[i].lineBack.style.fill = settings["progressBackgroundColour"];
      }

      var goalTypeLocationProp = goalType + "Location";
      if (settings.hasOwnProperty(goalTypeLocationProp) && settings[goalTypeLocationProp]) {
        setStatsLocation(activity.progressEls[i].container, settings[goalTypeLocationProp].values[0].value);
      }
    }
    
    if (settings.hasOwnProperty("BMLocation") && settings["BMLocation"]) {
        setStatsLocation(bm.bmEl, settings["BMLocation"].values[0].value);
      }
    
    activity.resetProgressPrevState();
    state.applyState();
  } catch (ex) {
    console.log(ex);
  }
}

applySettings();

export function setStatsLocation(element, location)
{
    var maxWidth = device.screen.width;
    var maxHeight = device.screen.height;
  
    if(location == "TL")
    {
      element.style.display = "inline";
      element.x = (3 * maxWidth) / 100;
      element.y = maxHeight - 60;
      return;
    }
  
    if(location == "BL")
    {
      element.style.display = "inline";
      element.x = (3 * maxWidth) / 100;
      element.y = maxHeight - 30;
      return;
    }
  
    if(location == "TM")
    {
      element.style.display = "inline";
      element.x = (36 * maxWidth) / 100;
      element.y = maxHeight - 60;
      return;
    }
  
    if(location == "BM")
    {
      element.style.display = "inline";
      element.x = (36 * maxWidth) / 100;
      element.y = maxHeight - 30;
      return;
    }
  
    if(location == "TR")
    {
      element.style.display = "inline";
      element.x = (69 * maxWidth) / 100;
      element.y = maxHeight - 60;
      return;
    }
  
    if(location == "BR")
    {
      element.style.display = "inline";
      element.x = (69 * maxWidth) / 100;
      element.y = maxHeight - 30;
      return;
    }
  
    if(location == "NONE")
    {
      element.style.display = "none";
      return;
    }
}

export function onsettingschange(data) {
  if (!data) {
   return;
  }
  settings = data;
  applySettings();
  time.drawTime(new Date());
}

messaging.peerSocket.addEventListener("message", function(evt) {
  if (!settings) {
    settings = {};
  }
  settings[evt.data.key] = evt.data.value;
  onsettingschange(settings);
})

appbit.addEventListener("unload", saveSettings);

export function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    console.log(ex);
    var defaults = {
      isHeartbeatAnimation: false,
      isFastProgress: false
    };    
    
    if (units.distance === "us") {
      defaults["distanceUnit"] = { values:[{value:"mi"}]}; 
    }   
    return defaults;
  }
}

// Save settings to the filesystem
export function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}