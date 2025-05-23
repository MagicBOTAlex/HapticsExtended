# Haptics Extended
This project is inspired by [PatStrap](https://github.com/danielfvm/Patstrap), but does not share any code.
## NOTE: This is not compatible with PatStrap's ESP Firmware. You need this version of [OpenIris](https://github.com/MagicBOTAlex/OpenIris)
This project currently relies on [OpenIris](https://github.com/EyeTrackVR/OpenIris).
The haptic engine embedded inside of OpenIris is [here](https://github.com/MagicBOTAlex/OpenIris/tree/master/ESP/lib/src/network/HapticEngine)
It can easilty be extracted and made into a standalone ESP firmware, but I have not had the need for that yet. If you wish to change/add/remove endpoints, then you can do it [here](https://github.com/MagicBOTAlex/OpenIris/blob/6364fd6c450e4d857639b422391a932b9eba0e43/ESP/lib/src/network/HapticEngine/HapticEngine.hpp#L146)

### NOTE: Any haptic parameter has to include "pat" due to filtering unrelated params. (Hard coded optimisation in "lib.rs")

<img src="https://github.com/user-attachments/assets/bc366839-9bb0-49f8-915a-a872a9c8c591" width="300px"/>

## Building
This should work for both Windows and Linux. But Linux is untested. 
```
pnpm install
pnpm tauri build
```
The builded .exe should be in `.\HapticsExtended\src-tauri\target\release`
