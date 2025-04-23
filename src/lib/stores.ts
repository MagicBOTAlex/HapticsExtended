import { HapticManager } from "./HapticManager";
import { Settings } from "./Settings";

declare global {
    interface Document {
        hapticSettings: Settings;
    }
}

let loadedSettings = await Settings.tryLoadSettings();
if (loadedSettings == null) 
    loadedSettings = new Settings();
export let hapticSettings = loadedSettings;
window.document.hapticSettings = hapticSettings;

export let hapticManager = new HapticManager();
hapticManager.start();