import {invoke} from '@tauri-apps/api/core';
import { Route } from './json/jsonTypes';

// Loaded from the settingsjson
export class Settings {
  public routes: Route[];

  constructor(routes: Route[] | undefined = undefined) {
    this.routes = routes ?? [];
  }

  /**
   * Tries to load + validate your settings JSON.
   * @returns a Settings instance, or null if anything went wrong.
   * Vibe debugged. At least I disclaimer it!
   */
  static async tryLoadSettings(): Promise<Settings | null> {
    let rawJson: string;
    try {
      // 1) Read the file
      rawJson = await invoke<string>(
        "read_file",
        {
          path: "./HapticExtendedSettings.json"
        }
      );
    } catch (err) {
      console.error("Could not read settings file", err);
      return null;
    }

    let obj: any;
    try {
      // 2) Parse the JSON
      obj = JSON.parse(rawJson);
    } catch (err) {
      console.error("Settings JSON is invalid", err);
      return null;
    }

    // 3) Validate the shape
    if (
      !obj ||
      typeof obj !== "object" ||
      !Array.isArray(obj.routes)
    ) {
      console.error("Settings JSON does not have a routes array");
      return null;
    }

    // 4) Map + validate each route however you like
    try {
      const routes = obj.routes.map((r: any) =>
        Route.fromObject(r)
      );
      return new Settings(routes);
    } catch (err) {
      console.error("One of the routes failed to parse", err);
      return null;
    }
  }
}
