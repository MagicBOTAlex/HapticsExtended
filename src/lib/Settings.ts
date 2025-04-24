import {invoke} from '@tauri-apps/api/core';
import { Route } from './json/jsonTypes';
import { writable, type Subscriber, type Unsubscriber } from 'svelte/store';

// Loaded from the settingsjson
export class Settings {
  public routes: Route[];
  public port: number;
  private store = writable<Settings>(this);

  constructor(routes: Route[] | undefined = undefined, port: number | undefined = undefined) {
    this.routes = routes ?? [];
    this.port = port ?? 9001;
  }

  subscribe(run: Subscriber<Settings>): Unsubscriber {
    return this.store.subscribe(run);
  }

  get Routes() {
    return this.routes;
  }

  set Routes(rs: Route[]) {
    this.routes = rs;
    this.store.set(this);
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
    
    // 4) Map + validate each route however you like
    try {
      const routes = obj.routes.map((r: any) =>
        Route.fromObject(r)
      );
      return new Settings(routes, obj.port);
    } catch (err) {
      console.error("One of the routes failed to parse", err);
      return null;
    }
  }

  public async save(): Promise<boolean> {
    // Prepare the JSON with pretty printing
    const payload = { routes: this.routes, port: this.port };
    const content = JSON.stringify(payload, null, 2);

    try {
      await invoke<void>('write_file', {
        path: './HapticExtendedSettings.json',
        content
      });
      // update subscribers so UI stays in sync
      this.store.set(this);
      return true;
    } catch (err) {
      console.error('Could not write settings file', err);
      return false;
    }
  }

  public addRoute(){
    this.routes.push(new Route());
    this.store.set(this);
  }

  public removeRoute(route: Route): boolean {
    console.log(route)
    console.log(this.routes)
    const idx = this.routes.findIndex(r => r.src === route.src);
  
    if (idx == -1) {
      return false;
    }
  
    this.routes.splice(idx, 1);
    this.store.set(this);
    return true;
  }
}
