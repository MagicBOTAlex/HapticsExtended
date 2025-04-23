import { HapticSettings } from "./stores";
import {invoke} from '@tauri-apps/api/core';

export class HapticManager {
    public isRunning = false;
    
    constructor (){ 
    }

    public async start(){
        this.isRunning = true;
    }

    public async stop(){
        this.isRunning = false;
    }
}