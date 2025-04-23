#![allow(unused_variables)]
#![allow(unused_imports)]

use std::{error::Error, fs, net::UdpSocket};
use rosc::{decoder, OscPacket};
use serde::Serialize;
use tauri::{AppHandle, Emitter};

#[derive(Serialize)]
#[derive(Clone)]
struct OscPayload {
    address: String,
    args: Vec<String>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    // Return the Result directly; no need to clone
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn startOscServer(app: AppHandle) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let socket = UdpSocket::bind("0.0.0.0:9001")
        .map_err(|e| format!("Failed to bind UDP socket: {}", e))
        .ok()?;

        println!("Listening for OSC on port 9001…");

        let mut buf = [0u8; 1024];
    

        loop {
            let (size, addr) = socket
                .recv_from(&mut buf)
                .map_err(|e| format!("Receive error: {}", e))
                .ok()?;

            match decoder::decode(&buf[..size]) {
                Ok(packet) => handle_packet(&app, packet, addr.to_string()),
                Err(err)  => eprintln!("Failed to decode OSC packet: {}", err),
            }
        }
        Some(())
    });
    Ok(())
}

fn handle_packet(app: &AppHandle, packet: OscPacket, source: String) {
    if let OscPacket::Message(msg) = packet {
        let args = msg
            .args
            .iter()
            .map(|arg| format!("{:?}", arg))
            .collect::<Vec<String>>();

        let payload = OscPayload {
            address: msg.addr.clone(),
            args
        };

        app.emit_to("main", "rust-to-js", payload)
        .expect("Failed to send OSC payload.");
    }
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            read_file,
            startOscServer
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
