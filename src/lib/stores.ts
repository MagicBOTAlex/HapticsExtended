import { Settings } from "./Settings";

declare global {
    interface Document {
        HapticSettings: Settings;
    }
}

let loadedSettings = await Settings.tryLoadSettings();
if (loadedSettings == null) 
    loadedSettings = new Settings();
export let HapticSettings = loadedSettings;
window.document.HapticSettings = HapticSettings;