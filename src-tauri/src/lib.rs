#![allow(unused_variables)]
#![allow(unused_imports)]
#![allow(non_snake_case)]

use std::{error::Error, fs, net::UdpSocket};
use reqwest::Client;
use rosc::{decoder, OscPacket};
use serde::Serialize;
use tauri::{AppHandle, Emitter};

#[derive(Serialize)]
#[derive(Clone)]
struct OscPayload {
    address: String,
    args: Vec<String>,
}

#[derive(Serialize)]
struct HapticPayload{
    strength: u8,
}

#[tauri::command]
async fn sendToHapticInstance(dest: String, strength: u8) -> Result<(), String> {
    let client = Client::new();
    let payload = HapticPayload{strength};
    let json_body = serde_json::to_string(&payload)
        .map_err(|e| format!("Failed to serialize JSON: {}", e))?;

    println!("Sending to {} with strength of: {}", dest, strength);

    let response = client
        .post(dest)
        .header("Content-Type", "application/json")
        .body(json_body)
        .send()
        .await
        .map_err(|e| format!("Failed to serialize JSON: {}", e))?;

    println!("Response status: {}", response.status());
    Ok(())
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
fn write_file(path: String, content: String) -> Result<(), String> {
    // Return the Result directly; no need to clone
    fs::write(&path, &content).map_err(|e| e.to_string())
}

#[tauri::command]
fn startOscServer(app: AppHandle, serverPort: u8) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let socket = UdpSocket::bind(format!("0.0.0.0:{}", serverPort))
        .map_err(|e| format!("Failed to bind UDP socket: {}", e))
        .ok()?;

        println!("Listening for OSC on port {}", serverPort);

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

        app.emit_to("main", "OnOscMessage", payload)
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
            startOscServer,
            sendToHapticInstance,
            write_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
