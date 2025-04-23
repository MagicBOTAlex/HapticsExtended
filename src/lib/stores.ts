import { Settings } from "./Settings";

declare global {
    interface Document {
        HapticSettings: Settings;
    }
}

export let HapticSettings = await Settings.tryLoadSettings();
if (HapticSettings == null) HapticSettings = new Settings();
window.document.HapticSettings = HapticSettings;