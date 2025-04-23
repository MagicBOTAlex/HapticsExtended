import { hapticSettings } from "./stores";
import { invoke } from '@tauri-apps/api/core';
import { listen } from "@tauri-apps/api/event";
import { OscPayload, type RawOscPayload } from "@src/lib/types/OscPayload";

export class HapticManager {
    public isRunning = false;

    constructor() {

    }

    async handleOscMessage(rawPayload: RawOscPayload) {
        let oscPayload = OscPayload.fromRaw(rawPayload);
        let route = hapticSettings.routes.find(x => x.src == oscPayload.address);
        let mappedValue = this.map(oscPayload.args[0] as number, route!.mapping!.from.lower, route!.mapping!.from.upper, route!.mapping!.to.lower, route!.mapping!.to.upper); // Just gonna assume a float at 0 intex. idc anymore lol
        console.log("Senting strength: " + mappedValue);

        // console.log("Received from \"" + oscPayload.address + "\"");

        // for (let i = 0; i < oscPayload.args.length; i++)  {
        //     console.log(oscPayload.args[i]);
        // }
        // console.log(oscPayload);
    }

    public async sendToHapticInstance(strength: number = 100): Promise<any> {
        const url = 'http://192.168.50.44:82/LeftEar';
        const body = { strength };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }

            // assuming the server returns JSON
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error sending request to LeftEar:', error);
            throw error;
        }
    }


    public async start(port: number = -1) {
        this.isRunning = true;

        if (port >= 0) {
            console.warn("Setting port is still not implimented");
        }

        invoke<string>("startOscServer");
        listen<RawOscPayload>("OnOscMessage", async (event) => { await this.handleOscMessage(event.payload) });
    }

    public async stop() {
        console.warn("Stopping server is not implimented");
        // this.isRunning = false;
    }

    public map(
        value: number,
        inMin: number,
        inMax: number,
        outMin: number,
        outMax: number
    ): number {
        const mapped = ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
        return Math.min(Math.max(mapped, Math.min(outMin, outMax)), Math.max(outMin, outMax));
    }
    
}